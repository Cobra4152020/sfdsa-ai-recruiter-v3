/**
 * fix-client-references.js
 * This script creates empty client reference manifest files during the build process
 * to prevent ENOENT errors during Vercel deployment.
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

function createEmptyManifestFiles() {
  console.log("Creating empty client reference manifest files...");

  // Ensure .next/server directory exists
  const serverDir = path.join(process.cwd(), ".next", "server");
  if (!fs.existsSync(serverDir)) {
    console.log("Creating .next/server directory...");
    fs.mkdirSync(serverDir, { recursive: true });
  }

  // Create empty manifest file at the root level
  const rootManifestPath = path.join(
    serverDir,
    "page_client-reference-manifest.js",
  );
  fs.writeFileSync(rootManifestPath, "self.__RSC_MANIFEST={};");
  console.log(`Created ${rootManifestPath}`);

  // Find all app directories and create manifest files in each
  const appDirs = glob.sync(".next/server/app/**/", { absolute: true });
  appDirs.forEach((dir) => {
    const manifestPath = path.join(dir, "page_client-reference-manifest.js");
    fs.writeFileSync(manifestPath, "self.__RSC_MANIFEST={};");
    console.log(`Created ${manifestPath}`);
  });

  console.log("Client reference manifest files created successfully.");
}

// Execute the function
createEmptyManifestFiles();
