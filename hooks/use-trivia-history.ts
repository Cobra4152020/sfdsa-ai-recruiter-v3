"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { supabase } from "@/lib/supabase-client"

export interface TriviaGameHistory {
  gameId: string
  bestScore: number
  totalQuestions: number
  lastPlayed: string
  timesPlayed: number
}

export function useTriviaHistory() {
  const { currentUser, isLoggedIn } = useUser()
  const [gameHistory, setGameHistory] = useState<Record<string, TriviaGameHistory>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGameHistory() {
      if (!isLoggedIn || !currentUser) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("trivia_game_results")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        // Process the data to get the best score for each game
        const historyMap: Record<string, TriviaGameHistory> = {}

        data.forEach((result) => {
          const gameId = result.game_id

          if (!historyMap[gameId]) {
            historyMap[gameId] = {
              gameId,
              bestScore: result.score,
              totalQuestions: result.total_questions,
              lastPlayed: result.created_at,
              timesPlayed: 1,
            }
          } else {
            // Update best score if this result is better
            if (result.score > historyMap[gameId].bestScore) {
              historyMap[gameId].bestScore = result.score
            }

            // Update last played if this result is more recent
            if (new Date(result.created_at) > new Date(historyMap[gameId].lastPlayed)) {
              historyMap[gameId].lastPlayed = result.created_at
            }

            // Increment times played
            historyMap[gameId].timesPlayed += 1
          }
        })

        setGameHistory(historyMap)
      } catch (err) {
        console.error("Error fetching trivia game history:", err)
        setError("Failed to load your game history. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGameHistory()
  }, [currentUser, isLoggedIn])

  return { gameHistory, isLoading, error }
}
