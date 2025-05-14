import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()
    const { message, userId, messageHistory } = body

    // Validate the session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || session.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Format message history for the AI
    const formattedHistory = messageHistory.map((msg: any) => ({
      role: msg.is_user ? "user" : "assistant",
      content: msg.content,
    }))

    // Generate AI response
    const systemPrompt = `
      You are Sgt. Ken, an AI assistant for the San Francisco Deputy Sheriff's Association.
      Your role is to help potential recruits learn about becoming a Deputy Sheriff.
      
      Key information:
      - The minimum requirements are: 21 years old, high school diploma or GED, US citizen or permanent resident alien who is eligible for citizenship
      - The hiring process includes: written test, physical ability test, background check, medical and psychological evaluation
      - The academy is 6 months long, followed by a field training program
      - Starting salary range is $75,000-$95,000 depending on experience and education
      - Benefits include health insurance, retirement plan, paid vacation, and opportunities for advancement
      
      Be friendly, professional, and encouraging. If you don't know the answer to a specific question, 
      suggest that the recruit contact the recruitment office directly at recruitment@sfdsa.org.
      
      Always end your responses with a follow-up question to keep the conversation going.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save the AI response to the database
    const { error: insertError } = await supabase.from("chat_messages").insert({
      user_id: userId,
      content: text,
      is_user: false,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error saving AI response:", insertError)
      return NextResponse.json({ error: "Failed to save response" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
