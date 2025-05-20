import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

// Client-side singleton instance
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

/**
 * Get the Supabase client for client-side components
 */
export function getClientSideSupabase() {
  if (typeof window === 'undefined') {
    throw new Error('getClientSideSupabase should only be called on the client side')
  }

  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>({
      cookieOptions: {
        name: 'sfdsa_auth_token',
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    })
  }

  return clientInstance
}