const fs = require('fs');
const path = require('path');

// Badge image mapping
const REQUIRED_BADGES = {
  // Achievement Badges
  'physical.png': 'Physical Test - Blue dumbbells/weights',
  'psychological.png': 'Psychological - Brain with medical cross', 
  'oral.png': 'Oral Board - Interview scene with two people',
  'polygraph.png': 'Polygraph - Computer with analytics/graph',
  'written.png': 'Written Test - Document with A+ grade and pencil',
  
  // Process Badges
  'full.png': 'Full Process - Completed all preparation areas',
  'chat-participation.png': 'Chat Participation - Engaged with Sgt. Ken',
  'first-response.png': 'First Response - Received first response from Sgt. Ken',
  'application-started.png': 'Application Started - Started the application process',
  'application-completed.png': 'Application Completed - Completed the application process',
  
  // Participation Badges
  'frequent-user.png': 'Frequent User - Regularly engages with the recruitment platform',
  'resource-downloader.png': 'Resource Downloader - Downloaded recruitment resources and materials',
  'hard-charger.png': 'Hard Charger - Show exceptional dedication and enthusiasm'
};

const BADGES_DIR = path.join(__dirname, '..', 'public', 'badges');

console.log('🔍 Verifying Badge Images Setup...\n');

// Check if badges directory exists
if (!fs.existsSync(BADGES_DIR)) {
  console.log('❌ ERROR: /public/badges/ directory does not exist!');
  console.log('   Please create the directory first.');
  process.exit(1);
}

console.log('✅ Badges directory exists');

// Check each required badge
let allBadgesFound = true;
let foundBadges = [];
let missingBadges = [];

Object.entries(REQUIRED_BADGES).forEach(([filename, description]) => {
  const filepath = path.join(BADGES_DIR, filename);
  
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    
    console.log(`✅ ${filename} - ${description}`);
    console.log(`   Size: ${sizeKB} KB`);
    foundBadges.push(filename);
  } else {
    console.log(`❌ ${filename} - ${description}`);
    console.log('   File not found!');
    missingBadges.push(filename);
    allBadgesFound = false;
  }
  console.log('');
});

// Check for extra files
const allFiles = fs.readdirSync(BADGES_DIR);
const extraFiles = allFiles.filter(file => 
  !Object.keys(REQUIRED_BADGES).includes(file) && 
  file !== 'README.md' &&
  !file.startsWith('.')
);

if (extraFiles.length > 0) {
  console.log('ℹ️  Extra files found:');
  extraFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  console.log('');
}

// Summary
console.log('📊 SUMMARY:');
console.log(`   Found: ${foundBadges.length}/${Object.keys(REQUIRED_BADGES).length} required badges`);
console.log(`   Missing: ${missingBadges.length}/${Object.keys(REQUIRED_BADGES).length} required badges`);

if (allBadgesFound) {
  console.log('\n🎉 SUCCESS: All badge images are properly set up!');
  console.log('   You can now visit /test-badges to see them in action.');
} else {
  console.log('\n⚠️  INCOMPLETE SETUP:');
  console.log('   Missing badges:');
  missingBadges.forEach(badge => {
    console.log(`   - ${badge}`);
  });
  console.log('\n   Please save the missing images to /public/badges/');
}

console.log('\n🔗 Next steps:');
console.log('   1. Save any missing badge images');
console.log('   2. Visit http://localhost:3000/test-badges to test');
console.log('   3. Check the badge legend at /badges');
console.log('   4. Run this script again to verify'); 