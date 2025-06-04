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

// Function to fix references to non-id dynamic route parameters
function fixRouteReferences() {
  const allFiles = findFiles(".");
  const jsFiles = allFiles.filter(
    (file) =>
      file.endsWith(".ts") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js") ||
      file.endsWith(".jsx"),
  );

  const nonIdParams = ["name", "slug", "type", "username"];
  let filesFixed = 0;

  jsFiles.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");
    let fileModified = false;

    nonIdParams.forEach((param) => {
      // Fix params.param
      if (content.includes(`params.${param}`)) {
        content = content.replace(
          new RegExp(`params\\.${param}`, "g"),
          "params.id",
        );
        fileModified = true;
      }

      // Fix { param } destructuring
      if (content.includes(`{ ${param} }`)) {
        content = content.replace(
          new RegExp(`\\{ ${param} \\}`, "g"),
          "{ id }",
        );
        fileModified = true;
      }

      // Fix params: { param }
      if (content.includes(`params: { ${param}`)) {
        content = content.replace(
          new RegExp(`params: \\{ ${param}`, "g"),
          "params: { id",
        );
        fileModified = true;
      }

      // Fix interface definitions
      if (content.includes(`${param}: string`)) {
        content = content.replace(
          new RegExp(`${param}: string`, "g"),
          "id: string",
        );
        fileModified = true;
      }
    });

    if (fileModified) {
      fs.writeFileSync(file, content, "utf8");
      console.log(`Fixed references in: ${file}`);
      filesFixed++;
    }
  });

  console.log(`Fixed references in ${filesFixed} files.`);
}

// Run the fix
console.log("Fixing references to non-id dynamic route parameters...");
fixRouteReferences();
