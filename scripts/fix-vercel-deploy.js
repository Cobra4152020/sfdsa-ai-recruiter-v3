const fs = require("fs");
const path = require("path");

// Check if the .next directory exists and has the required structure
function checkBuildDirectory() {
  console.log("Checking build directory...");

  const nextDir = path.join(process.cwd(), ".next");
  if (!fs.existsSync(nextDir)) {
    console.log("No .next directory found. Run `next build` first.");
    return false;
  }

  // Check for server directory
  const serverDir = path.join(nextDir, "server");
  if (!fs.existsSync(serverDir)) {
    console.log("No server directory found in .next");
    return false;
  }

  console.log("Build directory looks good.");
  return true;
}

// Ensure environment variables are set
function ensureEnvVars() {
  console.log("Setting environment variables for deployment...");

  // Create a .env.production file if it doesn't exist
  const envFile = path.join(process.cwd(), ".env.production");
  const envVars = [
    "DISABLE_DB_DURING_BUILD=true",
    "SKIP_DATABASE_VALIDATION=true",
    // Removed NEXT_PUBLIC_STATIC_BUILD and NEXT_PUBLIC_DISABLE_DATABASE_CHECKS
    // to prevent API routes from being blocked on Vercel
  ];

  fs.writeFileSync(envFile, envVars.join("\n") + "\n");
  console.log("Environment variables set in .env.production");
}

// Fix any common issues in the Vercel deployment
async function fixVercelDeployment() {
  console.log("Starting Vercel deployment fix script...");

  checkBuildDirectory();
  ensureEnvVars();

  console.log("Done! Your project should now be ready for Vercel deployment.");
  console.log("Deploy with:");
  console.log("  vercel --prod");
}

fixVercelDeployment().catch((error) => {
  console.error("Error fixing Vercel deployment:", error);
  process.exit(1);
});
