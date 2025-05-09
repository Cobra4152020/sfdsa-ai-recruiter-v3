const fs = require("fs")
const path = require("path")

// Function to recursively find all directories in a directory
function findDirs(dir, dirList = []) {
  const items = fs.readdirSync(dir)

  items.forEach((item) => {
    const itemPath = path.join(dir, item)
    if (fs.statSync(itemPath).isDirectory()) {
      dirList.push(itemPath)
      dirList = findDirs(itemPath, dirList)
    }
  })

  return dirList
}

// Find all dynamic route directories
function findDynamicRouteDirs() {
  const allDirs = findDirs("app")
  return allDirs.filter((dir) => {
    const dirName = path.basename(dir)
    return dirName.startsWith("[") && dirName.endsWith("]")
  })
}

// Remove all dynamic route directories
function removeAllDynamicRouteDirs() {
  const dynamicRouteDirs = findDynamicRouteDirs()

  console.log("Removing all dynamic route directories:")
  dynamicRouteDirs.forEach((dir) => {
    console.log(`  Removing: ${dir}`)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  console.log("All dynamic route directories have been removed.")
}

// Run the removal
console.log("Starting removal of all dynamic route directories...")
removeAllDynamicRouteDirs()
console.log("Done!")
