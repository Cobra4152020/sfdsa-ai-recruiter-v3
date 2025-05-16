import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"

export async function recoverAdminUser(email: string, recoveryCode: string) {
  try {
    // Verify recovery code
    const expectedCode = process.env.ADMIN_RECOVERY_CODE
    if (!expectedCode || recoveryCode !== expectedCode) {
      return { success: false, message: "Invalid recovery code" }
    }

    const supabase = getServiceSupabase()

    // Step 1: Find the user in Auth
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error listing users:", userError)
      return { success: false, message: "Failed to list users: " + userError.message }
    }

    const user = userData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return { success: false, message: "User not found in Auth system" }
    }

    const userId = user.id

    // Step 2: Create admin schema if it doesn't exist
    await supabase
      .rpc("exec_sql", {
        sql_query: "CREATE SCHEMA IF NOT EXISTS admin;",
      })
      .catch((err) => {
        console.log("Error creating admin schema, trying direct SQL", err)
        return supabase.auth.admin.executeRaw(`CREATE SCHEMA IF NOT EXISTS admin;`)
      })

    // Step 3: Create admin.users table if it doesn't exist
    await supabase
      .rpc("exec_sql", {
        sql_query: `
        CREATE TABLE IF NOT EXISTS admin.users (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      })
      .catch((err) => {
        console.log("Error creating admin.users table, trying direct SQL", err)
        return supabase.auth.admin.executeRaw(`
        CREATE TABLE IF NOT EXISTS admin.users (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)
      })

    // Step 4: Create user_types table if it doesn't exist
    await supabase
      .rpc("exec_sql", {
        sql_query: `
        CREATE TABLE IF NOT EXISTS user_types (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          user_type TEXT NOT NULL,
          email TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      })
      .catch((err) => {
        console.log("Error creating user_types table, trying direct SQL", err)
        // Continue anyway, table might already exist
      })

    // Step 5: Create user_roles table if it doesn't exist
    await supabase
      .rpc("exec_sql", {
        sql_query: `
        CREATE TABLE IF NOT EXISTS user_roles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          role TEXT NOT NULL,
          assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT TRUE,
          UNIQUE(user_id, role)
        );
      `,
      })
      .catch((err) => {
        console.log("Error creating user_roles table, trying direct SQL", err)
        // Continue anyway, table might already exist
      })

    // Step 6: Insert the admin user
    const { error: insertError } = await supabase.from("admin.users").upsert({
      id: userId,
      email: email,
      name: user.user_metadata?.name || email.split("@")[0] || "Admin User",
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.log("Error inserting admin user, trying RPC", insertError)
      // If direct insert fails, try using RPC
      await supabase
        .rpc("exec_sql", {
          sql_query: `
          INSERT INTO admin.users (id, email, name, updated_at)
          VALUES ('${userId}', '${email}', '${user.user_metadata?.name || email.split("@")[0] || "Admin User"}', '${new Date().toISOString()}')
          ON CONFLICT (id) DO UPDATE SET 
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            updated_at = EXCLUDED.updated_at;
        `,
        })
        .catch((err) => {
          console.log("Error inserting admin user via RPC, trying direct SQL", err)
          return supabase.auth.admin.executeRaw(`
          INSERT INTO admin.users (id, email, name, updated_at)
          VALUES ('${userId}', '${email}', '${user.user_metadata?.name || email.split("@")[0] || "Admin User"}', '${new Date().toISOString()}')
          ON CONFLICT (id) DO UPDATE SET 
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            updated_at = EXCLUDED.updated_at;
        `)
        })
    }

    // Step 7: Ensure user_types entry exists
    const { error: userTypeError } = await supabase.from("user_types").upsert({
      user_id: userId,
      user_type: "admin",
      email: email,
    })

    if (userTypeError) {
      console.log("Error inserting user_types, trying RPC", userTypeError)
      await supabase
        .rpc("exec_sql", {
          sql_query: `
          INSERT INTO user_types (user_id, user_type, email)
          VALUES ('${userId}', 'admin', '${email}')
          ON CONFLICT (user_id) DO UPDATE SET user_type = 'admin', email = '${email}';
        `,
        })
        .catch((err) => {
          console.log("Error inserting user_types via RPC, trying direct SQL", err)
          return supabase.auth.admin.executeRaw(`
          INSERT INTO user_types (user_id, user_type, email)
          VALUES ('${userId}', 'admin', '${email}')
          ON CONFLICT (user_id) DO UPDATE SET user_type = 'admin', email = '${email}';
        `)
        })
    }

    // Step 8: Ensure user_roles entry exists
    const { error: userRoleError } = await supabase.from("user_roles").upsert({
      user_id: userId,
      role: "admin",
      assigned_at: new Date().toISOString(),
      is_active: true,
    })

    if (userRoleError) {
      console.log("Error inserting user_roles, trying RPC", userRoleError)
      await supabase
        .rpc("exec_sql", {
          sql_query: `
          INSERT INTO user_roles (user_id, role, assigned_at, is_active)
          VALUES ('${userId}', 'admin', '${new Date().toISOString()}', true)
          ON CONFLICT (user_id, role) DO UPDATE SET 
            is_active = true,
            assigned_at = EXCLUDED.assigned_at;
        `,
        })
        .catch((err) => {
          console.log("Error inserting user_roles via RPC, trying direct SQL", err)
          return supabase.auth.admin.executeRaw(`
          INSERT INTO user_roles (user_id, role, assigned_at, is_active)
          VALUES ('${userId}', 'admin', '${new Date().toISOString()}', true)
          ON CONFLICT (user_id, role) DO UPDATE SET 
            is_active = true,
            assigned_at = EXCLUDED.assigned_at;
        `)
        })
    }

    // Step 9: Create recruit.users table if it doesn't exist (as a fallback)
    await supabase
      .rpc("exec_sql", {
        sql_query: `
        CREATE SCHEMA IF NOT EXISTS recruit;
        
        CREATE TABLE IF NOT EXISTS recruit.users (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          avatar_url TEXT,
          points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      })
      .catch((err) => {
        console.log("Error creating recruit schema/tables, continuing anyway", err)
        // Continue anyway, not critical for admin login
      })

        
    return {
      success: true,
      message: "Admin user recovery completed successfully. You should now be able to log in.",
      userId: userId,
    }
  } catch (error) {
    console.error("Error recovering admin user:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await publicAdminRecovery(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in publicAdminRecovery:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}