#!/usr/bin/env node
import * as dotenv from "dotenv"
import path from "path"
import fs from "fs"

const envPath = path.resolve(process.cwd(), '.env.local')
console.log("Looking for .env.local at:", envPath)
console.log("File exists:", fs.existsSync(envPath))

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  console.log("Environment file content:", envContent)
  dotenv.config({ path: envPath })
}

console.log("Environment variables loaded:", {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "[REDACTED]" : undefined
}) 