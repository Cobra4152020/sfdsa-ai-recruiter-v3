import { getServiceSupabase } from "@/app/lib/supabase/server";
import { startOfMonth, endOfMonth } from "date-fns";

/**
 * Generate monthly report data
 */
export async function generateMonthlyReport(
  month: Date = new Date(),
): Promise<unknown> {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);

  try {
    // Query for monthly report data
    const supabase = getServiceSupabase();
    const { data, error } = await supabase.rpc("generate_monthly_report", {
      start_date: firstDay.toISOString(),
      end_date: lastDay.toISOString(),
    });

    if (error) throw error;

    return data || {};
  } catch (error) {
    console.error("Error generating monthly report:", error);
    throw error;
  }
}
