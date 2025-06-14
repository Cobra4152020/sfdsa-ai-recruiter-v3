import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Get raw body first for debugging
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);
    
    // Parse the JSON
    const { userId, points, action, description } = JSON.parse(rawBody);
    console.log('Points award request:', { userId, points, action, description });

    if (!userId || !points || !action) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, points, action" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Simple approach - just check what user data exists first
    console.log('Checking user existence...');
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, participation_count')
      .eq('id', userId)
      .single();

    console.log('User fetch result:', { existingUser, fetchError });

    if (fetchError) {
      console.error('User fetch failed:', fetchError);
      return NextResponse.json(
        { success: false, message: "User not found", error: fetchError },
        { status: 404 }
      );
    }

    // Calculate new total
    const currentPoints = existingUser?.participation_count || 0;
    const newTotal = currentPoints + points;
    
    console.log('Points calculation:', { currentPoints, points, newTotal });

    // Update the user's points
    const { error: updateError } = await supabase
      .from('users')
      .update({
        participation_count: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    console.log('Update result:', { updateError });

    if (updateError) {
      console.error('Points update failed:', updateError);
      return NextResponse.json(
        { success: false, message: "Failed to update points", error: updateError },
        { status: 500 }
      );
    }

    // Insert into points log for history tracking
    const { error: logError } = await supabase
      .from('user_point_logs')
      .insert({
        user_id: userId,
        action: action,
        points: points,
        description: description || `${action} - ${points} points`,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Points log insertion failed:', logError);
      // Don't fail the entire request if log insertion fails
    } else {
      console.log('Points log entry created successfully');
    }

    console.log('Points awarded successfully!');
    return NextResponse.json({
      success: true,
      awarded: true,
      pointsAwarded: points,
      newTotal: newTotal,
      message: `Successfully awarded ${points} points`
    });

  } catch (error) {
    console.error('Points award error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
