
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-service"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone, organization, position, location } = await request.json()

    // Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("user_types")
      .select("user_id, user_type")
      .eq("email", email)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please sign in instead." },
        { status: 400 },
      )
    }

    // Create the user in Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone,
        organization,
        position,
        location,
      },
    })

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!data.user) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
    }

    // Create the volunteer profile in the database
    const { error: insertError } = await supabaseAdmin.from("volunteer.recruiters").insert({
      id: data.user.id,
      email: data.user.email,
      first_name: firstName,
      last_name: lastName,
      phone,
      organization,
      position,
      location,
      is_active: false, // Requires verification
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating volunteer profile:", insertError)
      return NextResponse.json({ message: "User created but profile setup failed" }, { status: 500 })
    }

    // Set user type
    const { error: typeError } = await supabaseAdmin.from("user_types").insert({
      user_id: data.user.id,
      user_type: "volunteer",
      email: data.user.email,
    })

    if (typeError) {
      console.error("Error setting user type:", typeError)
      return NextResponse.json({ message: "User created but type setup failed" }, { status: 500 })
    }

    // Send email notification to admins about new volunteer recruiter
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/notify-volunteer-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: data.user.id,
          firstName,
          lastName,
          email,
          organization,
        }),
      })
    } catch (emailError) {
      console.error("Error sending admin notification:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Volunteer registered successfully. Your account requires approval.",
      userId: data.user.id,
      userType: "volunteer",
      email: data.user.email,
      name: `${firstName} ${lastName}`,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
