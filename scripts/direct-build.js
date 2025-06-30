/**
 * direct-build.js - A simplified build script that bypasses CSS generation
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main build function
async function buildProject() {
  try {
    log("Starting simplified build process...");

    // Clean any previous build artifacts
    /* if (fs.existsSync(path.join(process.cwd(), ".next"))) {
      log("Cleaning previous build...");
      fs.rmSync(path.join(process.cwd(), ".next"), {
        recursive: true,
        force: true,
      });
    } */

    // Set environment variables to skip problematic checks
    // Removed NEXT_PUBLIC_DISABLE_DATABASE_CHECKS to prevent API route blocking
    // process.env.NEXT_PUBLIC_DISABLE_DATABASE_CHECKS = "true";
    // Temporarily disable static build to fix API routes issue
    // process.env.NEXT_PUBLIC_STATIC_BUILD = "true";
    process.env.SKIP_DATABASE_VALIDATION = "true";
    process.env.DISABLE_DB_DURING_BUILD = "true";

    // Run Next.js build with environment variables set
    log("Running Next.js build...");
    execSync("npx next build", {
      stdio: "inherit",
      env: {
        ...process.env,
        // Removed NEXT_PUBLIC_DISABLE_DATABASE_CHECKS to prevent API route blocking
        // NEXT_PUBLIC_DISABLE_DATABASE_CHECKS: "true",
        // NEXT_PUBLIC_STATIC_BUILD: "true",
        SKIP_DATABASE_VALIDATION: "true",
        DISABLE_DB_DURING_BUILD: "true",
      },
    });

    // Run the client reference manifest fix script
    log("Fixing client reference manifest issues...");
    execSync("node scripts/fix-client-references.js", {
      stdio: "inherit",
    });

    log("Build completed successfully!");
  } catch (error) {
    log(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the build
buildProject();
