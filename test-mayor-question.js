// Test the exact mayor question flow
require('dotenv').config({ path: '.env.local' });

async function testMayorQuestion() {
  console.log('🔍 Testing Mayor Question Flow...');
  
  // Test 1: Check keyword detection
  const userMessage = "who is the mayor";
  const searchKeywords = ['who is', 'what is', 'current', 'latest', 'news', 'in 2024', 'in 2025'];
  const needsWebSearch = searchKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
  
  console.log('❓ Question:', userMessage);
  console.log('🔍 Should trigger web search:', needsWebSearch);
  
  if (needsWebSearch) {
    // Test 2: Try the web search directly
    console.log('🌐 Testing web search...');
    
    try {
      const { webSearch } = require('./lib/assistant-tools.ts');
      const searchResults = await webSearch(userMessage);
      
      console.log('📊 Search Results Count:', searchResults.length);
      if (searchResults.length > 0) {
        console.log('📋 First Result:');
        console.log('  Title:', searchResults[0].title);
        console.log('  Snippet:', searchResults[0].snippet.substring(0, 150) + '...');
        console.log('  URL:', searchResults[0].url);
      }
      
      // Test 3: Try the full chat API flow
      console.log('\n🤖 Testing full chat API...');
      const { generateChatResponse } = require('./lib/openai-service.ts');
      const result = await generateChatResponse(userMessage, []);
      
      console.log('✅ Chat Response Success:', result.success);
      console.log('🔍 Search Used:', result.searchUsed);
      console.log('💬 Response Preview:', result.response.substring(0, 200) + '...');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testMayorQuestion(); 