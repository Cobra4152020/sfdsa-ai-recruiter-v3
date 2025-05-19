import { getServiceSupabase } from '@/app/lib/supabase/server'
import { startOfMonth, endOfMonth } from "date-fns"

/**
 * Generate monthly report data
 */
export async function generateMonthlyReport(month: Date = new Date()): Promise<any> {
  const firstDay = startOfMonth(month)
  const lastDay = endOfMonth(month)

  try {
    // Query for monthly report data
    const { data, error } = await getServiceSupabase.rpc("generate_monthly_report", {
      start_date: firstDay.toISOString(),
      end_date: lastDay.toISOString(),
    })

    if (error) throw error

    return data || {}
  } catch (error) {
    console.error("Error generating monthly report:", error)
    throw error
  }
} 