import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/app/lib/supabase/server"

export async function POST() {
  try {
    const supabase = getServiceSupabase()

    // Create the check_table_exists function
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
        RETURNS boolean
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          table_exists boolean;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          ) INTO table_exists;
          
          RETURN table_exists;
        END;
        $$;
        
        -- Create the exec_sql function if it doesn't exist
        CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$;
      `,
    })

    if (error) {
      console.error("Error creating check_table_exists function:", error)
      return NextResponse.json(
        { success: false, message: "Failed to create check_table_exists function" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Functions created successfully" })
  } catch (error) {
    console.error("Exception in create-table-check-function API:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
