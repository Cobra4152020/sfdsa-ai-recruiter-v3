import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function setupAdminRpcFunction() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRole) {
    return { success: false, message: "Missing Supabase environment variables" }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // Create the exec_sql function
    const { error } = await supabase.rpc("create_function", {
      function_sql: `
        -- Function to execute SQL safely with params from service role only
        CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT, params_array TEXT[] DEFAULT '{}')
        RETURNS VOID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- This function can only be executed by service role
          IF NOT (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role') THEN
            RAISE EXCEPTION 'Permission denied: only service_role can execute this function';
          END IF;

          -- Execute the SQL dynamically with the params
          EXECUTE sql_query USING params_array;
        END;
        $$;

        -- Grant execute permission to authenticated users (the check is inside the function)
        GRANT EXECUTE ON FUNCTION public.exec_sql TO authenticated;
        GRANT EXECUTE ON FUNCTION public.exec_sql TO service_role;
      `,
    })

    if (error) {
      if (error.message.includes("function create_function does not exist")) {
        // Try direct execution
        const { error: directError } = await supabase.from("_direct_execution").insert({
          sql: `
            -- Function to execute SQL safely with params from service role only
            CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT, params_array TEXT[] DEFAULT '{}')
            RETURNS VOID
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              -- This function can only be executed by service role
              IF NOT (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role') THEN
                RAISE EXCEPTION 'Permission denied: only service_role can execute this function';
              END IF;

              -- Execute the SQL dynamically with the params
              EXECUTE sql_query USING params_array;
            END;
            $$;

            -- Grant execute permission to authenticated users (the check is inside the function)
            GRANT EXECUTE ON FUNCTION public.exec_sql TO authenticated;
            GRANT EXECUTE ON FUNCTION public.exec_sql TO service_role;
          `,
        })

        if (directError) {
          return { success: false, message: `Failed to create RPC function: ${directError.message}` }
        }
      } else {
        return { success: false, message: `Failed to create RPC function: ${error.message}` }
      }
    }

    return { success: true, message: "RPC function created successfully" }
  } catch (error) {
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
    const result = await setupAdminRpc(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in setupAdminRpc:`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}