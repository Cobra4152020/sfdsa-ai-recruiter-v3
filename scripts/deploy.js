const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clean build directories
console.log('Cleaning build directories...');
try {
  fs.rmSync('.next', { recursive: true, force: true });
  fs.rmSync('out', { recursive: true, force: true });
} catch (error) {
  console.log('No build directories to clean');
}

// Run build
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });

// Create .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
console.log('Creating .nojekyll file...');
fs.writeFileSync('out/.nojekyll', '');

// Copy 404.html to out directory if it exists
const custom404Path = path.join('pages', '404.html');
if (fs.existsSync(custom404Path)) {
  console.log('Copying 404.html...');
  fs.copyFileSync(custom404Path, path.join('out', '404.html'));
}

console.log('Deployment preparation complete!');
console.log('You can now commit and push the changes to GitHub.'); 