import { NextResponse } from "next/server"
import { getServiceSupabase } from '@/app/lib/supabase/server'

export async function updateDatabaseSchema() {
  try {
    const supabaseAdmin = getServiceSupabase()
    const { data, error } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        -- Create user_types table if it doesn't exist
        CREATE TABLE IF NOT EXISTS user_types (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id),
          user_type TEXT NOT NULL CHECK (user_type IN ('recruit', 'volunteer', 'admin')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create user_roles table if it doesn't exist
        CREATE TABLE IF NOT EXISTS user_roles (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id),
          role TEXT NOT NULL CHECK (role IN ('recruit', 'volunteer', 'admin')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create recruit schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS recruit;

        -- Create volunteer schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS volunteer;

        -- Create admin schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS admin;

        -- Create recruit.users table if it doesn't exist
        CREATE TABLE IF NOT EXISTS recruit.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          email TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          zip_code TEXT,
          avatar_url TEXT,
          points INTEGER DEFAULT 0,
          badge_count INTEGER DEFAULT 0,
          participation_count INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create volunteer.recruiters table if it doesn't exist
        CREATE TABLE IF NOT EXISTS volunteer.recruiters (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          email TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          organization TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT FALSE,
          verified_at TIMESTAMPTZ,
          referral_count INTEGER DEFAULT 0,
          points INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create admin.users table if it doesn't exist
        CREATE TABLE IF NOT EXISTS admin.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id),
          email TEXT NOT NULL,
          name TEXT,
          last_login TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Error updating database schema:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await databaseSchemaUpdate(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in databaseSchemaUpdate:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}