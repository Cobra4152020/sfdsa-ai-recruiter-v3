import { execSync } from "child_process"

// Function to sync the deployment
async function syncDeployment() {
  console.log("Starting deployment synchronization...")

  try {
    // 1. Pull latest changes
    console.log("Pulling latest changes...")
    execSync("git pull origin main", { stdio: "inherit" })

    // 2. Install dependencies
    console.log("Installing dependencies...")
    execSync("npm install", { stdio: "inherit" })

    // 3. Run database migrations
    console.log("Running database migrations...")
    execSync("npm run migrate", { stdio: "inherit" })

    // 4. Build the application
    console.log("Building application...")
    execSync("npm run build", { stdio: "inherit" })

    // 5. Restart the application
    console.log("Restarting application...")
    execSync("npm run restart", { stdio: "inherit" })

    console.log("Deployment synchronization completed successfully!")
    return true
  } catch (error) {
    console.error("Deployment synchronization failed:", error)
    return false
  }
}

// Run the sync process
syncDeployment().then((success) => {
  if (!success) {
    process.exit(1)
  }
})
