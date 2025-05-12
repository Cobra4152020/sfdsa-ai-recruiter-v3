// Re-export the existing clients from their respective files
export { supabase } from "./supabase-client"
export { getServiceSupabase, getClientSupabase } from "./supabase-clients"

// Simple retry function with NO backslashes
export const withRetry = async <T>(\
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
)
: Promise<T> =>
{
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      console.warn(`Attempt ${i + 1}/${maxRetries} failed:`, error)
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
    }
  }

  console.error(`All ${maxRetries} retry attempts failed`)
  throw lastError
}
