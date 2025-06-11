import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_level?: string;
  earned_at: string;
  metadata: any;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Get user badges using correct column names from the schema
    const { data: badges, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching badges:', error);
      return NextResponse.json(
        { error: 'Failed to fetch badges', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ badges: badges || [] });
  } catch (error) {
    console.error('Server error fetching badges:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;
    const body = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { badge_name, badge_level, metadata } = body;

    if (!badge_name) {
      return NextResponse.json(
        { error: "Badge name is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check if badge already exists
    const { data: existingBadge } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_name', badge_name)
      .single();

    if (existingBadge) {
      return NextResponse.json(
        { error: 'Badge already awarded', badge: existingBadge },
        { status: 409 }
      );
    }

    // Award the badge using correct column names
    const { data: newBadge, error } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: userId,
          badge_name,
          badge_level: badge_level || 'standard',
          metadata: metadata || {}
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error awarding badge:', error);
      return NextResponse.json(
        { error: 'Failed to award badge', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      badge: newBadge,
      message: `Badge "${badge_name}" awarded successfully!`
    });

  } catch (error) {
    console.error('Server error awarding badge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
