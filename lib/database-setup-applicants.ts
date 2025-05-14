import { getServiceSupabase } from "@/lib/supabase-clients"

/**
 * Ensures the applicants table exists in the database
 */
export async function setupApplicantsTable() {
  try {
    const supabase = getServiceSupabase()

    console.log("Checking applicants table...")

    // Check if the applicants table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "applicants")
      .eq("table_schema", "public")
      .single()

    if (tableCheckError || !tableExists) {
      console.log("Creating applicants table...")

      // Create the applicants table
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS applicants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          interest TEXT NOT NULL,
          tracking_number TEXT NOT NULL UNIQUE,
          referral_code TEXT,
          is_direct_application BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create index on tracking_number for faster lookups
        CREATE INDEX IF NOT EXISTS applicants_tracking_number_idx ON applicants(tracking_number);
        
        -- Create index on email for faster lookups and potential deduplication
        CREATE INDEX IF NOT EXISTS applicants_email_idx ON applicants(email);
        
        -- Create index on referral_code for tracking referrals
        CREATE INDEX IF NOT EXISTS applicants_referral_code_idx ON applicants(referral_code);
      `)

      console.log("Applicants table created successfully")
    } else {
      console.log("Applicants table already exists")
    }

    return { success: true }
  } catch (error) {
    console.error("Error setting up applicants table:", error)
    return { success: false, error }
  }
}
