import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-service"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate inputs
    if (!name || !email || !password) {
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
        name,
      },
    })

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    if (!data.user) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
    }

    // Create the user profile in the database
    const { error: insertError } = await supabaseAdmin.from("recruit.users").insert({
      id: data.user.id,
      email: data.user.email,
      name: name,
      points: 50, // Initial points
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      return NextResponse.json({ message: "User created but profile setup failed" }, { status: 500 })
    }

    // Set user type
    const { error: typeError } = await supabaseAdmin.from("user_types").insert({
      user_id: data.user.id,
      user_type: "recruit",
      email: data.user.email,
    })

    if (typeError) {
      console.error("Error setting user type:", typeError)
      return NextResponse.json({ message: "User created but type setup failed" }, { status: 500 })
    }

    // Log the initial points
    try {
      await supabaseAdmin.from("user_point_logs").insert([
        {
          user_id: data.user.id,
          points: 50,
          action: "Initial signup bonus",
          created_at: new Date().toISOString(),
        },
      ])
    } catch (logError) {
      console.error("Error logging initial points:", logError)
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      userId: data.user.id,
      userType: "recruit",
      email: data.user.email,
      name: name,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
