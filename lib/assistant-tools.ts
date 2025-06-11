export interface WebSearchResult {
  url: string;
  title: string;
  snippet: string;
}

export async function webSearch(query: string): Promise<WebSearchResult[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  if (!apiKey || !searchEngineId) {
    console.warn(
      "[Web Search] Missing GOOGLE_CUSTOM_SEARCH_API_KEY or GOOGLE_CUSTOM_SEARCH_ENGINE_ID. " +
      "Falling back to mock search. Please provide these environment variables for real web search.",
    );
    // Fallback to mock implementation
    console.log(`[Mock Web Search] Received query: "${query}". Returning no results.`);
    return Promise.resolve([]);
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

  try {
    console.log(`[Real Web Search] Performing search for: "${query}"`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Web Search] API Error:", errorData.error.message);
      throw new Error(`Google Custom Search API request failed: ${errorData.error.message}`);
    }

    const data = await response.json();
    
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
    return results;

  } catch (error) {
    console.error("[Web Search] An unexpected error occurred:", error);
    // In case of any error, return an empty array to avoid breaking the chat flow
    return [];
  }
}