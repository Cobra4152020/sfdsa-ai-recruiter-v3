const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Start from the api directory
const apiDir = path.join(process.cwd(), 'app', 'api');

walkDir(apiDir, function(filePath) {
  if (filePath.endsWith('route.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace force-dynamic with force-static
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      content = content.replace(
        "export const dynamic = 'force-dynamic'",
        "export const dynamic = 'force-static';\nexport const revalidate = 3600; // Revalidate every hour"
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}); 