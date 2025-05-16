import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DYNAMIC_EXPORT = `export const dynamic = 'force-dynamic';\n\n`;

async function addDynamicExportToFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const dynamic')) {
    const newContent = content.replace(/^(import[^;]+;(\r?\n)?)*/, `$&\n${DYNAMIC_EXPORT}`);
    fs.writeFileSync(filePath, newContent);
    console.log(`Added dynamic export to ${filePath}`);
  }
}

async function main() {
  const apiRoutes = await glob('app/api/**/*.ts');
  
  for (const route of apiRoutes) {
    if (route.endsWith('route.ts')) {
      await addDynamicExportToFile(route);
    }
  }
}

main().catch(console.error); 