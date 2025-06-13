const fs = require('fs');
const path = require('path');

const filePath = 'app/api/trivia/games/questions/route.ts';

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Define image URL mappings for different categories/topics
const imageReplacements = {
  // SF Football
  '/levis-stadium-49ers.png': 'https://source.unsplash.com/800x600/?stadium,football',
  '/49ers-super-bowl-rings.png': 'https://source.unsplash.com/800x600/?championship,trophy',
  '/bill-walsh-coach.png': 'https://source.unsplash.com/800x600/?coach,football',
  '/candlestick-park-49ers.png': 'https://source.unsplash.com/800x600/?stadium,vintage',
  '/joe-montana-cool.png': 'https://source.unsplash.com/800x600/?quarterback,football',
  '/49ers-red-and-gold-logo.png': 'https://source.unsplash.com/800x600/?team,logo',
  '/dwight-clark-the-catch.png': 'https://source.unsplash.com/800x600/?football,catch',

  // SF Baseball
  '/oracle-park-giants.png': 'https://source.unsplash.com/800x600/?baseball,stadium',
  '/oracle-park-history.png': 'https://source.unsplash.com/800x600/?baseball,ballpark',
  '/sf-giants-world-series-trophies.png': 'https://source.unsplash.com/800x600/?trophy,championship',
  '/mccovey-cove-oracle-park.png': 'https://source.unsplash.com/800x600/?bay,water,baseball',
  '/barry-bonds-73-hr.png': 'https://source.unsplash.com/800x600/?baseball,homerun',
  '/giants-move-to-sf.png': 'https://source.unsplash.com/800x600/?newspaper,vintage',

  // SF Basketball
  '/chase-center-warriors.png': 'https://source.unsplash.com/800x600/?basketball,arena',
  '/warriors-championship-trophies.png': 'https://source.unsplash.com/800x600/?basketball,trophy',
  '/stephen-curry-three-pointer.png': 'https://source.unsplash.com/800x600/?basketball,shooting',
  '/oracle-arena-warriors.png': 'https://source.unsplash.com/800x600/?basketball,arena',
  '/warriors-we-believe.png': 'https://source.unsplash.com/800x600/?basketball,fans',
  '/golden-state-warriors-logo.png': 'https://source.unsplash.com/800x600/?basketball,team',
  '/klay-thompson-splash-brother.png': 'https://source.unsplash.com/800x600/?basketball,player',
  '/warriors-dynasty-celebration.png': 'https://source.unsplash.com/800x600/?celebration,championship',

  // SF Districts
  '/mission-district-sf.png': 'https://source.unsplash.com/800x600/?san-francisco,neighborhood',
  '/mission-district-sf-murals.png': 'https://source.unsplash.com/800x600/?street-art,murals',
  '/presidio-gg-bridge-view.png': 'https://source.unsplash.com/800x600/?golden-gate-bridge,view',

  // SF Tourist Spots
  '/alcatraz-island-sf.png': 'https://source.unsplash.com/800x600/?alcatraz,prison',
  '/golden-gate-bridge-sunset.png': 'https://source.unsplash.com/800x600/?golden-gate-bridge,sunset',

  // SF Day Trips
  '/napa-valley-vineyards.png': 'https://source.unsplash.com/800x600/?vineyard,wine',
  '/muir-woods-redwoods.png': 'https://source.unsplash.com/800x600/?redwood,forest',
  '/carmel-by-the-sea.png': 'https://source.unsplash.com/800x600/?carmel,cottage',
  '/berkeley-university-campus.png': 'https://source.unsplash.com/800x600/?university,campus',
  '/highway-1-bixby-bridge.png': 'https://source.unsplash.com/800x600/?highway,coast',
  '/santa-cruz-boardwalk.png': 'https://source.unsplash.com/800x600/?boardwalk,amusement',
  '/monterey-bay-aquarium.png': 'https://source.unsplash.com/800x600/?aquarium,marine',
  '/sausalito-houseboats.png': 'https://source.unsplash.com/800x600/?houseboat,bay'
};

// Replace all the image URLs
for (const [oldUrl, newUrl] of Object.entries(imageReplacements)) {
  const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, newUrl);
}

// Also add imageUrl for questions that don't have one
// Find questions without imageUrl and add appropriate ones
const addImageUrls = [
  // Haight-Ashbury question
  {
    search: /id: "sf-districts-2",\s*gameId: "sf-districts",\s*question: "Which district is famous for the 1960s counterculture movement\?",[\s\S]*?difficulty: "easy",\s*category: "Geography"/,
    replace: (match) => match + ',\n      imageUrl: "https://source.unsplash.com/800x600/?haight-ashbury,hippie",\n      imageAlt: "Colorful Victorian houses in Haight-Ashbury district"'
  },
  // Castro question
  {
    search: /id: "sf-districts-3",\s*gameId: "sf-districts",\s*question: "Which neighborhood is known as the heart of the LGBT community\?",[\s\S]*?difficulty: "easy",\s*category: "Geography"/,
    replace: (match) => match + ',\n      imageUrl: "https://source.unsplash.com/800x600/?castro,rainbow",\n      imageAlt: "Rainbow flag in the Castro district"'
  },
  // Victorian houses question
  {
    search: /id: "sf-districts-4",\s*gameId: "sf-districts",\s*question: "Which district is famous for its Victorian houses and steep hills\?",[\s\S]*?difficulty: "medium",\s*category: "Geography"/,
    replace: (match) => match + ',\n      imageUrl: "https://source.unsplash.com/800x600/?victorian,houses,san-francisco",\n      imageAlt: "Beautiful Victorian houses on a steep San Francisco hill"'
  },
  // SOMA question
  {
    search: /id: "sf-districts-5",\s*gameId: "sf-districts",\s*question: "What does SOMA stand for\?",[\s\S]*?difficulty: "medium",\s*category: "Geography"/,
    replace: (match) => match + ',\n      imageUrl: "https://source.unsplash.com/800x600/?soma,san-francisco,business",\n      imageAlt: "Modern buildings in the SOMA district"'
  },
  // Russian Hill question
  {
    search: /id: "sf-districts-7",\s*gameId: "sf-districts",\s*question: "Which district contains the famous Lombard Street\?",[\s\S]*?difficulty: "medium",\s*category: "Geography"/,
    replace: (match) => match + ',\n      imageUrl: "https://source.unsplash.com/800x600/?lombard-street,crooked",\n      imageAlt: "The famous crooked Lombard Street in Russian Hill"'
  }
];

// Apply the image URL additions
addImageUrls.forEach(({ search, replace }) => {
  content = content.replace(search, replace);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated all trivia game image URLs to use Unsplash!');
console.log('Fixed image paths:');
Object.entries(imageReplacements).forEach(([old, newUrl]) => {
  console.log(`  ${old} → ${newUrl}`);
});
console.log('Added missing image URLs for sf-districts questions.'); 