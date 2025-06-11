export const dynamic = "force-dynamic";

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

    console.log('🔍 Chat API called with message:', message?.substring(0, 50) + '...');
    console.log('🔍 OpenAI API Key available:', !!process.env.OPENAI_API_KEY);
    console.log('🔍 Environment:', process.env.NODE_ENV);

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
      console.log('🤖 Attempting OpenAI API call...');
      const result = await generateChatResponse(message, chatHistory || []);
      responseText = result.response;
      actualSearchUsed = result.searchUsed || false;
      
      if (result.success) {
        console.log('✅ OpenAI API call successful');
      } else {
        console.log('⚠️ OpenAI API call failed, using fallback');
      }
    } catch (error) {
      console.error("❌ OpenAI service error, falling back to knowledge base:", error);
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

        // Award participation points if user is logged in (enhanced system)
        if (userId) {
          try {
            // Use the correct URL for development vs production
            const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_URL;
            const pointsUrl = `${baseUrl}/api/user/points-unified`;
            console.log('🔧 Attempting to call unified API at:', pointsUrl);
            console.log('🔧 Environment:', process.env.NODE_ENV);
            
            const pointsPayload = {
              userId,
              pointsToAdd: actualSearchUsed ? 7 : 5, // Bonus for current info
              action: 'chat_participation',
              description: `Chatted with Sgt. Ken${actualSearchUsed ? ' (with current info bonus)' : ''}`
            };
            console.log('🔧 Points payload:', pointsPayload);

            const pointsResponse = await fetch(pointsUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(pointsPayload),
            });

            console.log('🔧 Points response status:', pointsResponse.status);
            console.log('🔧 Points response ok:', pointsResponse.ok);

            if (!pointsResponse.ok) {
              const errorText = await pointsResponse.text();
              console.error('❌ Failed to award chat participation points:', errorText);
            } else {
              const responseData = await pointsResponse.json();
              console.log('✅ Successfully awarded chat points via unified API:', responseData);
            }
          } catch (pointsError) {
            console.error("❌ Error awarding participation points:", pointsError);
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
      pointsAwarded: actualSearchUsed ? 7 : 5,
    });
  } catch (error) {
    console.error("Error in chat API route:", error);

    // Generate a fallback response even if there's an error
    let fallbackResponse =
      "Hey there! I'm having trouble processing your request right now, but I'm still here to help! ";
    fallbackResponse +=
      "The San Francisco Sheriff's Department offers rewarding careers with competitive salaries starting at $118,768 to $184,362 (with incentives), excellent benefits, and opportunities for advancement. ";
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
        pointsAwarded: 0,
      },
      { status: 200 }, // Return 200 even for errors to prevent client-side error handling
    );
  }
}
