import { NextResponse } from "next/server"
import { getServiceSupabase } from '@/app/lib/supabase/server'

export async function fixAdminProfile(userId: string) {
  try {
    const supabaseAdmin = getServiceSupabase()
    // 1. Check if user exists in auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (authError || !authUser.user) {
      return { success: false, error: "User not found in auth" }
    }

    // 2. Check user_types table
    const { data: userType, error: userTypeError } = await supabaseAdmin
      .from("user_types")
      .select("user_type")
      .eq("user_id", userId)
      .single()

    if (userTypeError && userTypeError.code !== "PGRST116") {
      return { success: false, error: `Error checking user type: ${userTypeError.message}` }
    }

    // 3. Insert or update user_types if needed
    if (!userType) {
      const { error: insertTypeError } = await supabaseAdmin.from("user_types").insert({
        user_id: userId,
        user_type: "admin",
        created_at: new Date().toISOString(),
      })

      if (insertTypeError) {
        return { success: false, error: `Error inserting user type: ${insertTypeError.message}` }
      }
    } else if (userType.user_type !== "admin") {
      const { error: updateTypeError } = await supabaseAdmin
        .from("user_types")
        .update({ user_type: "admin" })
        .eq("user_id", userId)

      if (updateTypeError) {
        return { success: false, error: `Error updating user type: ${updateTypeError.message}` }
      }
    }

    // 4. Check if admin schema exists and create if needed
    const { data: schemas } = await supabaseAdmin
      .from("information_schema.schemata")
      .select("schema_name")
      .eq("schema_name", "admin")

    if (!schemas || schemas.length === 0) {
      // Create admin schema
      await supabaseAdmin.rpc("exec_sql", { sql: "CREATE SCHEMA IF NOT EXISTS admin;" })
    }

    // 5. Check if admin.users table exists and create if needed
    const { data: tables } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "admin")
      .eq("table_name", "users")

    if (!tables || tables.length === 0) {
      // Create admin.users table
      await supabaseAdmin.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS admin.users (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `,
      })
    }

    // 6. Check if user exists in admin.users
    const { data: adminUser, error: adminUserError } = await supabaseAdmin
      .from("admin.users")
      .select("id")
      .eq("id", userId)
      .single()

    if (adminUserError && adminUserError.code !== "PGRST116") {
      return { success: false, error: `Error checking admin user: ${adminUserError.message}` }
    }

    // 7. Insert user into admin.users if not exists
    if (!adminUser) {
      const { error: insertError } = await supabaseAdmin.from("admin.users").insert({
        id: userId,
        email: authUser.user.email || "",
        name: authUser.user.user_metadata?.name || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (insertError) {
        return { success: false, error: `Error inserting admin user: ${insertError.message}` }
      }
    }

    // 8. Check user_roles table
    const { data: userRole, error: userRoleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single()

    if (userRoleError && userRoleError.code !== "PGRST116") {
      return { success: false, error: `Error checking user role: ${userRoleError.message}` }
    }

    // 9. Insert or update user_roles if needed
    if (!userRole) {
      const { error: insertRoleError } = await supabaseAdmin.from("user_roles").insert({
        user_id: userId,
        role: "admin",
        created_at: new Date().toISOString(),
      })

      if (insertRoleError) {
        return { success: false, error: `Error inserting user role: ${insertRoleError.message}` }
      }
    } else if (userRole.role !== "admin") {
      const { error: updateRoleError } = await supabaseAdmin
        .from("user_roles")
        .update({ role: "admin" })
        .eq("user_id", userId)

      if (updateRoleError) {
        return { success: false, error: `Error updating user role: ${updateRoleError.message}` }
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error fixing admin profile:", error)
    return { success: false, error: error.message }
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await fixAdminProfile(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in fixAdminProfile:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}