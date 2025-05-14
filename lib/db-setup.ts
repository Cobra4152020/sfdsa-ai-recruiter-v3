import { createClient } from "@/lib/supabase-clients"

export async function setupChatDatabase() {
  try {
    const supabase = createClient()

    // Check if add_participation_points function exists
    const { data: functionExists, error: functionCheckError } = await supabase.rpc("function_exists", {
      function_name: "add_participation_points",
    })

    if (functionCheckError || !functionExists) {
      console.log("Creating add_participation_points function...")

      // Create the function
      const { error: createFunctionError } = await supabase.rpc("create_function", {
        function_definition: `
        CREATE OR REPLACE FUNCTION add_participation_points(
          user_id_param UUID,
          points_param INTEGER,
          activity_type_param VARCHAR(50),
          description_param TEXT DEFAULT NULL
        )
        RETURNS VOID AS $$
        BEGIN
          -- Update participation count in users table
          UPDATE users
          SET participation_count = COALESCE(participation_count, 0) + points_param
          WHERE id = user_id_param;
          
          -- Log the points activity if the table exists
          BEGIN
            INSERT INTO participation_points (
              user_id,
              points,
              activity_type,
              description,
              created_at
            ) VALUES (
              user_id_param,
              points_param,
              activity_type_param,
              description_param,
              NOW()
            );
          EXCEPTION
            WHEN undefined_table THEN
              -- Do nothing if the table doesn't exist
              NULL;
          END;
        END;
        $$ LANGUAGE plpgsql;
        `,
      })

      if (createFunctionError) {
        console.error("Error creating function:", createFunctionError)
      }
    }

    // Create indexes on chat_interactions table
    const { error: indexError } = await supabase.rpc("create_index_if_not_exists", {
      index_name: "chat_interactions_user_id_idx",
      table_name: "chat_interactions",
      column_name: "user_id",
    })

    if (indexError) {
      console.warn("Error creating index:", indexError)
    }

    return true
  } catch (error) {
    console.error("Error setting up chat database:", error)
    return false
  }
}
