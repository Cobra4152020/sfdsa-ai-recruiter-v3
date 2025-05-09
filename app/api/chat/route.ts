import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateResponse } from "@/lib/sgt-ken-knowledge-base"
import { v4 as uuidv4 } from "uuid"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { message, userId, sessionId } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate a detailed, contextually relevant response using our knowledge base
    const responseText = generateResponse(message)

    // Log the interaction to the database (but don't fail if this fails)
    try {
      // Directly check and use environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        // Create Supabase client directly with the environment variables
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Log the interaction
        await supabase.from("chat_interactions").insert({
          user_id: userId || null,
          message,
          response: responseText,
          session_id: sessionId || uuidv4(),
          created_at: new Date().toISOString(),
        })

        // Award participation points if user is logged in
        if (userId) {
          try {
            await supabase.rpc("add_participation_points", {
              user_id_param: userId,
              points_param: 5,
              activity_type_param: "chat_interaction",
              description_param: "Interacted with Sgt. Ken AI",
            })
          } catch (pointsError) {
            console.error("Error awarding participation points:", pointsError)
            // Continue even if points award fails
          }
        }
      } else {
        console.warn("Skipping chat interaction logging due to missing environment variables")
      }
    } catch (dbError) {
      console.error("Database error (non-fatal):", dbError)
      // Continue even if database operations fail
    }

    // Return the response
    return NextResponse.json({
      message: responseText,
      success: true,
    })
  } catch (error) {
    console.error("Error in chat API route:", error)

    // Generate a fallback response even if there's an error
    let fallbackResponse = "I apologize, but I'm having trouble processing your request right now. "
    fallbackResponse +=
      "The San Francisco Sheriff's Department offers rewarding careers with competitive salaries, excellent benefits, and opportunities for advancement. "
    fallbackResponse += "Please try asking your question again, or visit sfsheriff.com for more information."

    // Return a fallback response
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        message: fallbackResponse,
        success: false,
        offline: true,
      },
      { status: 200 }, // Return 200 even for errors to prevent client-side error handling
    )
  }
}
