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
    // First, check user type to determine which table to update
    const { data: userTypeData } = await supabase
      .from('user_types')
      .select('user_type')
      .eq('user_id', userId)
      .single();

    let updateSuccess = false;

    if (userTypeData?.user_type === 'recruit') {
      // Update recruits table
      const { error: recruitError } = await supabase
        .from("recruits")
        .update({
          points: supabase.rpc("increment_recruit_points", {
            user_id_param: userId,
            points_param: points,
          }),
        })
        .eq("user_id", userId);

      if (recruitError) {
        console.error("Error updating recruit points:", recruitError);
        // Fallback: use raw SQL increment
        const { error: fallbackError } = await supabase
          .from("recruits")
          .update({
            points: supabase.rpc("coalesce", [
              supabase.rpc("add", [
                supabase.rpc("select_recruit_points", { user_id_param: userId }),
                points
              ]),
              points
            ])
          })
          .eq("user_id", userId);
        
        if (!fallbackError) updateSuccess = true;
      } else {
        updateSuccess = true;
      }
    } else if (userTypeData?.user_type === 'volunteer') {
      // Update volunteer_recruiters table
      const { error: volunteerError } = await supabase
        .from("volunteer_recruiters")
        .update({
          points: supabase.rpc("increment_volunteer_points", {
            user_id_param: userId,
            points_param: points,
          }),
        })
        .eq("user_id", userId);

      if (volunteerError) {
        console.error("Error updating volunteer points:", volunteerError);
        // Fallback: simple increment
        const { data: currentData } = await supabase
          .from("volunteer_recruiters")
          .select("points")
          .eq("user_id", userId)
          .single();
        
        const newPoints = (currentData?.points || 0) + points;
        const { error: fallbackError } = await supabase
          .from("volunteer_recruiters")
          .update({ points: newPoints })
          .eq("user_id", userId);
        
        if (!fallbackError) updateSuccess = true;
      } else {
        updateSuccess = true;
      }
    } else {
      // Default to users table (participation_count)
      const { data: currentData } = await supabase
        .from("users")
        .select("participation_count")
        .eq("id", userId)
        .single();

      const newParticipationCount = (currentData?.participation_count || 0) + points;
      
      const { error: updateError } = await supabase
        .from("users")
        .update({
          participation_count: newParticipationCount,
        })
        .eq("id", userId);

      if (!updateError) {
        updateSuccess = true;
      } else {
        console.error("Error updating participation count:", updateError);
      }
    }

    if (!updateSuccess) {
      console.error("Failed to update points in any table");
      return false;
    }

    // 2. Log the points activity to user_point_logs (what dashboard reads from)
    try {
      const { error: logError } = await supabase
        .from("user_point_logs")
        .insert({
          user_id: userId,
          points,
          action: activityType,
          created_at: new Date().toISOString(),
        });

      if (logError) {
        console.error("Error logging to user_point_logs:", logError);
      } else {
        console.log(`✅ Successfully logged ${points} points to user_point_logs for ${activityType}`);
      }
    } catch (logErr) {
      console.error("Exception logging to user_point_logs:", logErr);
    }

    // 3. Also log to participation_points table if it exists (legacy/backup)
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

    console.log(`Successfully added ${points} points to user ${userId} (${userTypeData?.user_type || 'default'}) for ${activityType}`);
    return true;
  } catch (error) {
    console.error("Exception in addParticipationPoints:", error);
    return false;
  }
}
