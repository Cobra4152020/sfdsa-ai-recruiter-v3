/**
 * deploy-build.js - A specialized build script for deployment that inlines Tailwind CSS
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Download a file from a URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Main build function
async function buildProject() {
  try {
    log('Starting deployment build process...');
    
    // Clean any previous build artifacts
    if (fs.existsSync(path.join(process.cwd(), '.next'))) {
      log('Cleaning previous build...');
      fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true });
    }
    
    // Create public/css directory if it doesn't exist
    const publicCssDir = path.join(process.cwd(), 'public', 'css');
    if (!fs.existsSync(publicCssDir)) {
      fs.mkdirSync(publicCssDir, { recursive: true });
    }
    
    // Download Tailwind CSS
    log('Downloading Tailwind CSS...');
    const tailwindUrl = 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.17/dist/tailwind.min.css';
    const tailwindPath = path.join(publicCssDir, 'tailwind.min.css');
    await downloadFile(tailwindUrl, tailwindPath);
    log('Tailwind CSS downloaded to public/css/tailwind.min.css');
    
    // Set environment variables to skip problematic checks
    process.env.NEXT_PUBLIC_DISABLE_DATABASE_CHECKS = 'true';
    process.env.NEXT_PUBLIC_STATIC_BUILD = 'true';
    process.env.SKIP_DATABASE_VALIDATION = 'true';
    process.env.DISABLE_DB_DURING_BUILD = 'true';
    
    // Run Next.js build with environment variables set
    log('Running Next.js build...');
    execSync('npx next build', {
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_PUBLIC_DISABLE_DATABASE_CHECKS: 'true',
        NEXT_PUBLIC_STATIC_BUILD: 'true',
        SKIP_DATABASE_VALIDATION: 'true',
        DISABLE_DB_DURING_BUILD: 'true'
      }
    });
    
    // Run the client reference manifest fix script
    log('Fixing client reference manifest issues...');
    execSync('node scripts/fix-client-references.js', {
      stdio: 'inherit'
    });
    
    log('Build completed successfully!');
    
  } catch (error) {
    log(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the build
buildProject(); 