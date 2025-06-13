const fs = require('fs');

const filePath = 'app/api/trivia/games/questions/route.ts';

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Define image URL mappings using existing local images
const imageReplacements = {
  // SF Football - use existing images
  '/levis-stadium-49ers.png': '/levis-stadium-49ers.png', // Already correct
  '/49ers-super-bowl-rings.png': '/49ers-super-bowl-xxiii.png', // Use existing
  '/bill-walsh-coach.png': '/joe-montana-49ers.png', // Use Joe Montana as coach representation
  '/candlestick-park-49ers.png': '/levis-stadium-49ers.png', // Use current stadium
  '/joe-montana-cool.png': '/joe-montana-49ers.png', // Already exists
  '/49ers-red-and-gold-logo.png': '/sfdsa-logo.png', // Use available logo
  '/dwight-clark-the-catch.png': '/steve-young-mvp.png', // Use Steve Young

  // SF Baseball - use existing images  
  '/oracle-park-giants.png': '/oracle-park-giants.png', // Already correct
  '/oracle-park-history.png': '/oracle-park-giants.png', // Same image
  '/sf-giants-world-series-trophies.png': '/barry-bonds-giants-record.png', // Use Barry Bonds
  '/mccovey-cove-oracle-park.png': '/oracle-park-giants.png', // Same stadium
  '/barry-bonds-73-hr.png': '/barry-bonds-giants-record.png', // Already exists
  '/giants-move-to-sf.png': '/giants-move-1958.png', // Already exists

  // SF Basketball - use existing images
  '/chase-center-warriors.png': '/chase-center-gsw.png', // Already exists
  '/warriors-championship-trophies.png': '/chase-center-gsw.png', // Use arena
  '/stephen-curry-three-pointer.png': '/chase-center-gsw.png', // Use arena
  '/oracle-arena-warriors.png': '/chase-center-gsw.png', // Use current arena
  '/warriors-we-believe.png': '/chase-center-gsw.png', // Use arena
  '/golden-state-warriors-logo.png': '/chase-center-gsw.png', // Use arena
  '/klay-thompson-splash-brother.png': '/chase-center-gsw.png', // Use arena
  '/warriors-dynasty-celebration.png': '/chase-center-gsw.png', // Use arena

  // SF Districts - use existing images
  '/mission-district-sf.png': '/mission-district-sf.png', // Already correct
  '/mission-district-sf-murals.png': '/mission-district-sf.png', // Same district
  '/presidio-gg-bridge-view.png': '/golden-gate-bridge.png', // Use Golden Gate

  // SF Tourist Spots - use existing images
  '/alcatraz-island-sf.png': '/alcatraz-island-san-francisco.png', // Already exists
  '/golden-gate-bridge-sunset.png': '/golden-gate-bridge.png', // Already exists

  // SF Day Trips - use existing images
  '/napa-valley-vineyards.png': '/napa-valley-vineyards.png', // Already correct
  '/muir-woods-redwoods.png': '/muir-woods-day-trip.png', // Already exists
  '/carmel-by-the-sea.png': '/sausalito-day-trip.png', // Use similar coastal town
  '/berkeley-university-campus.png': '/silicon-valley-tech.png', // Use tech image
  '/highway-1-bixby-bridge.png': '/sausalito-day-trip.png', // Use coastal image
  '/santa-cruz-boardwalk.png': '/sausalito-day-trip.png', // Use coastal image
  '/monterey-bay-aquarium.png': '/monterey-bay-aquarium-interior.png', // Already exists
  '/sausalito-houseboats.png': '/sausalito-day-trip.png' // Already exists
};

// Replace all the image URLs
for (const [oldUrl, newUrl] of Object.entries(imageReplacements)) {
  const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, newUrl);
}

// Add imageUrl for sf-districts questions that don't have one
const addImageUrls = [
  // Haight-Ashbury question
  {
    search: /(id: "sf-districts-2",[\s\S]*?difficulty: "easy",\s*category: "Geography")(\s*})/,
    replace: '$1,\n      imageUrl: "/summer-of-love-1967-san-francisco.png",\n      imageAlt: "Haight-Ashbury during the Summer of Love"$2'
  },
  // Castro question
  {
    search: /(id: "sf-districts-3",[\s\S]*?difficulty: "easy",\s*category: "Geography")(\s*})/,
    replace: '$1,\n      imageUrl: "/castro-rainbow-flags.png",\n      imageAlt: "Rainbow flags in the Castro district"$2'
  },
  // Victorian houses question
  {
    search: /(id: "sf-districts-4",[\s\S]*?difficulty: "medium",\s*category: "Geography")(\s*})/,
    replace: '$1,\n      imageUrl: "/san-francisco-apartments.png",\n      imageAlt: "Victorian houses on a San Francisco hill"$2'
  },
  // SOMA question
  {
    search: /(id: "sf-districts-5",[\s\S]*?difficulty: "medium",\s*category: "Geography")(\s*})/,
    replace: '$1,\n      imageUrl: "/silicon-valley-tech.png",\n      imageAlt: "Modern buildings in the SOMA district"$2'
  },
  // Russian Hill question
  {
    search: /(id: "sf-districts-7",[\s\S]*?difficulty: "medium",\s*category: "Geography")(\s*})/,
    replace: '$1,\n      imageUrl: "/lombard-street-crooked.png",\n      imageAlt: "The famous crooked Lombard Street"$2'
  }
];

// Apply the image URL additions
addImageUrls.forEach(({ search, replace }) => {
  content = content.replace(search, replace);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated all trivia game image URLs to use local images!');
console.log('Using existing images from public directory:');
Object.entries(imageReplacements).forEach(([old, newUrl]) => {
  console.log(`  ${old} → ${newUrl}`);
});
console.log('Added missing image URLs for sf-districts questions using local images.'); 