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

// Find all dynamic route directories that don't use [id]
function findNonIdDynamicRouteDirs() {
  const allDirs = findDirs("app")
  return allDirs.filter((dir) => {
    const dirName = path.basename(dir)
    return dirName.startsWith("[") && dirName.endsWith("]") && dirName !== "[id]"
  })
}

// Delete all non-[id] dynamic route directories
function deleteNonIdDynamicRouteDirs() {
  const dirsToDelete = findNonIdDynamicRouteDirs()

  dirsToDelete.forEach((dir) => {
    console.log(`Deleting directory: ${dir}`)
    fs.rmSync(dir, { recursive: true, force: true })
  })
}

// Run the deletion
console.log("Deleting non-[id] dynamic route directories...")
deleteNonIdDynamicRouteDirs()
console.log("Done!")
