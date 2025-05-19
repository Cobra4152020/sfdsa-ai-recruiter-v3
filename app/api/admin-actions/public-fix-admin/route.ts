import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function publicFixAdminProfile(userId: string, adminEmail: string, securityCode: string) {
  try {
    // Verify security code matches env var or is the hardcoded emergency code
    const validCode = process.env.ADMIN_RECOVERY_CODE || "sfdsa-emergency-admin-fix"
    if (securityCode !== validCode) {
      return {
        success: false,
        message: "Invalid security code. For security reasons, please use the correct code.",
      }
    }

    // Check if user exists in auth
    const supabase = getServiceSupabase()
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)

    if (userError || !userData.user) {
      return {
        success: false,
        message: `User with ID ${userId} not found in auth system.`,
      }
    }

    // Verify email matches
    if (userData.user.email !== adminEmail) {
      return {
        success: false,
        message: "User ID and email do not match. Please provide the correct email for this user ID.",
      }
    }

    // Check if admin schema exists, create if not
    const { error: schemaCheckError } = await supabase.rpc("check_if_schema_exists", { schema_name: "admin" })

    if (schemaCheckError) {
      // Create admin schema
      await supabase.sql`CREATE SCHEMA IF NOT EXISTS admin;`
    }

    // Check if admin.users table exists, create if not
    const { error: tableCheckError } = await supabase.rpc("check_if_table_exists", {
      schema_name: "admin",
      table_name: "users",
    })

    if (tableCheckError) {
      // Create admin.users table
      await supabase.sql`
        CREATE TABLE IF NOT EXISTS admin.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }

    // Check if user has entry in user_types
    const { data: userTypeData, error: userTypeError } = await supabase
      .from("user_types")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    if (userTypeError) {
      return {
        success: false,
        message: `Error checking user type: ${userTypeError.message}`,
      }
    }

    // Create or update user_types entry
    if (!userTypeData) {
      const { error: insertError } = await supabase.from("user_types").insert({
        user_id: userId,
        user_type: "admin",
        email: adminEmail,
      })

      if (insertError) {
        return {
          success: false,
          message: `Error creating user type: ${insertError.message}`,
        }
      }
    } else if (userTypeData.user_type !== "admin") {
      const { error: updateError } = await supabase
        .from("user_types")
        .update({ user_type: "admin" })
        .eq("user_id", userId)

      if (updateError) {
        return {
          success: false,
          message: `Error updating user type: ${updateError.message}`,
        }
      }
    }

    // Check if user has entry in admin.users
    const { data: adminUserData, error: adminUserError } = await supabase
      .from("admin.users")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (adminUserError && !adminUserError.message.includes("does not exist")) {
      return {
        success: false,
        message: `Error checking admin user: ${adminUserError.message}`,
      }
    }

    // Create or update admin.users entry
    if (!adminUserData) {
      const { error: insertError } = await supabase.from("admin.users").insert({
        id: userId,
        email: adminEmail,
        name: userData.user.user_metadata?.name || adminEmail.split("@")[0],
      })

      if (insertError) {
        // Try with regular insert if RLS is causing problems
        try {
          await supabase.sql`
            INSERT INTO admin.users (id, email, name) 
            VALUES (${userId}, ${adminEmail}, ${userData.user.user_metadata?.name || adminEmail.split("@")[0]})
            ON CONFLICT (id) DO UPDATE SET
            email = ${adminEmail},
            updated_at = NOW();
          `
        } catch (sqlError) {
          return {
            success: false,
            message: `Error creating admin user: ${insertError.message}\nSQL error: ${String(sqlError)}`,
          }
        }
      }
    }

    // Check if user has admin role in user_roles
    const { data: userRoleData, error: userRoleError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()

    if (userRoleError) {
      return {
        success: false,
        message: `Error checking user role: ${userRoleError.message}`,
      }
    }

    // Create admin role if not exists
    if (!userRoleData) {
      const { error: insertError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
        assigned_at: new Date().toISOString(),
        is_active: true,
      })

      if (insertError) {
        return {
          success: false,
          message: `Error creating admin role: ${insertError.message}`,
        }
      }
    }

    // Ensure RLS policies are set up correctly
    await supabase.sql`
      -- Enable RLS on admin.users
      ALTER TABLE admin.users ENABLE ROW LEVEL SECURITY;

      -- Policy to allow users to view their own data
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'users' AND schemaname = 'admin' AND policyname = 'Users can view own data'
        ) THEN
          CREATE POLICY "Users can view own data" ON admin.users
            FOR SELECT USING (auth.uid() = id);
        END IF;
      END
      $$;

      -- Policy to allow admins to view all data
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'users' AND schemaname = 'admin' AND policyname = 'Admins can view all data'
        ) THEN
          CREATE POLICY "Admins can view all data" ON admin.users
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM public.user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
              )
            );
        END IF;
      END
      $$;
    `

        
    return {
      success: true,
      message: "Admin profile fixed successfully. You should now be able to log in.",
    }
  } catch (error) {
    console.error("Error fixing admin profile:", error)
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
    const result = await publicFixAdminProfile(body.userId, body.adminEmail, body.securityCode);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in publicFixAdmin:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}