// Supabase Edge Function: QR Code Check-In
// NOTE: The imports below are correct for Deno/Supabase Edge Functions, even if your local linter does not recognize them.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { verify, Payload } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Deno.env.get is available in Supabase Edge Functions runtime
const SUPABASE_URL: string = Deno?.env?.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY: string = Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SECRET: string = Deno?.env?.get('QR_SECRET') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const { token, location } = await req.json();
    if (!token) return new Response('Missing token', { status: 400 });
    // JWT verification using djwt
    let payload: Payload;
    try {
      payload = await verify(token, SECRET, "HS256");
    } catch {
      return new Response('Invalid or expired token', { status: 401 });
    }
    // Validate participant/event
    const { data: participant, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', payload.participant_id)
      .eq('event_id', payload.event_id)
      .single();
    if (error || !participant) return new Response('Invalid participant/event', { status: 400 });
    // Check if already checked in
    const { data: checkin } = await supabase
      .from('checkins')
      .select('id')
      .eq('participant_id', payload.participant_id)
      .eq('event_id', payload.event_id)
      .single();
    if (checkin) return new Response('Already checked in', { status: 200 });
    // Record check-in
    await supabase.from('checkins').insert({
      participant_id: payload.participant_id,
      event_id: payload.event_id,
      location: location || null,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('host')
    });
    return new Response('Check-in successful', { status: 200 });
  } catch (err) {
    return new Response('Server error', { status: 500 });
  }
}); 