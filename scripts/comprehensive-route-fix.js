const fs = require("fs");
const path = require("path");

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = findFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to extract dynamic route segments from file paths
function extractDynamicRoutes(files) {
  const routes = {};

  files.forEach((file) => {
    // Only look at files in the app directory
    if (!file.includes("app")) return;

    // Extract the route path from the file path
    const routePath = file.split("app")[1];

    // Check if the route has dynamic segments
    if (routePath.includes("[") && routePath.includes("]")) {
      // Extract the dynamic segments
      const segments = routePath.split("/");
      const dynamicSegments = segments.filter(
        (segment) => segment.includes("[") && segment.includes("]"),
      );

      // For each dynamic segment, extract the parameter name
      dynamicSegments.forEach((segment) => {
        const paramName = segment
          .replace("[", "")
          .replace("]", "")
          .split(".")[0];
        const routePattern = routePath.replace(segment, "[param]");

        if (!routes[routePattern]) {
          routes[routePattern] = new Set();
        }

        routes[routePattern].add(paramName);
      });
    }
  });

  return routes;
}

// Function to rename a dynamic route directory
function renameDynamicRouteDir(oldPath, newPath) {
  // Create the new directory if it doesn't exist
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }

  // Copy all files from old directory to new directory
  const files = fs.readdirSync(oldPath);
  files.forEach((file) => {
    const oldFilePath = path.join(oldPath, file);
    const newFilePath = path.join(newPath, file);

    if (fs.statSync(oldFilePath).isDirectory()) {
      renameDynamicRouteDir(oldFilePath, newFilePath);
    } else {
      fs.copyFileSync(oldFilePath, newFilePath);
    }
  });

  // Remove the old directory
  fs.rmSync(oldPath, { recursive: true, force: true });
}

// Function to update file content to use 'id' parameter
function updateFileContent(filePath, oldParam, newParam = "id") {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Replace parameter in params object
  content = content.replace(
    new RegExp(`params: {[^}]*${oldParam}[^}]*}`, "g"),
    (match) => match.replace(oldParam, newParam),
  );

  // Replace parameter in destructuring
  content = content.replace(
    new RegExp(`{ ${oldParam} }`, "g"),
    `{ ${newParam} }`,
  );

  // Replace parameter in direct usage
  content = content.replace(
    new RegExp(`params\\.${oldParam}`, "g"),
    `params.${newParam}`,
  );

  fs.writeFileSync(filePath, content, "utf8");
}

// Function to fix all dynamic routes
function fixAllDynamicRoutes() {
  const allFiles = findFiles(".");
  const dynamicRoutes = extractDynamicRoutes(allFiles);

  // Find routes with conflicting parameter names
  const conflicts = {};
  Object.entries(dynamicRoutes).forEach(([routePattern, paramNames]) => {
    if (paramNames.size > 1) {
      conflicts[routePattern] = Array.from(paramNames);
    }
  });

  // Fix conflicting routes
  Object.entries(conflicts).forEach(([routePattern, paramNames]) => {
    console.log(`Fixing conflict for route pattern: ${routePattern}`);

    // Skip if 'id' is already one of the parameter names
    if (paramNames.includes("id")) {
      paramNames = paramNames.filter((name) => name !== "id");
    }

    // For each non-'id' parameter, rename the directory and update file content
    paramNames.forEach((paramName) => {
      const matchingFiles = allFiles.filter((file) => {
        if (!file.includes("app")) return false;

        const filePath = file.split("app")[1];
        return filePath.includes(`[${paramName}]`);
      });

      matchingFiles.forEach((file) => {
        const dirPath = path.dirname(file);
        const dirName = path.basename(dirPath);

        if (dirName === `[${paramName}]`) {
          const newDirPath = path.join(path.dirname(dirPath), "[id]");
          console.log(`Renaming directory: ${dirPath} -> ${newDirPath}`);

          // Rename the directory
          renameDynamicRouteDir(dirPath, newDirPath);

          // Update file content in the new location
          const fileName = path.basename(file);
          const newFilePath = path.join(newDirPath, fileName);
          updateFileContent(newFilePath, paramName);
        }
      });
    });
  });

  // Update references in all files
  console.log("Updating references in all files...");
  allFiles.forEach((file) => {
    if (
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js") ||
      file.endsWith(".jsx")
    ) {
      Object.entries(conflicts).forEach(([routePattern, paramNames]) => {
        paramNames.forEach((paramName) => {
          if (paramName !== "id") {
            updateFileContent(file, paramName);
          }
        });
      });
    }
  });
}

// Run the fix
console.log("Starting comprehensive route fix...");
fixAllDynamicRoutes();
console.log("Done!");
