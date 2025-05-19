import { NextResponse } from "next/server"
import { getServiceSupabase } from '@/app/lib/supabase/server'

export async function correctedLoginFix() {
  try {
    const supabaseAdmin = getServiceSupabase()
    const { data: users, error } = await supabaseAdmin.from("user_types").select("user_id")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const results = []
    for (const user of users) {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(user.user_id)
      if (authError) {
        results.push({ user_id: user.user_id, error: authError.message })
        continue
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.user_id, {
        email_confirm: true,
      })

      results.push({
        user_id: user.user_id,
        email: authUser.user.email,
        success: !updateError,
        error: updateError?.message,
      })
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error("Error fixing login:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await correctedLoginFix(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in correctedLoginFix:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}