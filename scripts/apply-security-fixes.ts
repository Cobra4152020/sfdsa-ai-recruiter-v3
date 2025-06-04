#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
console.log("Looking for .env.local at:", envPath);
console.log("File exists:", fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  console.log("Environment file content available:", !!envContent);
  dotenv.config({ path: envPath });
}

async function applySecurityFixes() {
  try {
    console.log("Starting security fixes...");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Environment variables loaded:", {
        url: !!supabaseUrl,
        key: !!supabaseKey,
      });
      throw new Error("Missing Supabase environment variables");
    }

    console.log("Connecting to Supabase...");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read and execute the security fixes SQL
    const sqlPath = path.resolve(
      process.cwd(),
      "migrations",
      "fix_security_issues.sql",
    );
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Applying security fixes...");
    const { error } = await supabase.rpc("exec_sql", {
      sql_query: sql,
    });

    if (error) {
      console.error("Error applying security fixes:", error);
      return { success: false, error: String(error) };
    }

    console.log("Security fixes applied successfully!");

    // Update Auth settings via API
    console.log("Updating Auth settings...");
    try {
      const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/config`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Set OTP expiry to 1 hour (3600 seconds)
          mailer_otp_exp: 3600,
          // Enable leaked password protection
          enable_weak_password_check: true,
        }),
      });

      if (!authResponse.ok) {
        throw new Error(
          `Failed to update auth settings: ${authResponse.statusText}`,
        );
      }

      console.log("Auth settings updated successfully!");
    } catch (authError) {
      console.error("Error updating auth settings:", authError);
      return { success: false, error: String(authError) };
    }

    return { success: true };
  } catch (error) {
    console.error("Error during security fixes:", error);
    return { success: false, error: String(error) };
  }
}

applySecurityFixes();
