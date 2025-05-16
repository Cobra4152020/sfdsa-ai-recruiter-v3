import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DYNAMIC_EXPORT = `export const dynamic = 'force-dynamic';\n\n`;

async function addDynamicExportToFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const dynamic')) {
    // Split content into lines
    const lines = content.split('\n');
    
    // Find the last import statement
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    // If we found imports, add after the last import
    // If no imports were found, add at the beginning of the file
    const insertIndex = lastImportIndex === -1 ? 0 : lastImportIndex + 1;
    
    // Add an empty line after imports if there are imports
    const insertContent = lastImportIndex === -1 ? DYNAMIC_EXPORT : `\n${DYNAMIC_EXPORT}`;
    
    // Join the content back together
    const newContent = [
      ...lines.slice(0, insertIndex),
      insertContent,
      ...lines.slice(insertIndex)
    ].join('\n');

    fs.writeFileSync(filePath, newContent);
    console.log(`Added dynamic export to ${filePath}`);
  }
}

async function main() {
  try {
    const apiRoutes = await new Promise<string[]>((resolve, reject) => {
      glob('app/api/**/*.ts', (err, matches) => {
        if (err) reject(err);
        else resolve(matches);
      });
    });
    
    for (const route of apiRoutes) {
      if (route.endsWith('route.ts')) {
        await addDynamicExportToFile(route);
      }
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

main().catch(console.error); 