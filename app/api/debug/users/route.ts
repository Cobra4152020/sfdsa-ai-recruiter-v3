import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      // Check specific user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      return NextResponse.json({
        success: !userError,
        user: user,
        error: userError,
        userKeys: user ? Object.keys(user) : []
      });
    } else {
      // List all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, name, participation_count, created_at')
        .limit(10);

      return NextResponse.json({
        success: !usersError,
        users: users,
        count: users?.length || 0,
        error: usersError
      });
    }

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
} 