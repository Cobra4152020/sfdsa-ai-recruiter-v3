#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

async function runMigrations() {
  try {
    console.log("Starting migrations...")
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    console.log("Connecting to Supabase...")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Migration files in order
    const migrationFiles = [
      'fix_security_issues.sql',
      'create_webauthn_tables.sql',
      'create_security_monitoring_tables.sql',
      'fix_points_system.sql',
      'fix_rls_policies.sql'
    ]

    for (const file of migrationFiles) {
      console.log(`\nApplying migration: ${file}`)
      const sqlPath = path.resolve(process.cwd(), 'migrations', file)
      
      if (!fs.existsSync(sqlPath)) {
        console.warn(`Migration file not found: ${file}`)
        continue
      }

      const sql = fs.readFileSync(sqlPath, 'utf8')

      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      // Execute each statement
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql_query: statement
          })

          if (error) {
            console.error(`Error executing statement: ${error.message}`)
            console.error('Statement:', statement)
          }
        } catch (err) {
          console.error('Failed to execute statement:', err)
          console.error('Statement:', statement)
        }
      }
    }

    console.log('\nMigrations completed!')
    return { success: true }
  } catch (error) {
    console.error("Error during migrations:", error)
    return { success: false, error: String(error) }
  }
}

runMigrations() 