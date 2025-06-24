// Script to seed a test event, participant, and check-in in Supabase
// Usage: node scripts/seed-test-event.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function seed() {
  // Use provided test user
  const testUserId = '3d7404d0-c2ec-4c12-bbb2-b084da00005c';
  const testUserEmail = 'rinadcouture@gmail.com';

  // Ensure user_profile exists for the test user
  const { data: existingProfile, error: profileQueryError } = await supabase
    .from('user_profile')
    .select('id')
    .eq('id', testUserId)
    .single();
  if (!existingProfile) {
    const { error: insertProfileError } = await supabase
      .from('user_profile')
      .insert([{ id: testUserId, full_name: 'Test User', email: testUserEmail, created_at: new Date().toISOString() }]);
    if (insertProfileError) {
      console.error('Error creating user_profile:', insertProfileError);
      process.exit(1);
    }
    console.log('Created user_profile for test user:', testUserId);
  } else {
    console.log('user_profile already exists for test user:', testUserId);
  }

  // 1. Create test event
  const event = {
    organizer_id: testUserId,
    title: 'Test Event',
    description: 'Seeded event for automated testing',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    location: 'Test Location',
    capacity: 100,
    flier_url: '',
    status: 'published',
    event_type: 'test',
    category: 'test',
    expected_attendance: 10
  };
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();
  if (eventError) {
    console.error('Error creating event:', eventError);
    process.exit(1);
  }
  console.log('Created event:', eventData.id);

  // 2. Create participant
  const participant = {
    event_id: eventData.id,
    user_id: testUserId,
    name: 'Test Participant',
    email: testUserEmail,
    registered_at: new Date().toISOString(),
    location: 'Test Location'
  };
  const { data: participantData, error: participantError } = await supabase
    .from('participants')
    .insert([participant])
    .select()
    .single();
  if (participantError) {
    console.error('Error creating participant:', participantError);
    process.exit(1);
  }
  console.log('Created participant:', participantData.id);

  // 3. Create check-in
  const checkin = {
    participant_id: participantData.id,
    event_id: eventData.id,
    checkin_time: new Date().toISOString(),
    location: 'Test Location',
    ip_address: '127.0.0.1'
  };
  const { data: checkinData, error: checkinError } = await supabase
    .from('checkins')
    .insert([checkin])
    .select()
    .single();
  if (checkinError) {
    console.error('Error creating check-in:', checkinError);
    process.exit(1);
  }
  console.log('Created check-in:', checkinData.id);

  // Print all IDs for reference
  console.log('\nUse this event ID in your test script:', eventData.id);
}

seed(); 