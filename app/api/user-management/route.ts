import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/app/lib/supabase/server'
import type { UserRole, UserStatus, UserWithRole, UserStats } from '@/lib/user-management-service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId')

  try {
    const supabaseAdmin = getServiceSupabase()

    switch (action) {
      case 'stats':
        const [
          { count: totalUsers },
          { count: activeUsers },
          { count: recruits },
          { count: volunteers },
          { count: admins },
          { count: pendingVolunteers },
          { count: recentSignups },
        ] = await Promise.all([
          supabaseAdmin.from("user_types").select("*", { count: "exact" }),
          supabaseAdmin.from("user_types").select("*", { count: "exact" }).eq("status", "active"),
          supabaseAdmin.from("user_types").select("*", { count: "exact" }).eq("user_type", "recruit"),
          supabaseAdmin.from("user_types").select("*", { count: "exact" }).eq("user_type", "volunteer"),
          supabaseAdmin.from("user_types").select("*", { count: "exact" }).eq("user_type", "admin"),
          supabaseAdmin.from("volunteer.recruiters").select("*", { count: "exact" }).eq("is_active", false),
          supabaseAdmin
            .from("user_types")
            .select("*", { count: "exact" })
            .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        ])

        return NextResponse.json({
          total_users: totalUsers || 0,
          active_users: activeUsers || 0,
          recruits: recruits || 0,
          volunteers: volunteers || 0,
          admins: admins || 0,
          pending_volunteers: pendingVolunteers || 0,
          recent_signups: recentSignups || 0,
        })

      case 'activity':
        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const { data: activities, error: activityError } = await supabaseAdmin
          .from('user_activity')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50)

        if (activityError) throw activityError
        return NextResponse.json(activities)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in user management API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { action, userId, data } = await request.json()

  try {
    const supabaseAdmin = getServiceSupabase()

    switch (action) {
      case 'delete':
        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const { data: userType, error: userTypeError } = await supabaseAdmin
          .from("user_types")
          .select("user_type")
          .eq("user_id", userId)
          .single()

        if (userTypeError) throw userTypeError
        if (!userType) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        let error: unknown = null
        switch (userType.user_type) {
          case "recruit":
            ;({ error } = await supabaseAdmin.from("recruit.users").delete().eq("id", userId))
            break
          case "volunteer":
            ;({ error } = await supabaseAdmin.from("volunteer.recruiters").delete().eq("id", userId))
            break
          case "admin":
            ;({ error } = await supabaseAdmin.from("admin.users").delete().eq("id", userId))
            break
        }

        if (error) throw error
        ;({ error } = await supabaseAdmin.from("user_types").delete().eq("user_id", userId))
        if (error) throw error

        return NextResponse.json({ success: true })

      case 'approve':
        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const { error: approveError } = await supabaseAdmin
          .from("volunteer.recruiters")
          .update({
            is_active: true,
            is_verified: true,
            verified_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (approveError) throw approveError
        return NextResponse.json({ success: true })

      case 'reject':
        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const { error: rejectError } = await supabaseAdmin
          .from("volunteer.recruiters")
          .delete()
          .eq("id", userId)

        if (rejectError) throw rejectError
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in user management API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 