
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  
  // Create a mock client for development
  export const supabase = createClient(
    'https://localhost:3000', 
    'mock-key', 
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}
