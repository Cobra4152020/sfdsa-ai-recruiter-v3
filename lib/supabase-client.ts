"use client"

import { createStaticClient } from "./supabase-static"

// Create and export a singleton instance
export const supabase = createStaticClient()

// For backward compatibility with existing code
export function createClient() {
  return supabase
}

// Export the singleton instance as default for convenience
export default supabase
