const fs = require("fs");
const path = require("path");

// Function to recursively find all directories in a directory
function findDirs(dir, dirList = []) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      dirList.push(itemPath);
      dirList = findDirs(itemPath, dirList);
    }
  });

  return dirList;
}

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

// Find all dynamic route directories
function findDynamicRouteDirs() {
  const allDirs = findDirs("app");
  return allDirs.filter((dir) => {
    const dirName = path.basename(dir);
    return dirName.startsWith("[") && dirName.endsWith("]");
  });
}

// Check all dynamic route directories
function checkDynamicRouteDirs() {
  const dynamicRouteDirs = findDynamicRouteDirs();

  console.log("Dynamic Route Directories:");
  dynamicRouteDirs.forEach((dir) => {
    const dirName = path.basename(dir);
    console.log(`  ${dir} (${dirName})`);
  });

  // Check for non-[id] dynamic routes
  const nonIdDynamicRouteDirs = dynamicRouteDirs.filter((dir) => {
    const dirName = path.basename(dir);
    return dirName !== "[id]";
  });

  if (nonIdDynamicRouteDirs.length > 0) {
    console.log("\nNon-[id] Dynamic Route Directories:");
    nonIdDynamicRouteDirs.forEach((dir) => {
      const dirName = path.basename(dir);
      console.log(`  ${dir} (${dirName})`);
    });
    return false;
  } else {
    console.log("\nAll dynamic route directories use [id]!");
    return true;
  }
}

// Check for references to non-id dynamic route parameters
function checkRouteReferences() {
  const allFiles = findFiles(".");
  const jsFiles = allFiles.filter(
    (file) =>
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js") ||
      file.endsWith(".jsx"),
  );

  const nonIdParams = ["name", "slug", "type", "username"];
  const referencesFound = [];

  jsFiles.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");

    nonIdParams.forEach((param) => {
      // Check for params.param
      if (content.includes(`params.${param}`)) {
        referencesFound.push({
          file,
          param,
          type: `params.${param}`,
        });
      }

      // Check for { param } destructuring
      if (content.includes(`{ ${param} }`)) {
        referencesFound.push({
          file,
          param,
          type: `{ ${param} }`,
        });
      }

      // Check for params: { param }
      if (content.includes(`params: { ${param}`)) {
        referencesFound.push({
          file,
          param,
          type: `params: { ${param} }`,
        });
      }
    });
  });

  if (referencesFound.length > 0) {
    console.log("\nReferences to non-id dynamic route parameters found:");
    referencesFound.forEach((ref) => {
      console.log(`  ${ref.file}: ${ref.type}`);
    });
    return false;
  } else {
    console.log("\nNo references to non-id dynamic route parameters found!");
    return true;
  }
}

// Run the final check
console.log("Running final route check...");
const dirsOk = checkDynamicRouteDirs();
const refsOk = checkRouteReferences();

if (dirsOk && refsOk) {
  console.log("\nAll checks passed! Your project should build successfully.");
} else {
  console.log("\nSome issues were found. Please fix them before building.");
}
