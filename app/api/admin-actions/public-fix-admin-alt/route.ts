import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a direct supabase admin client without using the existing service
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper function to execute SQL with error handling
async function executeSql(query: string, params: unknown[] = []) {
  const supabase = getAdminClient();
  const { error } = await supabase.rpc("exec_sql", {
    sql_query: query,
    params_array: params,
  });

  if (error) {
    throw new Error(`SQL error: ${error.message}`);
  }
}

export async function publicFixAdminProfile(
  userId: string,
  adminEmail: string,
  securityCode: string,
) {
  try {
    // Verify security code matches env var or is the hardcoded emergency code
    const validCode =
      process.env.ADMIN_RECOVERY_CODE || "sfdsa-emergency-admin-fix";
    if (securityCode !== validCode) {
      return {
        success: false,
        message:
          "Invalid security code. For security reasons, please use the correct code.",
      };
    }

    const supabase = getAdminClient();

    // Check if user exists in auth
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
      return {
        success: false,
        message: `User with ID ${userId} not found in auth system.`,
      };
    }

    // Verify email matches
    if (userData.user.email !== adminEmail) {
      return {
        success: false,
        message:
          "User ID and email do not match. Please provide the correct email for this user ID.",
      };
    }

    // Create admin schema if it doesn't exist
    try {
      await executeSql("CREATE SCHEMA IF NOT EXISTS admin;");
    } catch (error) {
      console.log("Error creating admin schema, may already exist:", error);
      // Continue anyway
    }

    // Create admin.users table if it doesn't exist
    try {
      await executeSql(`
        CREATE TABLE IF NOT EXISTS admin.users (
          id UUID PRIMARY KEY,
          email TEXT NOT NULL,
          name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    } catch (error) {
      console.log(
        "Error creating admin.users table, may already exist:",
        error,
      );
      // Continue anyway
    }

    // Check if user_types table exists
    try {
      await executeSql(
        `
        INSERT INTO public.user_types (user_id, user_type, email)
        VALUES ($1, 'admin', $2)
        ON CONFLICT (user_id) 
        DO UPDATE SET user_type = 'admin', email = $2;
      `,
        [userId, adminEmail],
      );
    } catch (error) {
      return {
        success: false,
        message: `Failed to update user_types: ${String(error)}`,
      };
    }

    // Insert admin user record
    try {
      const userName =
        userData.user.user_metadata?.name || adminEmail.split("@")[0];

      await executeSql(
        `
        INSERT INTO admin.users (id, email, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) 
        DO UPDATE SET email = $2, name = $3, updated_at = NOW();
      `,
        [userId, adminEmail, userName],
      );
    } catch (error) {
      return {
        success: false,
        message: `Failed to update admin.users: ${String(error)}`,
      };
    }

    // Insert user_roles
    try {
      // Check if user_roles table exists
      try {
        await supabase
          .from("user_roles")
          .select("count(*)", { count: "exact", head: true });
      } catch {
        // Create user_roles table if it doesn't exist
        await executeSql(`
          CREATE TABLE IF NOT EXISTS public.user_roles (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL CHECK (role IN ('admin', 'recruit', 'volunteer')),
            assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_active BOOLEAN DEFAULT TRUE,
            UNIQUE(user_id, role)
          );
        `);
      }

      await executeSql(
        `
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES ($1, 'admin', TRUE)
        ON CONFLICT (user_id, role) 
        DO UPDATE SET is_active = TRUE;
      `,
        [userId],
      );
    } catch (error) {
      return {
        success: false,
        message: `Failed to update user_roles: ${String(error)}`,
      };
    }

    // Set up security policies
    try {
      // Enable RLS on admin.users
      await executeSql("ALTER TABLE admin.users ENABLE ROW LEVEL SECURITY;");

      // Create RLS policies if they don't exist
      await executeSql(`
        DO $$
        BEGIN
          -- Drop conflicting policies if they exist
          DROP POLICY IF EXISTS "Users can view own data" ON admin.users;
          DROP POLICY IF EXISTS "Admins can view all data" ON admin.users;
          DROP POLICY IF EXISTS "Service role can access all" ON admin.users;
          
          -- Create new policies
          CREATE POLICY "Users can view own data" ON admin.users
            FOR SELECT USING (auth.uid() = id);
            
          CREATE POLICY "Admins can view all data" ON admin.users
            FOR ALL USING (
              EXISTS (
                SELECT 1 FROM public.user_roles
                WHERE user_id = auth.uid() AND role = 'admin' AND is_active = TRUE
              )
            );
            
          CREATE POLICY "Service role can access all" ON admin.users
            FOR ALL USING (true);
          
        EXCEPTION WHEN OTHERS THEN
          -- If there's an error, continue
          NULL;
        END
        $$;
      `);
    } catch (error) {
      console.error("Error setting up RLS policies:", error);
      // Continue anyway, this isn't critical for the fix
    }

    return {
      success: true,
      message:
        "Admin profile fixed successfully. You should now be able to log in.",
      userId,
      email: adminEmail,
    };
  } catch (error) {
    console.error("Error fixing admin profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

// Note: This endpoint has been converted to static
// The original functionality was for emergency admin account recovery
// For static deployment, this functionality should be handled through
// a separate admin interface or serverless functions

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "This endpoint is not available in static deployment. Please use the admin interface or contact support for assistance.",
      source: "static",
    },
    { status: 403 },
  );
}
