// Supabase Edge Function: Analytics Segmentation & Cohort Analysis
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL: string = Deno?.env?.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY: string = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const filters = await req.json();
    // Example: { event_id, age_group, gender, location, time_range, event_type, registration_source }
    let query = supabase.from('checkins').select('participant_id, event_id, checkin_time');
    if (filters.event_id) query = query.eq('event_id', filters.event_id);
    if (filters.time_range && filters.time_range.start && filters.time_range.end) {
      query = query.gte('checkin_time', filters.time_range.start).lte('checkin_time', filters.time_range.end);
    }
    const { data: checkins, error } = await query;
    if (error) return new Response('Query error', { status: 500 });
    // Fetch participant metadata
    const participantIds = [...new Set(checkins.map((c: any) => c.participant_id))];
    let participants = [];
    if (participantIds.length > 0) {
      const { data } = await supabase.from('participants').select('*').in('id', participantIds);
      participants = data || [];
    }
    // Filter participants by demographics and event_type/registration_source if specified
    let filtered = checkins;
    if (filters.age_group || filters.gender || filters.location || filters.registration_source || filters.organization) {
      const filteredIds = participants.filter((p: any) => {
        return (!filters.age_group || p.age_group === filters.age_group) &&
               (!filters.gender || p.gender === filters.gender) &&
               (!filters.location || p.location === filters.location) &&
               (!filters.registration_source || p.registration_source === filters.registration_source) &&
               (!filters.organization || p.organization === filters.organization);
      }).map((p: any) => p.id);
      filtered = checkins.filter((c: any) => filteredIds.includes(c.participant_id));
    }
    // Fetch event metadata for event_type/category if needed
    let event = null;
    if (filters.event_id && (filters.event_type || filters.category)) {
      const { data } = await supabase.from('events').select('*').eq('id', filters.event_id).single();
      event = data;
      if (filters.event_type && event?.event_type !== filters.event_type) filtered = [];
      if (filters.category && event?.category !== filters.category) filtered = [];
    }
    // Aggregation breakdowns
    const by_age_group: Record<string, number> = {};
    const by_gender: Record<string, number> = {};
    const by_location: Record<string, number> = {};
    const by_registration_date: Record<string, number> = {};
    filtered.forEach((c: any) => {
      const p = participants.find((p: any) => p.id === c.participant_id);
      if (p) {
        if (p.age_group) by_age_group[p.age_group] = (by_age_group[p.age_group] || 0) + 1;
        if (p.gender) by_gender[p.gender] = (by_gender[p.gender] || 0) + 1;
        if (p.location) by_location[p.location] = (by_location[p.location] || 0) + 1;
        if (p.registered_at) {
          const date = p.registered_at.split('T')[0];
          by_registration_date[date] = (by_registration_date[date] || 0) + 1;
        }
      }
    });
    const result = {
      total_checkins: filtered.length,
      unique_attendees: new Set(filtered.map((c: any) => c.participant_id)).size,
      by_age_group,
      by_gender,
      by_location,
      by_registration_date,
    };
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response('Server error', { status: 500 });
  }
}); 