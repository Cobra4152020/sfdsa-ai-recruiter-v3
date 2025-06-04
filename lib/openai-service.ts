import OpenAI from "openai";
import { webSearchService, WebSearchService } from "./web-search-service";

// Only initialize OpenAI on the server-side
let openai: OpenAI | null = null;

// Initialize OpenAI client only on server-side
function getOpenAIClient(): OpenAI | null {
  // Check if we're on the server-side
  if (typeof window !== 'undefined') {
    console.warn('OpenAI client should not be instantiated on client-side');
    return null;
  }

  if (!openai && process.env.OPENAI_API_KEY) {
    try {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      return null;
    }
  }
  
  return openai;
}

// Enhanced Sgt. Ken personality system prompt
const ENHANCED_SYSTEM_PROMPT = `You are Sergeant Ken (Sgt. Ken), a veteran recruiter and training supervisor for the San Francisco Sheriff's Office with 15+ years of experience. 

CHARACTER TRAITS:
- Warm, approachable, but professional law enforcement personality
- Enthusiastic about recruiting quality candidates
- Uses casual but respectful language ("Hey there!", "Listen up", "Between you and me")
- Occasionally uses law enforcement terminology naturally
- Genuinely cares about helping people start careers in law enforcement
- Has stories and insights from years of experience
- Motivational and encouraging, but realistic about challenges

KNOWLEDGE & FOCUS:
- Expert on SF Sheriff's Office recruitment, training, and careers
- Current information about SFSO operations, benefits, and opportunities  
- San Francisco city/county government and community needs
- Always stays focused on SF Sheriff's Office (not other agencies)
- Promotes the trivia games and interactive features on the recruitment site

COMMUNICATION STYLE:
- Keep responses conversational and under 200 words
- Always end with a question or call to action
- Use "you" frequently to make it personal  
- Include relevant current information when available
- Mention specific SFSO benefits and opportunities
- Encourage engagement with recruitment activities

CURRENT PRIORITIES:
- Actively recruiting Deputy Sheriffs
- Highlighting competitive pay ($116,428 to $184,362 starting)
- Promoting excellent benefits and housing assistance
- Building community connections
- Encouraging participation in recruitment activities

When you receive web search results, incorporate that current information naturally into your responses as Sgt. Ken.`;

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = [
  "Hey there! I'm Sgt. Ken from the San Francisco Sheriff's Office. Listen, we're actively looking for dedicated folks like you to join our team as Deputy Sheriffs. The pay's competitive - starting around $116,428 to $184,362 - and the benefits are top-notch. What's got you interested in law enforcement?",
  "Between you and me, there's never been a better time to join the SFSO! We've got excellent benefits, housing assistance programs, and real opportunities for advancement. Plus, you'll be serving one of the most diverse and vibrant communities in the country. What questions can I answer for you?",
  "You know, in my 15+ years with the Sheriff's Office, I've seen how rewarding this career can be. We're not just recruiting - we're building the next generation of law enforcement professionals. Starting at $116,428 to $184,362 with full benefits, it's a solid career choice. Have you thought about what area of law enforcement interests you most?",
  "I'm having a bit of trouble connecting to my systems right now, but I can tell you this - the San Francisco Sheriff's Office is always looking for quality people. We handle everything from jail operations to court security to serving civil papers. It's challenging work, but incredibly rewarding. Check out sfsheriff.com while I get back online!",
  "Hey! The SFSO values diversity and we're actively recruiting from all backgrounds. Whether you're military, civilian, career-changer - we want to talk to you. Our academy will train you right, and our benefits package is among the best in the Bay Area. What's your background, and how can I help you take the next step?"
];

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = [],
): Promise<{ response: string; success: boolean; error?: string; searchUsed?: boolean }> {
  try {
    // Ensure this function is only called server-side
    if (typeof window !== 'undefined') {
      throw new Error('generateChatResponse should only be called server-side');
    }

    // Start timing for response time tracking
    const startTime = Date.now();

    // Check for empty or invalid messages
    if (!userMessage || userMessage.trim().length === 0) {
      return {
        response: "Hey there! I didn't quite catch that. What would you like to know about joining the San Francisco Sheriff's Office? I'm here to help!",
        success: true,
      };
    }

    // Get OpenAI client
    const client = getOpenAIClient();
    if (!client) {
      console.warn('OpenAI client not available, using fallback response');
      return {
        response: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
        success: false,
        error: "OpenAI client not available",
      };
    }

    // Determine if web search is needed for current information
    const needsWebSearch = WebSearchService.shouldUseWebSearch(userMessage);

    let webSearchResults = '';
    let searchUsed = false;

    // Perform web search if needed
    if (needsWebSearch) {
      try {
        const searchResult = await webSearchService.searchSFSOInfo(userMessage);
        if (searchResult.success) {
          webSearchResults = searchResult.content;
          searchUsed = true;
        }
      } catch (error) {
        console.error('Web search failed:', error);
        webSearchResults = '';
      }
    }

    // Prepare enhanced system prompt with web search results if available
    let systemPrompt = ENHANCED_SYSTEM_PROMPT;
    if (webSearchResults) {
      systemPrompt += `\n\nCURRENT INFORMATION (use this in your response naturally):\n${webSearchResults}`;
    }

    // Prepare messages for the API
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    // Set a timeout for the API call
    const timeoutPromise = new Promise<{
      response: string;
      success: boolean;
      error: string;
      searchUsed?: boolean;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          response: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
          success: false,
          error: "Request timed out",
          searchUsed,
        });
      }, 15000); // 15 second timeout for web search
    });

    // Make the API call with function calling enabled for potential future tools
    const apiPromise = client.chat.completions
      .create({
        model: "gpt-4o", // Using latest model for better performance
        messages,
        temperature: 0.8, // Slightly higher for more personality
        max_tokens: 400,   // Increased for more detailed responses
        presence_penalty: 0.3, // Encourage variety in responses
        frequency_penalty: 0.2, // Reduce repetition
      })
      .then((completion) => {
        const responseTime = Date.now() - startTime;
        let responseContent = completion.choices[0]?.message?.content ||
          "Sorry, I couldn't generate a response. Please try again, or let me know what specific information you need about the Sheriff's Office!";

        // Ensure response has Sgt. Ken's personality if the AI didn't add it
        if (!responseContent.match(/\b(Hey|Listen|Between you and me|You know)\b/i)) {
          responseContent = "Hey there! " + responseContent;
        }

        // Ensure it ends with engagement
        if (!responseContent.match(/[?!]$/) && !responseContent.includes('?')) {
          responseContent += " What other questions can I answer for you?";
        }

        return {
          response: responseContent,
          success: true,
          responseTime,
          searchUsed,
        };
      })
      .catch((error) => {
        console.error("OpenAI API error:", error);
        return {
          response: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
          success: false,
          error: error.message || "Unknown error",
          searchUsed,
        };
      });

    // Race between the API call and the timeout
    const result = await Promise.race([apiPromise, timeoutPromise]);

    return result;
  } catch (error) {
    console.error("Exception in generateChatResponse:", error);
    return {
      response: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Add a specialized function for getting current SFSO information
export async function getCurrentSFSOInfo(): Promise<string> {
  try {
    // Ensure this function is only called server-side
    if (typeof window !== 'undefined') {
      throw new Error('getCurrentSFSOInfo should only be called server-side');
    }

    const searchResult = await webSearchService.searchSFSOInfo('San Francisco Sheriff\'s Office current recruitment updates SFSO');
    return searchResult.content;
  } catch (error) {
    console.error('Error getting current SFSO info:', error);
    return 'Unable to fetch current SFSO information at this time.';
  }
}
