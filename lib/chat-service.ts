import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

// Types for chat interactions
export interface ChatInteraction {
  id?: number
  user_id?: string
  message: string
  response: string
  created_at?: string
  sentiment?: string
  topic?: string
  is_question?: boolean
  session_id?: string
  response_time_ms?: number
  feedback_rating?: number
}

export async function logChatInteraction(interaction: ChatInteraction) {
  try {
    // Directly check and use environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables are missing, skipping chat interaction logging")
      return null
    }

    // Create Supabase client directly with the environment variables
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Ensure we have a session ID for tracking conversation flow
    if (!interaction.session_id) {
      interaction.session_id = uuidv4()
    }

    const { data, error } = await supabase.from("chat_interactions").insert(interaction).select("id").single()

    if (error) {
      console.error("Error logging chat interaction:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("Exception logging chat interaction:", err)
    return null
  }
}

export async function getUserChatHistory(userId: string, limit = 10) {
  try {
    // Directly check and use environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables are missing, skipping chat history fetch")
      return []
    }

    // Create Supabase client directly with the environment variables
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("chat_interactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching chat history:", error)
      return []
    }

    return data
  } catch (err) {
    console.error("Exception fetching chat history:", err)
    return []
  }
}

export async function addChatFeedback(interactionId: number, rating: number) {
  try {
    // Directly check and use environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables are missing, skipping chat feedback")
      return false
    }

    // Create Supabase client directly with the environment variables
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("chat_interactions")
      .update({ feedback_rating: rating })
      .eq("id", interactionId)
      .select("id")
      .single()

    if (error) {
      console.error("Error adding chat feedback:", error)
      return false
    }

    return true
  } catch (err) {
    console.error("Exception adding chat feedback:", err)
    return false
  }
}

export async function getPopularChatTopics(limit = 5) {
  try {
    // Directly check and use environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables are missing, skipping popular topics fetch")
      return []
    }

    // Create Supabase client directly with the environment variables
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from("chat_interactions")
      .select("topic, count(*)")
      .not("topic", "is", null)
      .group("topic")
      .order("count", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching popular topics:", error)
      return []
    }

    return data
  } catch (err) {
    console.error("Exception fetching popular topics:", err)
    return []
  }
}
