const fs = require("fs")
const path = require("path")

// Function to check if a directory name contains dynamic route syntax
function isDynamicRoute(dirName) {
  return dirName.includes("[") && dirName.includes("]")
}

// Function to recursively find and remove dynamic route directories
function removeDynamicRoutes(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`)
    return
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const itemPath = path.join(dir, item)
    const stats = fs.statSync(itemPath)

    if (stats.isDirectory()) {
      if (isDynamicRoute(item)) {
        console.log(`Removing dynamic route directory: ${itemPath}`)
        fs.rmSync(itemPath, { recursive: true, force: true })
      } else {
        // Recursively check subdirectories
        removeDynamicRoutes(itemPath)
      }
    }
  }
}

// Start with the app directory
console.log("Starting to remove dynamic routes...")
removeDynamicRoutes(path.join(process.cwd(), "app"))
console.log("Finished removing dynamic routes.")
