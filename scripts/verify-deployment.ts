import { getServiceSupabase } from "../lib/supabase"
import fs from "fs"
import path from "path"

/**
 * Deployment verification script
 * Run with: npx ts-node scripts/verify-deployment.ts
 */
async function verifyDeployment() {
  console.log("🔍 Starting deployment verification...")

  // 1. Check environment variables
  console.log("\n📋 Checking environment variables...")
  const requiredEnvVars = [
    "NEXT_PUBLIC_VERCEL_ENV",
    "NEXT_PUBLIC_VERCEL_URL",
    "NEXT_PUBLIC_ENABLE_LEADERBOARD",
    "NEXT_PUBLIC_ENABLE_BADGES",
    "NEXT_PUBLIC_ENABLE_POINTS",
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingEnvVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingEnvVars.join(", "))
  } else {
    console.log("✅ All required environment variables are present")
  }

  // 2. Check Supabase connection
  console.log("\n🔌 Testing Supabase connection...")
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from("users").select("id").limit(1)

    if (error) {
      console.error("❌ Supabase connection error:", error.message)
    } else {
      console.log("✅ Supabase connection successful")
    }
  } catch (error) {
    console.error("❌ Supabase connection error:", error)
  }

  // 3. Check database tables
  console.log("\n🗄️ Checking database tables...")
  try {
    const supabase = getServiceSupabase()
    const requiredTables = ["users", "badges", "user_activities", "user_nft_awards"]

    for (const table of requiredTables) {
      const { data, error } = await supabase.from(table).select("count").limit(1)

      if (error) {
        console.error(`❌ Table "${table}" error:`, error.message)
      } else {
        console.log(`✅ Table "${table}" exists`)
      }
    }
  } catch (error) {
    console.error("❌ Database tables check error:", error)
  }

  // 4. Check leaderboard function
  console.log("\n🏆 Testing leaderboard function...")
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.rpc("get_leaderboard", {
      timeframe: "all-time",
      category: "participation",
      limit_val: 10,
      offset_val: 0,
      search_term: "",
    })

    if (error) {
      console.error("❌ Leaderboard function error:", error.message)
    } else {
      console.log(`✅ Leaderboard function returned ${data.length} results`)
    }
  } catch (error) {
    console.error("❌ Leaderboard function error:", error)
  }

  // 5. Generate deployment report
  console.log("\n📊 Generating deployment report...")
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "unknown",
    buildId: process.env.NEXT_PUBLIC_BUILD_ID || "unknown",
    features: {
      leaderboard: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true",
      badges: process.env.NEXT_PUBLIC_ENABLE_BADGES === "true",
      points: process.env.NEXT_PUBLIC_ENABLE_POINTS === "true",
      debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
    },
  }

  const reportDir = path.join(process.cwd(), "reports")
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  fs.writeFileSync(path.join(reportDir, `deployment-report-${Date.now()}.json`), JSON.stringify(report, null, 2))

  console.log("✅ Deployment report generated")
  console.log("\n🏁 Deployment verification complete!")
}

verifyDeployment().catch(console.error)
