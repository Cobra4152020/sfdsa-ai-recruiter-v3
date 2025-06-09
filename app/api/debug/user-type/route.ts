import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    // Check user type
    const { data: userTypeData, error: userTypeError } = await supabase
      .from('user_types')
      .select('user_type')
      .eq('user_id', userId)
      .single();

    // Check users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('participation_count, name, email')
      .eq('id', userId)
      .single();

    // Check recruits table
    const { data: recruitData, error: recruitError } = await supabase
      .from('recruits')
      .select('points')
      .eq('user_id', userId)
      .single();

    // Check volunteer_recruiters table
    const { data: volunteerData, error: volunteerError } = await supabase
      .from('volunteer_recruiters')
      .select('points')
      .eq('user_id', userId)
      .single();

    // Check briefing attendance
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('briefing_attendance')
      .select('*')
      .eq('user_id', userId);

    // Check chat interactions
    const { data: chatData, error: chatError } = await supabase
      .from('chat_interactions')
      .select('created_at, message, session_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Check participation points log
    let participationData = null;
    let participationError = null;
    try {
      const result = await supabase
        .from('participation_points')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      participationData = result.data;
      participationError = result.error;
    } catch (e) {
      participationError = { message: "Table doesn't exist" };
    }

    return NextResponse.json({
      success: true,
      userId,
      userType: userTypeData?.user_type || null,
      userTypeError: userTypeError?.message || null,
      users: {
        data: userData,
        error: userError?.message || null
      },
      recruits: {
        data: recruitData,
        error: recruitError?.message || null
      },
      volunteers: {
        data: volunteerData,
        error: volunteerError?.message || null
      },
      briefingAttendance: {
        count: attendanceData?.length || 0,
        data: attendanceData?.slice(0, 3) || [],
        error: attendanceError?.message || null
      },
      chatInteractions: {
        count: chatData?.length || 0,
        data: chatData?.slice(0, 3) || [],
        error: chatError?.message || null
      },
      participationPoints: {
        count: participationData?.length || 0,
        data: participationData?.slice(0, 5) || [],
        error: participationError?.message || null
      },
      summary: {
        expectedPointsSource: userTypeData?.user_type === 'recruit' ? 'recruits.points' 
          : userTypeData?.user_type === 'volunteer' ? 'volunteer_recruiters.points' 
          : 'users.participation_count',
        currentPoints: userTypeData?.user_type === 'recruit' ? recruitData?.points || 0
          : userTypeData?.user_type === 'volunteer' ? volunteerData?.points || 0
          : userData?.participation_count || 0
      }
    });

  } catch (error) {
    console.error('Debug user type error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 