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
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
        user: existingUser
      });
    }

    // Create user record with minimal fields
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        name: name || email.split('@')[0]
      })
      .select()
      .single();

    if (createError) {
      console.error('User creation error:', createError);
      return NextResponse.json(
        { success: false, message: "Failed to create user", error: createError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 