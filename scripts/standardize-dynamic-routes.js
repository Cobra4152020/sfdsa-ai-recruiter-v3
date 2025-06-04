const fs = require("fs");
const path = require("path");

// Function to check if a directory name contains dynamic route syntax
function isDynamicRoute(dirName) {
  return dirName.includes("[") && dirName.includes("]");
}

// Function to get the standardized name for a dynamic route
function getStandardizedName(dirName) {
  // If it's already using [id], keep it as is
  if (dirName === "[id]") return dirName;

  // Otherwise, replace any dynamic parameter with [id]
  return "[id]";
}

// Function to recursively find and rename dynamic route directories
function standardizeDynamicRoutes(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // First, recursively process subdirectories
      standardizeDynamicRoutes(itemPath);

      // Then check if this directory itself is a dynamic route
      if (isDynamicRoute(item)) {
        const standardizedName = getStandardizedName(item);
        if (item !== standardizedName) {
          const newPath = path.join(dir, standardizedName);
          console.log(`Renaming: ${itemPath} -> ${newPath}`);

          // Check if the target directory already exists
          if (fs.existsSync(newPath)) {
            console.log(`Target directory already exists: ${newPath}`);
            console.log(`Merging contents from: ${itemPath}`);

            // Copy all files from the source to the target
            const files = fs.readdirSync(itemPath);
            for (const file of files) {
              const srcFilePath = path.join(itemPath, file);
              const destFilePath = path.join(newPath, file);

              if (fs.statSync(srcFilePath).isFile()) {
                fs.copyFileSync(srcFilePath, destFilePath);
                console.log(`Copied: ${srcFilePath} -> ${destFilePath}`);
              }
            }

            // Remove the source directory
            fs.rmSync(itemPath, { recursive: true, force: true });
            console.log(`Removed: ${itemPath}`);
          } else {
            // Simply rename the directory
            fs.renameSync(itemPath, newPath);
          }
        }
      }
    }
  }
}

// Start with the app directory
console.log("Starting to standardize dynamic routes...");
standardizeDynamicRoutes(path.join(process.cwd(), "app"));
console.log("Finished standardizing dynamic routes.");
