import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId, photoUrl, originalFilename, fileSize, mimeType } = await request.json();

    if (!userId || !photoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // For now, let's just store the photo approval request in user_profiles
    // This is a simplified approach until the full database schema is set up
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        pending_avatar_url: photoUrl,
        avatar_approval_status: 'pending',
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error submitting photo for approval:', error);
      return NextResponse.json(
        { error: "Failed to submit photo for approval" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Photo submitted for approval" 
    });

  } catch (error) {
    console.error('Error in photo approval API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 