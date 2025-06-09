import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: userId, email" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
        user: existingUser
      });
    }

    // Create user record with minimal required fields
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        name: name || 'New User',
        participation_count: 0,
        has_applied: false
      })
      .select()
      .single();

    if (createError) {
      console.error('User creation error:', createError);
      // If creation fails, still return success but log the error
      return NextResponse.json({
        success: true,
        message: "User validation attempted",
        error: createError.message
      });
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    console.error('User ensure error:', error);
    return NextResponse.json(
      { success: true, message: "User validation attempted" }, // Always return success to not block UI
      { status: 200 }
    );
  }
} 