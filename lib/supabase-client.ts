"use client"

import { supabase as supabaseClient } from "./supabase-client-singleton"
import { createStaticClient } from "./supabase-static"

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Export a client that's appropriate for the context
export const supabase = isBrowser && supabaseClient ? supabaseClient : createStaticClient();

// For backward compatibility with existing code
export function createClient() {
  return supabase
}

// Export the singleton instance as default for convenience
export default supabase
