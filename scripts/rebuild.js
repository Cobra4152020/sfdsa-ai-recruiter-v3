/**
 * rebuild.js - Triggers a rebuild of the project to ensure all styles are properly applied
 */

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);

    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${error.message}`);
        return reject(error);
      }

      if (stderr) {
        console.warn(`Command warnings: ${stderr}`);
      }

      console.log(stdout);
      resolve(stdout);
    });

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  });
}

async function rebuildProject() {
  try {
    console.log("=== Starting project rebuild ===");

    // 1. Clean up any previous build artifacts
    console.log("Cleaning previous build artifacts...");
    if (fs.existsSync(path.join(process.cwd(), ".next"))) {
      fs.rmSync(path.join(process.cwd(), ".next"), {
        recursive: true,
        force: true,
      });
    }

    // 2. Generate clean CSS with updated Tailwind
    console.log("Generating CSS with Tailwind...");
    const cssOutputDir = path.join(process.cwd(), "styles");
    if (!fs.existsSync(cssOutputDir)) {
      fs.mkdirSync(cssOutputDir, { recursive: true });
    }

    const inputCss = path.join(process.cwd(), "styles", "index.css");
    const outputCss = path.join(cssOutputDir, "tailwind-output.css");

    await runCommand(`npx tailwindcss -i ${inputCss} -o ${outputCss} --minify`);
    console.log(`Tailwind CSS built and saved to ${outputCss}`);

    // Copy to public directory
    const publicCssDir = path.join(process.cwd(), "public", "css");
    if (!fs.existsSync(publicCssDir)) {
      fs.mkdirSync(publicCssDir, { recursive: true });
    }
    fs.copyFileSync(outputCss, path.join(publicCssDir, "tailwind-output.css"));

    // 3. Run the build
    console.log("Building project...");
    await runCommand("pnpm build");

    console.log("=== Project rebuild completed successfully! ===");
    console.log("Deploy the project to see the updated styles.");
    return true;
  } catch (error) {
    console.error("Project rebuild failed:", error);
    return false;
  }
}

rebuildProject();
