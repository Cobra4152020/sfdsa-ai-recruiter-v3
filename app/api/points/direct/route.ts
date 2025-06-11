import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

// Direct points update - bypasses complex logic for emergency use
export async function POST(request: Request) {
  try {
    const { userId, points, action = 'manual_award', description } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId is required",
      }, { status: 400 });
    }

    if (!points || points <= 0) {
      return NextResponse.json({
        success: false,
        message: "points must be greater than 0",
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Get current participation count
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('participation_count, name')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create them first
      console.log('User not found, creating user record...');
      
      // Get user info from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError || !authUser) {
        console.error('Could not find user in auth.users:', authError);
        return NextResponse.json({
          success: false,
          message: "User not found in authentication system",
        }, { status: 404 });
      }

      // Create user record in public.users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.user.email,
          name: authUser.user.user_metadata?.name || authUser.user.user_metadata?.full_name || authUser.user.email?.split('@')[0] || 'User',
          participation_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating user record:', insertError);
        return NextResponse.json({
          success: false,
          message: "Failed to create user record",
        }, { status: 500 });
      }

      console.log('User record created successfully');
    } else if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json({
        success: false,
        message: "Database error while fetching user",
      }, { status: 500 });
    }

    // Now get the user data (either existing or newly created)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('participation_count, name')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user after creation:', userError);
      return NextResponse.json({
        success: false,
        message: "Failed to fetch user data",
      }, { status: 500 });
    }

    const currentPoints = userData?.participation_count || 0;
    const newPoints = currentPoints + points;

    // Update participation count directly
    const { error: updateError } = await supabase
      .from('users')
      .update({
        participation_count: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating points:', updateError);
      return NextResponse.json({
        success: false,
        message: "Failed to update points",
      }, { status: 500 });
    }

    // Try to log the activity (optional - won't fail if table doesn't exist)
    try {
      await supabase
        .from('participation_points')
        .insert({
          user_id: userId,
          points: points,
          activity_type: action,
          description: description || `Direct award: ${points} points for ${action}`,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.warn('Could not log points activity:', logError);
      // Continue anyway - logging is optional
    }

    return NextResponse.json({
      success: true,
      message: `Successfully awarded ${points} points`,
      user: {
        id: userId,
        name: userData?.name,
        previous_points: currentPoints,
        points_awarded: points,
        new_total: newPoints
      },
      action: action
    });

  } catch (error) {
    console.error('Error in direct points API:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
} 