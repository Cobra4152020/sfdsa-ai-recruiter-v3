import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Creating user record using raw SQL to bypass materialized view issues...");
    const supabase = getServiceSupabase();
    
    // Get user info from request
    const { userId, email } = await request.json().catch(() => ({
      userId: 'd1de04f1-36ee-451c-a546-0d343c950f76',
      email: 'refundpolice50@gmail.com'
    }));
    
    console.log(`🔧 Creating user record for: ${email} (${userId})`);

    // Use raw SQL to insert user without triggering materialized view refreshes
    const insertUserSQL = `
      INSERT INTO public.users (id, email, name, participation_count, has_applied, created_at, updated_at)
      VALUES ('${userId}'::uuid, '${email}', 'John Baker', 0, false, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET 
        email = EXCLUDED.email,
        updated_at = NOW();
    `;

    console.log("🔧 Executing raw SQL to create user record...");
    
    // Try executing with raw SQL
    const { data: sqlData, error: sqlError } = await supabase.rpc('exec', {
      sql: insertUserSQL
    });

    if (sqlError) {
      console.error("❌ Raw SQL failed, trying direct table access:", sqlError);
      
      // Fallback: try direct table access with minimal data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('id', userId)
        .maybeSingle();

      if (userData) {
        console.log("✅ User already exists in database:", userData);
      } else if (userError) {
        console.error("❌ Failed to check if user exists:", userError);
        return NextResponse.json({
          success: false,
          message: "Failed to create or verify user record - materialized view permission issue",
          error: userError,
          suggestion: "The user creation is blocked by database permission issues. You may need to run this manually in Supabase SQL Editor."
        }, { status: 500 });
      } else {
        console.log("❌ User doesn't exist and cannot be created due to permissions");
        return NextResponse.json({
          success: false,
          message: "User doesn't exist and cannot be created due to materialized view permissions",
          error: sqlError,
          manualSolution: `Run this SQL manually in Supabase SQL Editor:\n\n${insertUserSQL}\n\nThen also run:\nINSERT INTO user_roles (user_id, role, is_active) VALUES ('${userId}', 'admin', true) ON CONFLICT (user_id, role) DO NOTHING;`
        }, { status: 500 });
      }
    } else {
      console.log("✅ User record created via raw SQL");
    }

    // Ensure admin role exists (this is less likely to trigger materialized view issues)
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin',
        is_active: true,
        assigned_at: new Date().toISOString(),
        notes: 'Admin role granted during user creation'
      }, {
        onConflict: 'user_id,role'
      });

    if (roleError) {
      console.warn("⚠️ Failed to create admin role:", roleError);
    } else {
      console.log("✅ Admin role ensured:", roleData);
    }

    console.log("✅ User creation process complete - ready for trivia!");

    return NextResponse.json({
      success: true,
      message: "User record created successfully! The foreign key constraint issue should be resolved. You can now play trivia and earn points!",
      details: {
        userId,
        email,
        method: sqlError ? "user_verification" : "raw_sql_creation",
        roleCreated: !roleError,
        note: "Bypassed materialized view issues using raw SQL approach"
      }
    });

  } catch (error) {
    console.error("❌ Critical error in user creation:", error);
    return NextResponse.json({
      success: false,
      message: "Critical error during user creation",
      error: error instanceof Error ? error.message : String(error),
      emergency_solution: "You may need to create the user record manually in Supabase SQL Editor to bypass permission issues."
    }, { status: 500 });
  }
} 