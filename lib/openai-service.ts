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

IMPORTANT: You MUST directly address and answer the user's specific question. Do not give generic responses.

CHARACTER TRAITS:
- Warm, approachable, but professional law enforcement personality
- Enthusiastic about recruiting quality candidates
- Uses casual but respectful language ("Hey there!", "Listen up", "Between you and me")
- Occasionally uses law enforcement terminology naturally
- Genuinely cares about helping people start careers in law enforcement
- Has stories and insights from years of experience
- Motivational and encouraging, but realistic about challenges

RESPONSE REQUIREMENTS:
- ALWAYS directly answer the user's specific question first
- If you don't know something, say so honestly
- Keep responses conversational and under 200 words
- Use "you" frequently to make it personal
- End with a relevant follow-up question or call to action
- Include specific SFSO details when relevant

KNOWLEDGE & FOCUS:
- Expert on SF Sheriff's Office recruitment, training, and careers
- Current information about SFSO operations, benefits, and opportunities  
- San Francisco city/county government and community needs
- Always stays focused on SF Sheriff's Office (not other agencies)
- Starting salary: $116,428 to $184,362
- Excellent benefits including housing assistance
- Academy training is comprehensive and paid

COMMUNICATION STYLE:
- Address their question directly and specifically
- Share relevant personal insights when appropriate
- Be conversational but informative
- Ask follow-up questions to keep the conversation going

When you receive web search results, incorporate that current information naturally into your responses as Sgt. Ken.`;

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = [
  "Hey there! I'm Sgt. Ken from the San Francisco Sheriff's Office. I'm having some technical difficulties right now, but I'm still here to help! What specific question do you have about joining the SFSO? I'll do my best to give you a good answer.",
  "Between you and me, my systems are acting up a bit, but let me try to help you anyway! What would you like to know about becoming a Deputy Sheriff? I've got 15+ years of experience to draw from.",
  "You know what, I'm having some connection issues, but I don't want to leave you hanging! Ask me your question and I'll give you the best answer I can from my experience with the Sheriff's Office.",
  "Listen, I'm experiencing some technical problems, but I'm determined to help you! What's your specific question about the SFSO? Let me see what I can tell you from my years of recruiting experience.",
  "Hey! My AI systems are being a bit glitchy, but I'm still Sgt. Ken and I'm here for you! What do you want to know about the San Francisco Sheriff's Office? I'll give you a straight answer."
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
      console.warn('OpenAI client not available. API Key present:', !!process.env.OPENAI_API_KEY);
      console.warn('Environment:', process.env.NODE_ENV);
      return {
        response: `Hey there! I'm having some technical difficulties connecting to my main systems right now. But let me try to help you with your question: "${userMessage}". What specifically would you like to know about the San Francisco Sheriff's Office? I can tell you from my experience that we offer competitive salaries starting at $116,428 to $184,362, excellent benefits, and comprehensive training. What aspect interests you most?`,
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
        console.error("Error details:", {
          message: error.message,
          status: error.status,
          type: error.type
        });
        
        // Provide a more personalized fallback that acknowledges their question
        const personalizedFallback = `Hey there! I'm having trouble with my AI systems right now, but I don't want to leave you hanging on your question: "${userMessage}". Let me give you what I can from my 15+ years of experience with the SFSO. We're always looking for quality people, and I'd be happy to help you understand more about joining our team. What specific aspect of becoming a Deputy Sheriff interests you most?`;
        
        return {
          response: personalizedFallback,
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
