"use server"

import { getServiceSupabase } from "@/lib/supabase-service"
import { revalidatePath } from "next/cache"

export async function setupAdminUser(userId: string, email: string, name: string) {
  try {
    const supabase = getServiceSupabase()

    // Step 1: Create admin schema if it doesn't exist
    await supabase.rpc("exec_sql", {
      sql_query: "CREATE SCHEMA IF NOT EXISTS admin;",
    })

    // Step 2: Create admin.users table if it doesn't exist
    await supabase.rpc("exec_sql", {
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

    // Step 3: Insert the admin user
    const { error: insertError } = await supabase.from("admin.users").upsert({
      id: userId,
      email: email,
      name: name,
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      // If direct insert fails, try using RPC
      await supabase.rpc("exec_sql", {
        sql_query: `
          INSERT INTO admin.users (id, email, name, updated_at)
          VALUES ('${userId}', '${email}', '${name}', '${new Date().toISOString()}')
          ON CONFLICT (id) DO UPDATE SET 
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            updated_at = EXCLUDED.updated_at;
        `,
      })
    }

    // Step 4: Ensure user_types entry exists
    const { error: userTypeError } = await supabase.from("user_types").upsert({
      user_id: userId,
      user_type: "admin",
    })

    if (userTypeError) {
      await supabase.rpc("exec_sql", {
        sql_query: `
          INSERT INTO user_types (user_id, user_type)
          VALUES ('${userId}', 'admin')
          ON CONFLICT (user_id) DO UPDATE SET user_type = 'admin';
        `,
      })
    }

    // Step 5: Ensure user_roles entry exists
    const { error: userRoleError } = await supabase.from("user_roles").upsert({
      user_id: userId,
      role: "admin",
      assigned_at: new Date().toISOString(),
      is_active: true,
    })

    if (userRoleError) {
      await supabase.rpc("exec_sql", {
        sql_query: `
          INSERT INTO user_roles (user_id, role, assigned_at, is_active)
          VALUES ('${userId}', 'admin', '${new Date().toISOString()}', true)
          ON CONFLICT (user_id, role) DO UPDATE SET 
            is_active = true,
            assigned_at = EXCLUDED.assigned_at;
        `,
      })
    }

    // Step 6: Set up RLS policies for admin.users
    await supabase.rpc("exec_sql", {
      sql_query: `
        ALTER TABLE admin.users ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can access admin users" ON admin.users;
        
        CREATE POLICY "Admins can access admin users" ON admin.users
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin' AND is_active = true
          )
        );
      `,
    })

    revalidatePath("/admin")
    return { success: true, message: "Admin user setup completed successfully" }
  } catch (error) {
    console.error("Error setting up admin user:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
