import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

// Create user record in public.users table
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId is required",
      }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User record already exists",
        user: existingUser
      });
    }

    // Get user info from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !authUser) {
      console.error('Could not find user in auth.users:', authError);
      return NextResponse.json({
        success: false,
        message: "User not found in authentication system",
      }, { status: 404 });
    }

    // Create user record
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: authUser.user.email,
        name: authUser.user.user_metadata?.name || authUser.user.user_metadata?.full_name || authUser.user.email?.split('@')[0] || 'User',
        participation_count: 0,
        has_applied: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user record:', insertError);
      return NextResponse.json({
        success: false,
        message: "Failed to create user record",
        error: insertError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "User record created successfully",
      user: newUser,
      auth_user: {
        id: authUser.user.id,
        email: authUser.user.email,
        metadata: authUser.user.user_metadata
      }
    });

  } catch (error) {
    console.error('Error in create user record API:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
} 