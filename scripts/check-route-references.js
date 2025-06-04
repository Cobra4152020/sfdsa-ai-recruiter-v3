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

// Function to check for references to non-id dynamic routes
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
    console.log("References to non-id dynamic route parameters found:");
    referencesFound.forEach((ref) => {
      console.log(`  ${ref.file}: ${ref.type}`);
    });
  } else {
    console.log("No references to non-id dynamic route parameters found!");
  }
}

// Run the check
console.log("Checking for references to non-id dynamic route parameters...");
checkRouteReferences();
