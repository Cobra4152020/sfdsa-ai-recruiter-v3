import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"

export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase()

    // Fix the constraint
    const { error: constraintError } = await supabase.rpc("exec_sql", {
      query: `
        -- Drop the existing constraint if it's incorrect
        ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;

export const dynamic = 'force-dynamic';

        
        -- Add the correct constraint
        ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
        CHECK (role IN ('recruit', 'volunteer', 'admin'));
      `,
    })

    if (constraintError) {
      console.error("Error fixing constraint:", constraintError)
      return NextResponse.json(
        { success: false, message: "Failed to fix constraint", error: constraintError },
        { status: 500 },
      )
    }

    // Create admin user if none exists
    const { error: adminError } = await supabase.rpc("exec_sql", {
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
      return NextResponse.json(
        { success: false, message: "Failed to create admin user", error: adminError },
        { status: 500 },
      )
    }

    // Fix any missing user_types entries
    const { error: userTypesError } = await supabase.rpc("exec_sql", {
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
      return NextResponse.json(
        { success: false, message: "Failed to fix user_types", error: userTypesError },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Login issues fixed successfully. Try logging in now.",
    })
  } catch (error) {
    console.error("Unexpected error fixing login issues:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred", error }, { status: 500 })
  }
}
