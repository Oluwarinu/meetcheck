import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Environment variables for Supabase service role key and URL
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper: Parse and validate request body
async function parseRequest(req: Request) {
  try {
    const body = await req.json();
    if (!body.event_id) throw new Error('event_id is required');
    return body;
  } catch (e) {
    throw new Error('Invalid request body');
  }
}

// Helper: Check if user is authorized to view event analytics
async function isAuthorized(userId: string, eventId: string) {
  // Only event creator or assigned admins can view analytics
  const { data, error } = await supabase
    .from('events')
    .select('created_by')
    .eq('id', eventId)
    .single();
  if (error || !data) return false;
  return data.created_by === userId;
}

// Helper: Build dynamic SQL for aggregation
function buildAggregationQuery({ event_id, start_time, end_time, group_by, filters }: any) {
  let select = `event_id, COUNT(*) as check_ins, COUNT(DISTINCT participant_id) as unique_participants`;
  let group = '';
  if (group_by === 'hour') {
    select += `, date_trunc('hour', checked_in_at) as group`;
    group = 'GROUP BY event_id, date_trunc(\'hour\', checked_in_at)';
  } else if (group_by === 'day') {
    select += `, date_trunc('day', checked_in_at) as group`;
    group = 'GROUP BY event_id, date_trunc(\'day\', checked_in_at)';
  } else if (group_by === 'type') {
    select += `, participants.type as group`;
    group = 'GROUP BY event_id, participants.type';
  }
  let where = `event_id = '${event_id}'`;
  if (start_time) where += ` AND checked_in_at >= '${start_time}'`;
  if (end_time) where += ` AND checked_in_at <= '${end_time}'`;
  if (filters && filters.participant_type) where += ` AND participants.type = '${filters.participant_type}'`;
  // Add more filters as needed
  return { select, where, group };
}

serve(async (req) => {
  // Auth: Require JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const jwt = authHeader.replace('Bearer ', '');
  // Decode JWT to get user id (sub)
  let userId = '';
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    userId = payload.sub;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JWT' }), { status: 401 });
  }

  // Parse and validate request
  let body;
  try {
    body = await parseRequest(req);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }

  // Authorization check
  const authorized = await isAuthorized(userId, body.event_id);
  if (!authorized) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  // Build aggregation query
  const { select, where, group } = buildAggregationQuery(body);

  // Query check_ins (join participants if needed)
  let query = supabase
    .from('check_ins')
    .select(select, { count: 'exact', head: false });
  if (body.group_by === 'type') {
    query = query.innerJoin('participants', 'check_ins.participant_id', 'participants.id');
  }
  query = query.filter('event_id', 'eq', body.event_id);
  if (body.start_time) query = query.gte('checked_in_at', body.start_time);
  if (body.end_time) query = query.lte('checked_in_at', body.end_time);
  if (body.filters && body.filters.participant_type) query = query.eq('participants.type', body.filters.participant_type);
  // Add more filters as needed
  if (group) query = query.group(group);

  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Format response
  let total_check_ins = 0;
  let unique_participants = 0;
  let breakdown = [];
  if (body.group_by) {
    breakdown = (data || []).map((row: any) => ({
      group: row.group,
      check_ins: row.check_ins,
      unique_participants: row.unique_participants
    }));
    total_check_ins = breakdown.reduce((sum, row) => sum + Number(row.check_ins), 0);
    unique_participants = breakdown.reduce((sum, row) => sum + Number(row.unique_participants), 0); // May double-count across groups
  } else {
    total_check_ins = data?.[0]?.check_ins || 0;
    unique_participants = data?.[0]?.unique_participants || 0;
  }

  return new Response(
    JSON.stringify({
      event_id: body.event_id,
      total_check_ins,
      unique_participants,
      breakdown
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}); 