import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function setupDailyBriefingsTable() {
  const supabase = getServiceSupabase();

  try {
    // Check if the table exists
    const { data: tableExists, error: checkError } = await supabase.rpc(
      "check_table_exists",
      {
        table_name: "daily_briefings",
      },
    );

    if (checkError) {
      console.error(
        "Error checking if daily_briefings table exists:",
        checkError,
      );

      // Alternative method to check if table exists
      const { data: tables, error: listError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "daily_briefings");

      if (listError) {
        console.error("Error listing tables:", listError);
        return {
          success: false,
          message: "Failed to check if daily_briefings table exists",
        };
      }

      if (tables && tables.length > 0) {
        return {
          success: true,
          message: "daily_briefings table already exists",
        };
      }
    } else if (tableExists) {
      return { success: true, message: "daily_briefings table already exists" };
    }

    // Create the table if it doesn't exist
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.daily_briefings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          date DATE NOT NULL,
          theme TEXT,
          location TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.daily_briefings ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Everyone can view briefings" 
        ON public.daily_briefings
        FOR SELECT 
        USING (true);
        
        CREATE POLICY "Admins can manage briefings" 
        ON public.daily_briefings
        FOR ALL 
        USING (
          EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
          )
        );
        
        -- Insert sample data
        INSERT INTO public.daily_briefings (title, content, date, theme, location)
        VALUES (
          'San Francisco Deputy Sheriff&apos;s Daily Briefing',
          '<h3>Today&apos;s Focus: Community Safety</h3>
          <p>
            Welcome to today&apos;s briefing. We continue our commitment to serving the San Francisco 
            community with dedication and integrity.
          </p>
          
          <h4>Safety Reminders:</h4>
          <ul>
            <li>Always be aware of your surroundings</li>
            <li>Check your equipment before starting your shift</li>
            <li>Report any safety concerns immediately</li>
          </ul>
          
          <h4>Community Engagement:</h4>
          <p>
            Our presence in the community is vital for building trust and ensuring safety. 
            Remember to engage positively with community members and be a visible presence 
            in your assigned areas.
          </p>
          
          <h4>Department Updates:</h4>
          <p>
            Regular training sessions continue next week. Please ensure all required documentation 
            is completed properly and promptly.
          </p>',
          CURRENT_DATE,
          'Safety',
          'Department HQ'
        );
      `,
    });

    if (createError) {
      console.error("Error creating daily_briefings table:", createError);
      return {
        success: false,
        message: "Failed to create daily_briefings table",
      };
    }

    return {
      success: true,
      message: "daily_briefings table created successfully",
    };
  } catch (error) {
    console.error("Exception in setupDailyBriefingsTable:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function addSampleBriefing() {
  const supabase = getServiceSupabase();

  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if there's already a briefing for today
    const { data: existingBriefing, error: checkError } = await supabase
      .from("daily_briefings")
      .select("id")
      .eq("date", today)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing briefing:", checkError);
      return {
        success: false,
        message: "Failed to check for existing briefing",
      };
    }

    if (existingBriefing) {
      return { success: true, message: "Briefing for today already exists" };
    }

    // Insert a new briefing for today
    const { data: briefingData, error } = await supabase
      .from("daily_briefings")
      .insert({
        title: "San Francisco Deputy Sheriff&apos;s Daily Briefing",
        content: `
          <h3>Today&apos;s Focus: Community Safety</h3>
          <p>
            Welcome to today&apos;s briefing. We continue our commitment to serving the San Francisco 
            community with dedication and integrity.
          </p>
          
          <h4>Safety Reminders:</h4>
          <ul>
            <li>Always be aware of your surroundings</li>
            <li>Check your equipment before starting your shift</li>
            <li>Report any safety concerns immediately</li>
          </ul>
          
          <h4>Community Engagement:</h4>
          <p>
            Our presence in the community is vital for building trust and ensuring safety. 
            Remember to engage positively with community members and be a visible presence 
            in your assigned areas.
          </p>
          
          <h4>Department Updates:</h4>
          <p>
            Regular training sessions continue next week. Please ensure all required documentation 
            is completed properly and promptly.
          </p>
        `,
        date: today,
        theme: "Safety",
        location: "Department HQ",
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting sample briefing:", error);
      return { success: false, message: "Failed to insert sample briefing" };
    }

    return {
      success: true,
      message: "Sample briefing added successfully",
      briefing: briefingData,
    };
  } catch (error) {
    console.error("Exception in addSampleBriefing:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
