import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

// Load environment variables
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function checkSiteUrl() {
  try {
    console.log("Checking current site URL configuration...")

    // Get current auth settings
    const { data: authSettings, error: settingsError } = await supabase.from("auth_settings").select("*").single()

    if (settingsError) {
      console.error("Error fetching auth settings:", settingsError.message)
      return
    }

    console.log("\nCurrent configuration:")
    console.log("Site URL:", authSettings?.site_url || "Not set")
    console.log("NEXT_PUBLIC_SITE_URL env variable:", process.env.NEXT_PUBLIC_SITE_URL || "Not set")

    // Check if site URL is correctly set to production URL
    const productionUrl = "https://www.sfdeputysheriff.com"
    const isCorrect = authSettings?.site_url === productionUrl

    console.log("\nStatus:", isCorrect ? "✅ Correct" : "❌ Incorrect")

    if (!isCorrect) {
      console.log("\nWould you like to update the site URL to", productionUrl, "? (y/n)")

      // This is a simple way to get user input in a script
      // In a real implementation, you'd use a proper CLI library
      const response = await new Promise((resolve) => {
        process.stdin.once("data", (data) => {
          resolve(data.toString().trim().toLowerCase())
        })
      })

      if (response === "y") {
        console.log("\nUpdating site URL...")

        // In a real implementation, you would use the Supabase Management API
        // to update the site URL. This requires additional permissions.
        console.log("\n⚠️ Note: This script cannot directly update the site URL.")
        console.log("Please update it manually in the Supabase dashboard:")
        console.log("1. Go to https://app.supabase.com")
        console.log("2. Select your project")
        console.log("3. Go to Authentication → URL Configuration")
        console.log("4. Update the Site URL to:", productionUrl)
        console.log("5. Save changes")

        // Update the environment variable in .env.local
        console.log("\nUpdating NEXT_PUBLIC_SITE_URL in .env.local...")

        const envPath = path.join(process.cwd(), ".env.local")
        let envContent = ""

        try {
          envContent = fs.readFileSync(envPath, "utf8")
        } catch (err) {
          console.log("No .env.local file found, creating a new one.")
        }

        // Update or add the NEXT_PUBLIC_SITE_URL
        if (envContent.includes("NEXT_PUBLIC_SITE_URL=")) {
          envContent = envContent.replace(/NEXT_PUBLIC_SITE_URL=.*/, `NEXT_PUBLIC_SITE_URL=${productionUrl}`)
        } else {
          envContent += `\nNEXT_PUBLIC_SITE_URL=${productionUrl}\n`
        }

        fs.writeFileSync(envPath, envContent)
        console.log("✅ Updated NEXT_PUBLIC_SITE_URL in .env.local")

        console.log("\nPlease redeploy your application after making these changes.")
      }
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

checkSiteUrl()
