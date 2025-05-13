import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// This client should ONLY be used for admin functions
// WARNING: This bypasses RLS policies - use with caution!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Debug: Verify service role key is loaded
console.log('🔑 Admin Supabase Setup:');
console.log('URL:', supabaseUrl || 'NOT FOUND');
console.log('Service Key:', supabaseServiceKey ? 'Present' : 'NOT FOUND');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: Missing Supabase admin environment variables');
  throw new Error('Missing Supabase admin environment variables');
}

const adminSupabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false, // Don't persist session for admin client
      autoRefreshToken: false, // No need to refresh token for admin client
    }
  }
);

export { adminSupabase }; 