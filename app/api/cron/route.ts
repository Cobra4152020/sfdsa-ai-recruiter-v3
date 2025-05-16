import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify cron secret to ensure only authorized calls
const verifyCronSecret = (request: Request): boolean => {
  const cronSecret = request.headers.get('x-cron-secret');
  return cronSecret === process.env.CRON_SECRET;
};

// Handle scheduled tasks
async function handleScheduledTasks() {
  const now = new Date();
  
  try {
    // Clean up old security events (older than 30 days)
    await supabase
      .from('security_events')
      .delete()
      .lt('created_at', new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Clean up old alerts (older than 7 days)
    await supabase
      .from('security_alerts')
      .delete()
      .lt('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Unblock IPs that have been blocked for more than 24 hours
    await supabase
      .from('blocked_ips')
      .delete()
      .lt('blocked_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString());

    // Update materialized views
    await supabase.rpc('refresh_leaderboard_view');
    await supabase.rpc('refresh_daily_stats_view');
    
    return { success: true, message: 'Scheduled tasks completed successfully' };
  } catch (error) {
    console.error('Error in scheduled tasks:', error);
    return { success: false, error: 'Failed to complete scheduled tasks' };
  }
}

export async function POST(request: Request) {
  // Verify the request is authorized
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const result = await handleScheduledTasks();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 