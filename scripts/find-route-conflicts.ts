import fs from "fs"
import path from "path"

// Function to recursively find all files in a directory
function findFiles(dir: string, fileList: string[] = []): string[] {
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

// Function to extract dynamic route segments from file paths
function extractDynamicRoutes(files: string[]): { [key: string]: Set<string> } {
  const routes: { [key: string]: Set<string> } = {}

  files.forEach((file) => {
    // Only look at files in the app directory
    if (!file.includes("app")) return

    // Extract the route path from the file path
    const routePath = file.split("app")[1]

    // Check if the route has dynamic segments
    if (routePath.includes("[") && routePath.includes("]")) {
      // Extract the dynamic segments
      const segments = routePath.split("/")
      const dynamicSegments = segments.filter((segment) => segment.includes("[") && segment.includes("]"))

      // For each dynamic segment, extract the parameter name
      dynamicSegments.forEach((segment) => {
        const paramName = segment.replace("[", "").replace("]", "").split(".")[0]
        const routePattern = routePath.replace(segment, "[param]")

        if (!routes[routePattern]) {
          routes[routePattern] = new Set()
        }

        routes[routePattern].add(paramName)
      })
    }
  })

  return routes
}

// Find all files in the project
const allFiles = findFiles(".")

// Extract dynamic routes
const dynamicRoutes = extractDynamicRoutes(allFiles)

// Find routes with conflicting parameter names
const conflicts: { [key: string]: string[] } = {}

Object.entries(dynamicRoutes).forEach(([routePattern, paramNames]) => {
  if (paramNames.size > 1) {
    conflicts[routePattern] = Array.from(paramNames)
  }
})

// Print the results
console.log("Dynamic Routes:")
Object.entries(dynamicRoutes).forEach(([routePattern, paramNames]) => {
  console.log(`  ${routePattern}: ${Array.from(paramNames).join(", ")}`)
})

console.log("\nConflicts:")
if (Object.keys(conflicts).length === 0) {
  console.log("  No conflicts found!")
} else {
  Object.entries(conflicts).forEach(([routePattern, paramNames]) => {
    console.log(`  ${routePattern}: ${paramNames.join(", ")}`)
  })
}
