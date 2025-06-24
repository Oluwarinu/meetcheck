// Automated test for the attendance-aggregation Supabase Edge Function
// Usage: node scripts/test-attendance-aggregation.js

import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// --- CONFIGURATION ---
// Set these values for your Supabase project and test data
const SUPABASE_FUNCTION_URL = 'https://bdmwxjrwdejjunlisgsp.supabase.co/functions/v1/event-checkin-analytics'; // Update if needed
const USER_JWT = process.env.SUPABASE_USER_JWT || '<YOUR_USER_JWT_HERE>';
const TEST_EVENT_ID = '5e76cf23-fb94-4da9-939d-08cafd3ad5fb';

// --- TEST PAYLOAD ---
const payload = {
  event_id: TEST_EVENT_ID,
  start_time: '2024-06-01T00:00:00Z',
  end_time: '2024-06-02T00:00:00Z',
  group_by: 'hour',
  filters: {}
};

// --- MAIN TEST FUNCTION ---
async function testAttendanceAggregation() {
  if (!USER_JWT || USER_JWT.startsWith('<')) {
    console.error('ERROR: Set your SUPABASE_USER_JWT in a .env file or directly in the script.');
    process.exit(1);
  }
  if (!TEST_EVENT_ID || TEST_EVENT_ID.startsWith('<')) {
    console.error('ERROR: Set your TEST_EVENT_ID to a valid event UUID.');
    process.exit(1);
  }

  try {
    const res = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${USER_JWT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    if (res.status === 200 && data.event_id === TEST_EVENT_ID) {
      console.log('✅ Attendance aggregation test PASSED');
    } else {
      console.error('❌ Attendance aggregation test FAILED');
    }
  } catch (err) {
    console.error('❌ Error during test:', err);
  }
}

testAttendanceAggregation(); 