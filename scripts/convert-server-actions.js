const fs = require('fs');
const path = require('path');

const actionsDir = path.join(process.cwd(), 'app', 'actions');
const apiDir = path.join(process.cwd(), 'app', 'api', 'admin-actions');

// Create the admin-actions API directory if it doesn't exist
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Read all files in the actions directory
const actionFiles = fs.readdirSync(actionsDir);

actionFiles.forEach(file => {
  if (!file.endsWith('.ts')) return;

  const actionName = file.replace('.ts', '');
  const camelCaseActionName = actionName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const actionPath = path.join(actionsDir, file);
  const apiPath = path.join(apiDir, actionName);
  const routePath = path.join(apiPath, 'route.ts');

  // Create the API route directory
  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath, { recursive: true });
  }

  // Read the action file
  const actionContent = fs.readFileSync(actionPath, 'utf8');

  // Remove "use client" and "use server" directives, next/navigation imports, and revalidatePath usage
  const cleanedContent = actionContent
    .replace(/"use client"|"use server"/g, '')
    .replace(/import.*from ["']next\/navigation["'].*\n?/g, '')
    .replace(/import.*from ["']next\/cache["'].*\n?/g, '')
    .replace(/revalidatePath\(.*?\);?\n?/g, '')
    .replace(/if \(revalidatePaths.*?\{[\s\S]*?\}\n?/g, '')
    .trim();

  // Create the API route
  const routeContent = `import { NextResponse } from "next/server"
${cleanedContent}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await ${camelCaseActionName}(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error(\`Error in ${camelCaseActionName}:\`, error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}`;

  // Create the client-side action wrapper
  const clientActionPath = path.join(process.cwd(), 'lib', 'actions', `${actionName}.ts`);
  const clientActionContent = `export async function ${camelCaseActionName}(params: any) {
  try {
    const response = await fetch(\`/api/admin-actions/${actionName}\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || \`Failed to execute ${camelCaseActionName}\`);
    }

    return data;
  } catch (error) {
    console.error(\`Error in ${camelCaseActionName}:\`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}`;

  // Write the files
  fs.writeFileSync(routePath, routeContent);
  fs.writeFileSync(clientActionPath, clientActionContent);

  console.log(`Converted ${file} to API route and created client wrapper`);
});

console.log('Done converting server actions to API routes'); 