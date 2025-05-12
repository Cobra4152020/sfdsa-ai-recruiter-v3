const fs = require("fs")
const path = require("path")

// Function to recursively find and process all TypeScript/JavaScript files
function processFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`)
    return
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const itemPath = path.join(dir, item)
    const stats = fs.statSync(itemPath)

    if (stats.isDirectory()) {
      // Skip node_modules and .next directories
      if (item !== "node_modules" && item !== ".next") {
        processFiles(itemPath)
      }
    } else if (
      stats.isFile() &&
      (itemPath.endsWith(".ts") || itemPath.endsWith(".tsx") || itemPath.endsWith(".js") || itemPath.endsWith(".jsx"))
    ) {
      updateFileReferences(itemPath)
    }
  }
}

// Function to update references in a file
function updateFileReferences(filePath) {
  let content = fs.readFileSync(filePath, "utf8")
  let modified = false

  // Update params.name, params.slug, params.type, etc. to params.id
  const paramsRegex = /params\.(name|slug|type|username)/g
  if (paramsRegex.test(content)) {
    content = content.replace(paramsRegex, "params.id")
    modified = true
  }

  // Update destructured { name }, { slug }, { type }, etc. to { id }
  const destructureRegex = /\{\s*(name|slug|type|username)\s*\}/g
  if (destructureRegex.test(content)) {
    content = content.replace(destructureRegex, "{ id }")
    modified = true
  }

  // Update interface definitions
  const interfaceRegex = /(name|slug|type|username):\s*string/g
  if (interfaceRegex.test(content)) {
    content = content.replace(interfaceRegex, "id: string")
    modified = true
  }

  // Update route strings
  const routeRegex = /\/(users|badges|user-badge|nft-awards|profile|badge)\/\[\w+\]/g
  if (routeRegex.test(content)) {
    content = content.replace(routeRegex, (match) => {
      const basePath = match.split("/[")[0]
      return `${basePath}/[id]`
    })
    modified = true
  }

  if (modified) {
    console.log(`Updated references in: ${filePath}`)
    fs.writeFileSync(filePath, content, "utf8")
  }
}

// Start processing from the project root
console.log("Starting to update route references...")
processFiles(process.cwd())
console.log("Finished updating route references.")
