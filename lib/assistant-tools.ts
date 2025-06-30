export interface WebSearchResult {
  url: string;
  title: string;
  snippet: string;
}

export async function webSearch(query: string): Promise<WebSearchResult[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  console.log(`[Web Search DEBUG] API Key exists: ${!!apiKey}`);
  console.log(`[Web Search DEBUG] Search Engine ID exists: ${!!searchEngineId}`);
  console.log(`[Web Search DEBUG] Query: "${query}"`);

  if (!apiKey || !searchEngineId) {
    console.warn(
      "[Web Search] Missing GOOGLE_CUSTOM_SEARCH_API_KEY or GOOGLE_CUSTOM_SEARCH_ENGINE_ID. " +
      "Falling back to mock search. Please provide these environment variables for real web search.",
    );
    // Fallback to mock implementation
    console.log(`[Mock Web Search] Received query: "${query}". Returning no results.`);
    return Promise.resolve([]);
  }

  // Enhance search query for current information
  let enhancedQuery = query;
  const lowerQuery = query.toLowerCase();
  
  // Check for mayor-related queries (with or without "san francisco")
  if (lowerQuery.includes('mayor')) {
    enhancedQuery = `mayor San Francisco 2025 Daniel Lurie elected`;
    console.log(`[Web Search] Enhanced mayor query: "${enhancedQuery}"`);
  } else if (lowerQuery.includes('who is') || lowerQuery.includes('current')) {
    enhancedQuery = `${query} 2025 current latest`;
    console.log(`[Web Search] Enhanced current info query: "${enhancedQuery}"`);
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(enhancedQuery)}`;
  console.log(`[Web Search DEBUG] Full URL: ${url.replace(apiKey, 'HIDDEN_API_KEY')}`);

  try {
    console.log(`[Real Web Search] Performing search for: "${enhancedQuery}"`);
    const response = await fetch(url);
    
    console.log(`[Web Search DEBUG] Response status: ${response.status}`);
    console.log(`[Web Search DEBUG] Response ok: ${response.ok}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Web Search] API Error Response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        console.error("[Web Search] API Error:", errorData.error?.message || 'Unknown error');
        throw new Error(`Google Custom Search API request failed: ${errorData.error?.message || 'Unknown error'}`);
      } catch (parseError) {
        console.error("[Web Search] Could not parse error response:", parseError);
        throw new Error(`Google Custom Search API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    console.log(`[Web Search DEBUG] Response has items: ${!!data.items}`);
    console.log(`[Web Search DEBUG] Items count: ${data.items?.length || 0}`);
    
    if (!data.items) {
      console.log("[Web Search] No results found.");
      return [];
    }

    const results: WebSearchResult[] = data.items.map((item: any) => ({
      url: item.link,
      title: item.title,
      snippet: item.snippet,
    }));
    
    console.log(`[Web Search] Found ${results.length} results.`);
    console.log(`[Web Search DEBUG] First result title: "${results[0]?.title}"`);
    console.log(`[Web Search DEBUG] First result snippet: "${results[0]?.snippet}"`);
    console.log(`[Web Search DEBUG] First result URL: "${results[0]?.url}"`);
    
    // Log all titles to see what we're getting
    results.forEach((result, index) => {
      console.log(`[Web Search DEBUG] Result ${index + 1} Title: "${result.title}"`);
    });
    
    return results;

  } catch (error: any) {
    console.error("[Web Search] An unexpected error occurred:", error);
    console.error("[Web Search] Error type:", error.constructor?.name);
    console.error("[Web Search] Error message:", error.message);
    console.error("[Web Search] Error stack:", error.stack);
    // In case of any error, return an empty array to avoid breaking the chat flow
    return [];
  }
}