/**
 * Singleton instance of the Supabase client.
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_BUILD === 'true';
const DISABLE_DATABASE_CHECKS = process.env.NEXT_PUBLIC_DISABLE_DATABASE_CHECKS === 'true';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback for static builds to prevent errors
if (!supabaseUrl && (typeof window === 'undefined' || STATIC_BUILD || DISABLE_DATABASE_CHECKS)) {
  supabaseUrl = 'https://placeholder-url.supabase.co';
  supabaseKey = 'placeholder-key';
  console.warn('Supabase URL/key not found, using placeholder for static build');
}

// Default export for more consistent imports
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
});

// Export the supabase client instance
export { supabase };

// For backward compatibility with old imports
export default supabase;
