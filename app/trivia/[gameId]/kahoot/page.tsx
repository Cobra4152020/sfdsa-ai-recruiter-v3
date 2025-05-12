"use client"

import { useParams } from "next/navigation"
import KahootTriviaGame from "@/components/kahoot-trivia-game"

export default function KahootTriviePage() {
  const params = useParams()
  const gameId = params.gameId as string

  return <KahootTriviaGame gameId={gameId} />
}
