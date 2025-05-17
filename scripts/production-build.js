const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Run a command and wait for it to complete
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    
    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        console.warn(`Command warnings: ${stderr}`);
      }
      
      console.log(stdout);
      resolve(stdout);
    });
    
    // Forward the output to the console in real-time
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  });
}

async function buildForProduction() {
  try {
    console.log('=== Starting production build with CSS optimization ===');
    
    // 1. Make sure dependencies are installed
    console.log('Checking dependencies...');
    await runCommand('pnpm install autoprefixer --save-dev');
    
    // 2. Generate CSS with Tailwind
    console.log('Generating CSS with Tailwind...');
    const cssOutputDir = path.join(process.cwd(), 'styles');
    if (!fs.existsSync(cssOutputDir)) {
      fs.mkdirSync(cssOutputDir, { recursive: true });
    }
    
    const inputCss = path.join(process.cwd(), 'styles', 'index.css');
    const outputCss = path.join(cssOutputDir, 'tailwind-output.css');
    
    await runCommand(`npx tailwindcss -i ${inputCss} -o ${outputCss} --minify`);
    console.log(`Tailwind CSS built and saved to ${outputCss}`);
    
    // Copy the built CSS to a location Next.js can see during build
    const publicCssDir = path.join(process.cwd(), 'public', 'css');
    if (!fs.existsSync(publicCssDir)) {
      fs.mkdirSync(publicCssDir, { recursive: true });
    }
    fs.copyFileSync(outputCss, path.join(publicCssDir, 'tailwind-output.css'));
    console.log('CSS copied to public directory for static serving');
    
    // 3. Run Next.js build
    console.log('Building Next.js application...');
    await runCommand('pnpm next build');
    
    // 4. Run the client reference fix script
    console.log('Running client reference fix...');
    await runCommand('node scripts/fix-client-references.js');
    
    console.log('=== Production build completed successfully! ===');
    return true;
  } catch (error) {
    console.error('Production build failed:', error);
    return false;
  }
}

// Run the build process
buildForProduction(); 