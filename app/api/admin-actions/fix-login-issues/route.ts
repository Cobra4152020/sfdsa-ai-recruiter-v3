import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function fixLoginIssues() {
  try {
    const supabase = getServiceSupabase()

    // First, check if the constraint exists and what it's checking
    const { data: constraintData, error: constraintError } = await supabase.rpc("exec_sql", {
      query: `
        SELECT conname, pg_get_constraintdef(oid) as constraint_def
        FROM pg_constraint
        WHERE conrelid = 'user_roles'::regclass
        AND contype = 'c';
      `,
    })

    if (constraintError) {
      console.error("Error checking constraints:", constraintError)
      return { success: false, message: "Failed to check constraints", error: constraintError }
    }

    // Fix the constraint if needed
    const { data: fixConstraintData, error: fixConstraintError } = await supabase.rpc("exec_sql", {
      query: `
        -- Drop the existing constraint if it's incorrect
        ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
        
        -- Add the correct constraint
        ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
        CHECK (role IN ('recruit', 'volunteer', 'admin'));
      `,
    })

    if (fixConstraintError) {
      console.error("Error fixing constraint:", fixConstraintError)
      return { success: false, message: "Failed to fix constraint", error: fixConstraintError }
    }

    // Create admin user if none exists
    const { data: adminData, error: adminError } = await supabase.rpc("exec_sql", {
      query: `
        -- Check if admin user exists
        DO $$
        DECLARE
          admin_count INTEGER;
        BEGIN
          SELECT COUNT(*) INTO admin_count FROM user_roles WHERE role = 'admin';
          
          IF admin_count = 0 THEN
            -- Create a default admin user if none exists
            INSERT INTO user_roles (user_id, role, assigned_at, is_active)
            SELECT id, 'admin', NOW(), TRUE
            FROM auth.users
            LIMIT 1;
          END IF;
        END $$;
      `,
    })

    if (adminError) {
      console.error("Error creating admin user:", adminError)
      return { success: false, message: "Failed to create admin user", error: adminError }
    }

    // Fix any missing user_types entries
    const { data: userTypesData, error: userTypesError } = await supabase.rpc("exec_sql", {
      query: `
        -- Insert into user_types for any users missing from that table
        INSERT INTO user_types (user_id, user_type, email)
        SELECT ur.user_id, ur.role, u.email
        FROM user_roles ur
        JOIN auth.users u ON ur.user_id = u.id
        LEFT JOIN user_types ut ON ur.user_id = ut.user_id
        WHERE ut.user_id IS NULL;
      `,
    })

    if (userTypesError) {
      console.error("Error fixing user_types:", userTypesError)
      return { success: false, message: "Failed to fix user_types", error: userTypesError }
    }

    // Revalidate relevant paths
            
    return {
      success: true,
      message: "Login issues fixed successfully. Try logging in now.",
      constraintData,
      fixConstraintData,
      adminData,
      userTypesData,
    }
  } catch (error) {
    console.error("Unexpected error fixing login issues:", error)
    return { success: false, message: "An unexpected error occurred", error }
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await fixLoginIssues(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in fixLoginIssues:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}