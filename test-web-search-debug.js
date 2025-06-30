// Quick test for Google Custom Search API
require('dotenv').config({ path: '.env.local' });

const GOOGLE_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

console.log('🔍 Testing Google Custom Search API...');
console.log('API Key present:', !!GOOGLE_API_KEY);
console.log('Search Engine ID present:', !!SEARCH_ENGINE_ID);

if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function testSearch() {
  const query = 'current mayor of San Francisco';
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;
  
  try {
    console.log('🌐 Making API request...');
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData.error?.message || 'Unknown error');
      console.error('Status:', response.status);
      return;
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      console.log('✅ SUCCESS! Found', data.items.length, 'results');
      console.log('First result:', {
        title: data.items[0].title,
        snippet: data.items[0].snippet.substring(0, 100) + '...',
        url: data.items[0].link
      });
    } else {
      console.log('⚠️ No results found');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testSearch(); 