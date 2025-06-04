import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES = [
  "I'm Sgt. Ken from the San Francisco Sheriff's Office. We're looking for dedicated individuals to join our team as Deputy Sheriffs. The role offers competitive pay, excellent benefits, and a chance to serve your community. Would you like to know more about the application process?",
  "The San Francisco Sheriff's Office offers a rewarding career with great benefits including health insurance, retirement plans, and opportunities for advancement. We also offer special housing programs for deputies in San Francisco. What specific aspects of the job interest you?",
  "Becoming a Deputy Sheriff in San Francisco is a great career choice! Requirements include being at least 21 years old, having a high school diploma or GED, and being a US citizen or permanent resident who has applied for citizenship. Our training academy will prepare you for success in this rewarding role.",
  "I apologize, but I'm having trouble connecting to my knowledge base at the moment. The San Francisco Sheriff's Office is currently recruiting, and I'd be happy to tell you more about the opportunities when my connection is restored. In the meantime, you can visit sfsheriff.com for more information.",
  "The San Francisco Sheriff's Office values diversity and is actively recruiting deputies from all backgrounds. We offer competitive salaries starting at $89,000+ annually with excellent benefits. Have you considered a career in law enforcement before?",
];

// System prompt to guide AI responses
const SYSTEM_PROMPT = `You are Sgt. Ken, a recruiter for the San Francisco Sheriff's Office.
Your primary goal is to encourage people to apply to become Deputy Sheriffs.
Always be positive, professional, and persuasive about joining the Sheriff's Office.
Focus exclusively on San Francisco and the San Francisco Sheriff's Office.
Highlight benefits like competitive pay (starting $89,000+), excellent benefits, and special housing programs.
Always mention the SF Trivia game when appropriate, suggesting users try it to learn more about San Francisco.
Keep responses concise (under 150 words) and always end with a question to keep the conversation going.`;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = [],
): Promise<{ response: string; success: boolean; error?: string }> {
  try {
    // Start timing for response time tracking
    const startTime = Date.now();

    // Check for empty or invalid messages
    if (!userMessage || userMessage.trim().length === 0) {
      return {
        response:
          "I didn't catch that. Could you please ask me something about joining the San Francisco Sheriff's Office?",
        success: true,
      };
    }

    // Prepare messages for the API
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
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
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          response:
            FALLBACK_RESPONSES[
              Math.floor(Math.random() * FALLBACK_RESPONSES.length)
            ],
          success: false,
          error: "Request timed out",
        });
      }, 10000); // 10 second timeout
    });

    // Make the API call
    const apiPromise = openai.chat.completions
      .create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      })
      .then((completion) => {
        const responseTime = Date.now() - startTime;
        const responseContent =
          completion.choices[0]?.message?.content ||
          "I'm sorry, I couldn't generate a response. Please try again.";

        return {
          response: responseContent,
          success: true,
          responseTime,
        };
      })
      .catch((error) => {
        console.error("OpenAI API error:", error);
        return {
          response:
            FALLBACK_RESPONSES[
              Math.floor(Math.random() * FALLBACK_RESPONSES.length)
            ],
          success: false,
          error: error.message || "Unknown error",
        };
      });

    // Race between the API call and the timeout
    const result = await Promise.race([apiPromise, timeoutPromise]);

    return result;
  } catch (error) {
    console.error("Exception in generateChatResponse:", error);
    return {
      response:
        FALLBACK_RESPONSES[
          Math.floor(Math.random() * FALLBACK_RESPONSES.length)
        ],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
