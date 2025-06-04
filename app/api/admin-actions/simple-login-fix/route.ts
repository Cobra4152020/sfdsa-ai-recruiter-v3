import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function simpleLoginFix() {
  try {
    const supabase = getServiceSupabase();

    // Execute a simpler fix that doesn't check constraints first
    const { data, error } = await supabase.rpc("exec_sql", {
      query: `
        -- Fix the role column constraint directly
        BEGIN;
        
        -- Drop the constraint if it exists (ignoring errors)
        ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
        ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_type_check;
        
        -- Add the correct constraint
        ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
        CHECK (role IN ('recruit', 'volunteer', 'admin'));
        
        -- Make sure we have at least one admin
        INSERT INTO user_roles (user_id, role, assigned_at, is_active)
        SELECT id, 'admin', NOW(), TRUE
        FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM user_roles WHERE role = 'admin')
        LIMIT 1;
        
        -- Sync user_types table with user_roles
        INSERT INTO user_types (user_id, user_type, email)
        SELECT ur.user_id, ur.role, u.email
        FROM user_roles ur
        JOIN auth.users u ON ur.user_id = u.id
        LEFT JOIN user_types ut ON ur.user_id = ut.user_id
        WHERE ut.user_id IS NULL;
        
        COMMIT;
      `,
    });

    if (error) {
      console.error("Error executing simple login fix:", error);
      return {
        success: false,
        message: "Failed to fix login issues",
        error: error.message,
        details: error,
      };
    }

    // Revalidate relevant paths

    return {
      success: true,
      message: "Login issues fixed successfully. Try logging in now.",
      data,
    };
  } catch (error: unknown) {
    console.error("Unexpected error in simple login fix:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      stack: error instanceof Error ? error.stack : undefined,
    };
  }
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await simpleLoginFix(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in simpleLoginFix:`, error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
