import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function addParticipationPoints(
  userId: string,
  points: number,
  activityType: string,
  description?: string,
) {
  try {
    const supabase = getServiceSupabase();

    // First try to use the RPC function
    try {
      const { error } = await supabase.rpc("add_participation_points", {
        user_id_param: userId,
        points_param: points,
        activity_type_param: activityType,
        description_param: description || null,
      });

      if (!error) {
        return true;
      }

      // If RPC fails, we'll fall through to the manual method
      console.warn("RPC add_participation_points failed, using manual method");
    } catch (rpcError) {
      console.warn("RPC add_participation_points error:", rpcError);
      // Continue to manual method
    }

    // Manual method as fallback
    // 1. Update user participation count
    const { error: updateError } = await supabase
      .from("users")
      .update({
        participation_count: supabase.rpc("increment", {
          row_id: userId,
          table: "users",
          column: "participation_count",
          amount: points,
        }),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating participation count:", updateError);
      return false;
    }

    // 2. Log the points activity if participation_points table exists
    try {
      const { error: insertError } = await supabase
        .from("participation_points")
        .insert({
          user_id: userId,
          points,
          activity_type: activityType,
          description: description || null,
        });

      if (insertError && insertError.code !== "42P01") {
        // Ignore if table doesn't exist
        console.error("Error logging participation points:", insertError);
      }
    } catch (insertErr) {
      // Ignore errors here as the table might not exist
      console.warn("Could not log to participation_points table:", insertErr);
    }

    return true;
  } catch (error) {
    console.error("Exception in addParticipationPoints:", error);
    return false;
  }
}
