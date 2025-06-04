export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { type NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { generateChatResponse } from "@/lib/openai-service";
import { generateResponse } from "@/lib/sgt-ken-knowledge-base";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userId, sessionId, chatHistory, searchUsed } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    let responseText: string;
    let actualSearchUsed = false;

    // Try enhanced OpenAI service first
    try {
      const result = await generateChatResponse(message, chatHistory || []);
      responseText = result.response;
      actualSearchUsed = result.searchUsed || false;
    } catch (error) {
      console.error("OpenAI service error, falling back to knowledge base:", error);
      // Fallback to local knowledge base
      responseText = `Hey there! ${generateResponse(message)}`;
      actualSearchUsed = false;
    }

    // Log the interaction to the database (but don't fail if this fails)
    try {
      // Directly check and use environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        // Create Supabase client directly with the environment variables
        const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

        // Log the interaction with enhanced metadata
        await supabase.from("chat_interactions").insert({
          user_id: userId || null,
          message,
          response: responseText,
          session_id: sessionId || uuidv4(),
          search_used: actualSearchUsed,
          created_at: new Date().toISOString(),
        });

        // Award participation points if user is logged in
        if (userId) {
          try {
            const basePoints = 5;
            const bonusPoints = actualSearchUsed ? 2 : 0; // Bonus for current info
            const totalPoints = basePoints + bonusPoints;

            await supabase.rpc("add_participation_points", {
              user_id_param: userId,
              points_param: totalPoints,
              activity_type_param: "chat_interaction",
              description_param: actualSearchUsed 
                ? "Interacted with Sgt. Ken AI (with current info)" 
                : "Interacted with Sgt. Ken AI",
            });
          } catch (pointsError) {
            console.error("Error awarding participation points:", pointsError);
            // Continue even if points award fails
          }
        }
      } else {
        console.warn(
          "Skipping chat interaction logging due to missing environment variables",
        );
      }
    } catch (dbError) {
      console.error("Database error (non-fatal):", dbError);
      // Continue even if database operations fail
    }

    // Return the response with enhanced metadata
    return NextResponse.json({
      message: responseText,
      success: true,
      searchUsed: actualSearchUsed,
    });
  } catch (error) {
    console.error("Error in chat API route:", error);

    // Generate a fallback response even if there's an error
    let fallbackResponse =
      "Hey there! I'm having trouble processing your request right now, but I'm still here to help! ";
    fallbackResponse +=
      "The San Francisco Sheriff's Department offers rewarding careers with competitive salaries starting at $116,428 to $184,362, excellent benefits, and opportunities for advancement. ";
    fallbackResponse +=
      "Please try asking your question again, or check out sfsheriff.com for more information. What can I help you with?";

    // Return a fallback response
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        message: fallbackResponse,
        success: false,
        offline: true,
        searchUsed: false,
      },
      { status: 200 }, // Return 200 even for errors to prevent client-side error handling
    );
  }
}
