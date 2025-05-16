const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      fileList = findFiles(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Find all dynamic route files in the app directory
function findDynamicRouteFiles() {
  const allFiles = findFiles("app")
  return allFiles.filter((file) => {
    const fileName = path.basename(path.dirname(file))
    return fileName.startsWith("[") && fileName.endsWith("]")
  })
}

// Standardize all dynamic route parameters to 'id'
function standardizeDynamicRoutes() {
  const dynamicRouteFiles = findDynamicRouteFiles()

  dynamicRouteFiles.forEach((file) => {
    const dirPath = path.dirname(file)
    const dirName = path.basename(dirPath)

    // Skip if already using [id]
    if (dirName === "[id]") return

    // Create the new directory path with [id]
    const newDirPath = path.join(path.dirname(dirPath), "[id]")

    // Create the new directory if it doesn't exist
    if (!fs.existsSync(newDirPath)) {
      fs.mkdirSync(newDirPath, { recursive: true })
    }

    // Copy the file to the new location
    const fileName = path.basename(file)
    const newFilePath = path.join(newDirPath, fileName)
    fs.copyFileSync(file, newFilePath)

    console.log(`Moved: ${file} -> ${newFilePath}`)

    // Delete the old file
    fs.unlinkSync(file)

    // Try to remove the old directory if it's empty
    try {
      fs.rmdirSync(dirPath)
      console.log(`Removed empty directory: ${dirPath}`)
    } catch (err) {
      // Directory not empty, that's fine
    }
  })
}

// Run the standardization
console.log("Standardizing dynamic routes...")
standardizeDynamicRoutes()
console.log("Done!")
