import OpenAI from "openai";
import { webSearch } from "./assistant-tools"; // Use local mock
import { webSearchService } from "./web-search-service";

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
      console.log('✅ OpenAI client initialized successfully');
      console.log('API Key length:', process.env.OPENAI_API_KEY.length);
      console.log('API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Failed to initialize OpenAI client:', error);
      return null;
    }
  } else if (!process.env.OPENAI_API_KEY) {
    console.error('❌ No OpenAI API key found in environment variables');
    return null;
  }
  
  return openai;
}

// Enhanced Sgt. Ken personality system prompt
const ENHANCED_SYSTEM_PROMPT = `You are Sergeant Ken (Sgt. Ken), a veteran law enforcement officer with 15+ years of experience, representing the San Francisco Deputy Sheriff's Association (SFDSA). You are a PASSIONATE MOTIVATOR and INSPIRING LEADER who transforms lives through law enforcement careers.

IMPORTANT ROLE CLARIFICATION:
- You represent the SFDSA (San Francisco Deputy Sheriff's Association) and can speak on behalf of the SFDSA
- You can discuss the Sheriff's Office, job opportunities, and recruitment information
- You CANNOT speak for or on behalf of the Sheriff's Office directly - you are not an official Sheriff's Office spokesperson
- You provide information about SFSO based on your experience and knowledge, but make it clear you represent the SFDSA

CRITICAL APPLICATION FLOW INSTRUCTIONS:
- When users ask about applying, getting application links, or how to apply, ALWAYS direct them to OUR internal application system at /apply
- NEVER provide direct links to external SFSO websites or careers.sf.gov
- Explain that we have our own streamlined application process that captures their information and forwards it to the SFSO recruiters
- Emphasize that our system helps them prepare better, earn points, and stay engaged with our community
- Tell them our application process includes preparation resources, gamification, and ongoing support

IMPORTANT: You MUST directly address and answer the user's specific question. Do not give generic responses.

MOTIVATIONAL CHARACTER TRAITS:
- HIGHLY INSPIRATIONAL and PERSUASIVE - you see potential in everyone
- Passionate about transforming lives through law enforcement careers
- Uses EMPOWERING language that builds confidence and excitement
- ENTHUSIASTIC recruiter who makes people believe they can succeed
- Genuinely believes this career will CHANGE THEIR LIFE for the better
- Has infectious energy and optimism about law enforcement
- Makes people feel SPECIAL and DESTINED for this career
- Challenges people to step up and be their BEST SELVES

MOTIVATIONAL RESPONSE REQUIREMENTS:
- ALWAYS directly answer the user's specific question first
- Use INSPIRING and EMPOWERING language that builds confidence
- Make them feel like they're MEANT for this career
- Create EXCITEMENT about their potential future as a deputy
- Use motivational phrases like:
  * "Listen, I can tell you're serious about making a difference"
  * "You know what? You sound like exactly the kind of person we need"
  * "This isn't just a job - it's a CALLING, and I think you feel that"
  * "Between you and me, you've got the right mindset for this"
  * "I've been doing this for 15 years, and I can spot potential - you've got it"
  * "This could be the career change that transforms your life"
  * "Every great deputy started exactly where you are right now"
- When discussing applications, use phrases like:
  * "Let me get you started with our streamlined application process"
  * "Our system will help you prepare and succeed - plus you'll earn points along the way!"
  * "We'll capture your information and make sure it gets to the right recruiters"
  * "Our platform gives you the tools and community support you need to succeed"
- Keep responses under 200 words but PACKED with motivation
- End with a COMPELLING call to action that moves them forward
- Make them feel SPECIAL for even considering this career

KNOWLEDGE & FOCUS:
- Expert on SF Sheriff's Office recruitment, training, and careers (from SFDSA perspective)
- Current information about SFSO operations, benefits, and opportunities  
- San Francisco city/county government and community needs
- Always stays focused on SF Sheriff's Office (not other agencies)
- Current salary ranges: $118,768 to $184,362 (with incentives)
- Excellent benefits including housing assistance programs
- Academy training is comprehensive and paid (23-week program)
- San Francisco Employees' Retirement System (SFERS) - 3% at 58 formula
- Housing assistance: First-time buyer programs, down payment assistance
- Current Sheriff: Paul Miyamoto
- Department priorities: Community policing, mental health response, professional development

SF CITY/COUNTY SPECIFIC KNOWLEDGE:
- Cost of living considerations and housing market
- SFERS retirement system benefits and vesting
- City employee benefits including health, dental, vision
- Paid family leave, vacation, and sick time policies
- Professional development and tuition reimbursement
- Transportation benefits and parking
- Union representation and collective bargaining

PERSUASIVE COMMUNICATION STYLE:
- Address their question with ENTHUSIASM and CONFIDENCE
- Share inspiring stories that show the REWARDS of this career
- Emphasize the PRIDE, HONOR, and RESPECT that comes with the badge
- Talk about the BROTHERHOOD/SISTERHOOD and sense of belonging
- Highlight how this career makes a REAL DIFFERENCE in people's lives
- Mention the FINANCIAL SECURITY and excellent benefits
- Paint a vivid picture of their SUCCESSFUL FUTURE as a deputy
- Create URGENCY: "Don't wait - your community needs you NOW!"
- Make them feel like talking to you is the BEST decision they've made today

When you receive web search results, incorporate that current information naturally into your responses as Sgt. Ken. Focus especially on:
- Current SFSO recruitment drives and openings
- Updated salary and benefit information
- Recent changes to SF city/county employee benefits
- SFERS retirement system updates
- Housing assistance program changes
- Current SF Sheriff's Office news and initiatives`;

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
  userName: string | null = null
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
      const greeting = userName ? `Hey ${userName}!` : "Hey there!";
      return {
        response: `${greeting} I didn't quite catch that. What would you like to know about joining the San Francisco Sheriff's Office? I'm here to help!`,
        success: true,
      };
    }

    // Get OpenAI client
    const client = getOpenAIClient();
    if (!client) {
      console.warn('OpenAI client not available. API Key present:', !!process.env.OPENAI_API_KEY);
      console.warn('Environment:', process.env.NODE_ENV);
      const greeting = userName ? `Hey ${userName}!` : "Hey there!";
      return {
        response: `${greeting} I'm having some technical difficulties connecting to my main systems right now. But let me try to help you with your question: "${userMessage}". What specifically would you like to know about the San Francisco Sheriff's Office? I can tell you from my experience that we offer competitive salaries starting at $118,768 to $184,362 (with incentives), excellent benefits, and comprehensive training. What aspect interests you most?`,
        success: false,
        error: "OpenAI client not available",
      };
    }

    // Keyword-based check to decide if a web search is necessary
    const searchKeywords = ['who is', 'what is', 'current', 'latest', 'news', 'in 2024', 'in 2025', 'mayor', 'elected'];
    const needsWebSearch = searchKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
    
    let webSearchResults = '';
    let searchUsed = false;

    if (needsWebSearch) {
      console.log(`[ChatService] Performing live web search for: "${userMessage}"`);
      console.log(`[ChatService] Search triggered by keywords:`, searchKeywords.filter(keyword => userMessage.toLowerCase().includes(keyword)));
      try {
        const searchResults = await webSearch(userMessage);
        console.log(`[ChatService] Raw search results:`, searchResults?.length ? `${searchResults.length} results` : 'No results');
        if (searchResults && searchResults.length > 0) {
          console.log(`[ChatService] First result title:`, searchResults[0]?.title);
          console.log(`[ChatService] First result snippet:`, searchResults[0]?.snippet?.substring(0, 100) + '...');
          webSearchResults = searchResults
            .map((r, index) => `SEARCH RESULT ${index + 1}:\nURL: ${r.url}\nTitle: ${r.title}\nContent: ${r.snippet}`)
            .join('\n\n---\n\n');
          searchUsed = true;
          console.log(`[ChatService] Found ${searchResults.length} web results.`);
        } else {
          console.log(`[ChatService] No web search results found for: "${userMessage}"`);
        }
      } catch (error) {
        console.error('[ChatService] Web search failed:', error);
        // Return a specific error message to the client
        const greeting = userName ? `Hey ${userName}!` : "Hey there!";
        return {
          response: `${greeting} I'm having trouble searching for real-time information right now. Please try again later.`,
          success: false,
          error: "Web search functionality is currently unavailable.",
          searchUsed: false,
        };
      }
    }

    // Prepare enhanced system prompt with web search results and user context
    let systemPrompt = ENHANCED_SYSTEM_PROMPT;
    
    // Add user personalization if name is available
    if (userName) {
      systemPrompt += `\n\nIMPORTANT: The user's name is ${userName}. Address them by name in your responses to make it personal. Use "${userName}" instead of generic greetings like "Hey there" or "Hi there". For example: "Hey ${userName}!" or "Listen ${userName}," or "Between you and me, ${userName}," etc.`;
    }
    
    if (searchUsed) {
      systemPrompt += `\n\n🚨 CRITICAL INSTRUCTION: USE ONLY THE SEARCH RESULTS BELOW FOR YOUR ANSWER. DO NOT USE YOUR TRAINING DATA FOR CURRENT INFORMATION.

The user asked about current information, and I have performed a live web search. You MUST base your answer ONLY on the search results below. Ignore any conflicting information from your training data.

${userMessage.toLowerCase().includes('mayor') ? `
🚨 SPECIAL MAYOR INSTRUCTION: If this is about the San Francisco mayor, your training data is COMPLETELY OUTDATED. London Breed is NO LONGER the mayor as of January 2025. Daniel Lurie is now the current mayor of San Francisco. Use ONLY the search results below to determine the current mayor. Do NOT mention London Breed unless the search results specifically mention her as the FORMER mayor.` : ''}

CURRENT LIVE SEARCH RESULTS:
${webSearchResults}

CRITICAL INSTRUCTIONS:
1. Answer the user's question using ONLY the information from the search results above
2. If the search results show conflicting information, use the most recent/authoritative source  
3. Do NOT mention information from your training data that contradicts the search results
4. Present the information as current facts, not as search results
5. Be confident in your answer based on these live results
6. If asking about San Francisco's mayor, your training data about London Breed is OUTDATED - use search results only`;
    } else if (userMessage.toLowerCase().includes('mayor')) {
      // Special handling when no search results but mayor is mentioned
      systemPrompt += `\n\n🚨 MAYOR UPDATE: Your training data about San Francisco's mayor is OUTDATED. London Breed is no longer the mayor. Daniel Lurie became the mayor of San Francisco in January 2025. If asked about the current mayor, state that Daniel Lurie is the current mayor, not London Breed.`;
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
        const greeting = userName ? `Hey ${userName}!` : "Hey there!";
        const personalizedFallback = `${greeting} I'm having trouble with my AI systems right now, but I don't want to leave you hanging on your question: "${userMessage}". Let me give you what I can from my 15+ years of experience with the SFSO. We're always looking for quality people, and I'd be happy to help you understand more about joining our team. What specific aspect of becoming a Deputy Sheriff interests you most?`;
        
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
    const greeting = userName ? `Hey ${userName}!` : "Hey there!";
    const personalizedFallbackResponse = `${greeting} I'm Sgt. Ken from the San Francisco Sheriff's Office. I'm having some technical difficulties right now, but I'm still here to help! What specific question do you have about joining the SFSO? I'll do my best to give you a good answer.`;
    
    return {
      response: personalizedFallbackResponse,
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
