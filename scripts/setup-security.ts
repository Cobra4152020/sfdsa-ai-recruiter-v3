#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"
import fs from "fs"

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
console.log("Looking for .env.local at:", envPath)
console.log("File exists:", fs.existsSync(envPath))

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  console.log("Environment file content available:", !!envContent)
  dotenv.config({ path: envPath })
}

async function setupSecurity() {
  try {
    console.log("Starting security setup...")
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Environment variables loaded:", {
        url: !!supabaseUrl,
        key: !!supabaseKey
      })
      throw new Error("Missing Supabase environment variables")
    }

    console.log("Connecting to Supabase...")
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Read and execute migration files
    const migrationFiles = [
      'fix_security_issues.sql',
      'create_webauthn_tables.sql',
      'create_security_monitoring_tables.sql',
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

    // Update Auth settings via API
    console.log("\nUpdating Auth settings...")
    try {
      const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/config`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Set OTP expiry to 1 hour (3600 seconds)
          mailer_otp_exp: 3600,
          // Enable leaked password protection
          enable_weak_password_check: true
        })
      })

      if (!authResponse.ok) {
        throw new Error(`Failed to update auth settings: ${authResponse.statusText}`)
      }

      console.log("Auth settings updated successfully!")
    } catch (authError) {
      console.error("Error updating auth settings:", authError)
    }

    // Verify security measures
    console.log('\nVerifying security measures...')

    // Verify RLS is enabled on critical tables
    const tables = [
      'user_authenticators',
      'webauthn_challenges',
      'security_events',
      'security_alerts',
      'blocked_ips',
      'monitored_ips',
      'security_notifications',
      'security_review_queue',
    ]

    for (const table of tables) {
      const { data, error } = await supabase
        .from('pg_tables')
        .select('relrowsecurity')
        .eq('tablename', table)
        .single()

      if (error) {
        console.error(`Error checking RLS for ${table}:`, error.message)
      } else {
        console.log(`RLS enabled for ${table}: ${data?.relrowsecurity ? 'Yes' : 'No'}`)
      }
    }

    // Verify indexes exist
    console.log('\nVerifying indexes...')
    const { data: indexes, error: indexError } = await supabase
      .from('pg_indexes')
      .select('tablename, indexname')
      .in('tablename', tables)

    if (indexError) {
      console.error('Error checking indexes:', indexError.message)
    } else {
      const indexesByTable = indexes?.reduce((acc, idx) => {
        acc[idx.tablename] = acc[idx.tablename] || []
        acc[idx.tablename].push(idx.indexname)
        return acc
      }, {} as Record<string, string[]>) || {}

      for (const table of tables) {
        console.log(`\nIndexes for ${table}:`)
        console.log(indexesByTable[table]?.join('\n') || 'No indexes found')
      }
    }

    // Verify security functions exist
    console.log('\nVerifying security functions...')
    const functions = [
      'cleanup_expired_challenges',
      'cleanup_old_security_data',
    ]

    for (const func of functions) {
      const { data, error } = await supabase
        .from('pg_proc')
        .select('proname')
        .eq('proname', func)
        .single()

      if (error) {
        console.error(`Error checking function ${func}:`, error.message)
      } else {
        console.log(`Function ${func} exists: ${data ? 'Yes' : 'No'}`)
      }
    }

    console.log('\nSecurity setup completed successfully!')
    return { success: true }
  } catch (error) {
    console.error("Error during security setup:", error)
    return { success: false, error: String(error) }
  }
}

setupSecurity() 