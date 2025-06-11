export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { recordAttendance } from "@/lib/daily-briefing-service";
import { getServiceSupabase } from "@/app/lib/supabase/server";
import { addParticipationPoints } from "@/lib/points-service";

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get the user from the access token
    const supabase = getServiceSupabase();
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("User authentication error:", userError);
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 },
      );
    }

    console.log("User authenticated for attendance:", user.id);

    // Get briefing ID from request body
    const { briefingId } = await request.json();

    if (!briefingId) {
      return NextResponse.json(
        { error: "Briefing ID is required" },
        { status: 400 },
      );
    }

    console.log("Recording attendance for briefing:", briefingId);

    // Record attendance
    const success = await recordAttendance(user.id, briefingId);

    console.log("Attendance recording result:", success);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to record attendance" },
        { status: 500 },
      );
    }

    // Award 5 points for attendance using the new unified system
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL;
      const pointsResponse = await fetch(`${baseUrl}/api/user/points-unified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          pointsToAdd: 5,
          action: 'daily_briefing_attendance',
          description: 'Attended Sgt. Ken\'s Daily Briefing'
        })
      });

      if (pointsResponse.ok) {
        const pointsResult = await pointsResponse.json();
        console.log('Successfully awarded 5 points via unified API:', pointsResult);
      } else {
        throw new Error('Unified points API failed');
      }
    } catch (pointsError) {
      console.error('Error with unified points API, using fallback:', pointsError);
      
      // Fallback: Try direct database update to user_profiles
      try {
        const { data: currentProfile } = await supabase
          .from('user_profiles')
          .select('participation_count')
          .eq('id', user.id)
          .single();
        
        const newTotal = (currentProfile?.participation_count || 0) + 5;
        
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            participation_count: newTotal,
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id);
          
        if (!updateError) {
          console.log('Successfully updated points via user_profiles fallback');
        } else {
          console.error('Fallback points update also failed:', updateError);
        }
      } catch (fallbackError) {
        console.error('Fallback points update failed:', fallbackError);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Attendance recorded and points awarded"
    });
  } catch (error) {
    console.error("Error in attendance API:", error);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 },
    );
  }
}
