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

    // Check if user already has a pending photo approval
    const { data: existingPending } = await supabase
      .from('profile_photo_approvals')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingPending) {
      return NextResponse.json(
        { error: "You already have a photo pending approval" },
        { status: 400 }
      );
    }

    // Insert new photo approval request
    const { data, error } = await supabase
      .from('profile_photo_approvals')
      .insert([
        {
          user_id: userId,
          photo_url: photoUrl,
          original_filename: originalFilename,
          file_size: fileSize,
          mime_type: mimeType,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error submitting photo for approval:', error);
      return NextResponse.json(
        { error: "Failed to submit photo for approval" },
        { status: 500 }
      );
    }

    // Update user profile to show pending status
    await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        pending_avatar_url: photoUrl,
        avatar_approval_status: 'pending',
        updated_at: new Date().toISOString()
      });

    return NextResponse.json({ 
      success: true, 
      message: "Photo submitted for approval",
      approval_id: data.id 
    });

  } catch (error) {
    console.error('Error in photo approval API:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 