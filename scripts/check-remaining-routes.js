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

// Check all dynamic route directories
function checkDynamicRouteDirs() {
  const dynamicRouteDirs = findDynamicRouteDirs()

  console.log("Dynamic Route Directories:")
  dynamicRouteDirs.forEach((dir) => {
    const dirName = path.basename(dir)
    console.log(`  ${dir} (${dirName})`)
  })

  // Check for non-[id] dynamic routes
  const nonIdDynamicRouteDirs = dynamicRouteDirs.filter((dir) => {
    const dirName = path.basename(dir)
    return dirName !== "[id]"
  })

  if (nonIdDynamicRouteDirs.length > 0) {
    console.log("\nNon-[id] Dynamic Route Directories:")
    nonIdDynamicRouteDirs.forEach((dir) => {
      const dirName = path.basename(dir)
      console.log(`  ${dir} (${dirName})`)
    })
  } else {
    console.log("\nAll dynamic route directories use [id]!")
  }
}

// Run the check
console.log("Checking dynamic route directories...")
checkDynamicRouteDirs()
