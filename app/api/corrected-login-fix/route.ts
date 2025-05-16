import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase()

    // Execute a corrected fix that matches the actual table structure
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
        
        -- Sync user_types table with user_roles (without email column)
        INSERT INTO user_types (user_id, user_type)
        SELECT ur.user_id, ur.role
        FROM user_roles ur
        LEFT JOIN user_types ut ON ur.user_id = ut.user_id
        WHERE ut.user_id IS NULL;
        
        COMMIT;
      `,
    })

    if (error) {
      console.error("Error executing corrected login fix API:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fix login issues",
          error: error.message,
          details: error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Login issues fixed successfully. Try logging in now.",
      data,
    })
  } catch (error: any) {
    console.error("Unexpected error in corrected login fix API:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
