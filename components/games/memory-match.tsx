"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Loader2, RefreshCw, Clock, Trophy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { GameShare } from "@/components/game-share"
import { addParticipationPoints } from "@/lib/points-service"
import { useUser } from "@/context/user-context"
import confetti from "canvas-confetti"

// Card icons
const CARD_ICONS = ["🚓", "🔫", "🛡️", "📝", "🚨", "🏛️", "⚖️", "🔍", "👮", "📋", "🔐", "🏆", "📱", "💻", "🔦", "🧠"]

interface CardProps {
  id: number
  icon: string
  isFlipped: boolean
  isMatched: boolean
}

export function MemoryMatch() {
  const [cards, setCards] = useState<CardProps[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameActive, setGameActive] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const { toast } = useToast()
  const { user, isLoggedIn } = useUser()

  // Initialize game cards
  const initializeGame = useCallback(() => {
    // Select 8 random icons
    const shuffledIcons = [...CARD_ICONS].sort(() => 0.5 - Math.random()).slice(0, 8)

    // Create pairs
    const cardPairs = [...shuffledIcons, ...shuffledIcons]

    // Shuffle all cards
    const shuffledCards = cardPairs.sort(() => 0.5 - Math.random())

    // Create card objects
    const newCards = shuffledCards.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }))

    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimeElapsed(0)
    setScore(0)
    setGameActive(true)
    setGameOver(false)
  }, [])

  // Handle card click
  const handleCardClick = (cardId: number) => {
    // Prevent actions if game is not active or already processing
    if (!gameActive || isProcessing) return

    // Prevent clicking the same card or matched cards
    const clickedCard = cards.find((card) => card.id === cardId)
    if (!clickedCard || clickedCard.isMatched || flippedCards.includes(cardId)) return

    // Flip the card
    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update the cards state
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      setMoves((prevMoves) => prevMoves + 1)
      setIsProcessing(true)

      // Check if the cards match
      if (firstCard?.icon === secondCard?.icon) {
        setMatchedPairs((prevMatched) => prevMatched + 1)
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card,
          ),
        )
        setFlippedCards([])
        setIsProcessing(false)

        // Add points for matching
        setScore((prevScore) => prevScore + 10)

        // Check if all pairs are matched
        if (matchedPairs + 1 === 8) {
          endGame()
        }
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
          setIsProcessing(false)
        }, 1000)
      }
    }
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameActive && !gameOver) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [gameActive, gameOver])

  // Calculate score
  useEffect(() => {
    if (gameActive && !gameOver) {
      // Base score from matched pairs
      const baseScore = matchedPairs * 10

      // Time penalty (lose points as time increases)
      const timePenalty = Math.floor(timeElapsed / 5)

      // Move penalty (lose points for excessive moves)
      const movePenalty = Math.max(0, moves - matchedPairs * 2) * 2

      // Calculate final score
      const calculatedScore = Math.max(0, baseScore - timePenalty - movePenalty)

      setScore(calculatedScore)
    }
  }, [matchedPairs, timeElapsed, moves, gameActive, gameOver])

  // End game
  const endGame = useCallback(() => {
    setGameActive(false)
    setGameOver(true)

    // Trigger confetti for completing the game
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
    })

    // Calculate final score with completion bonus
    const finalScore = score + 50 // Bonus for completing
    setScore(finalScore)

    toast({
      title: "Game Complete!",
      description: `You matched all pairs with a score of ${finalScore}!`,
      duration: 3000,
    })

    // Add points to user account if logged in
    if (isLoggedIn && user?.id) {
      const gamePoints = Math.floor(finalScore / 2) // Convert game score to participation points
      addParticipationPoints(user.id, gamePoints, "memory_game", `Scored ${finalScore} in Memory Match game`)

      toast({
        title: "Points Added!",
        description: `You earned ${gamePoints} participation points!`,
        duration: 3000,
      })
    }
  }, [score, toast, isLoggedIn, user])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle points added from sharing
  const handlePointsAdded = (points: number) => {
    toast({
      title: "Points Added!",
      description: `You earned ${points} participation points for sharing!`,
      duration: 3000,
    })
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg py-2 border-[#0A3C1F] text-[#0A3C1F]">
            <Trophy className="mr-1 h-4 w-4" />
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-lg py-2 border-[#0A3C1F] text-[#0A3C1F]">
            <Clock className="mr-1 h-4 w-4" />
            Time: {formatTime(timeElapsed)}
          </Badge>
        </div>
        <div>
          {!gameActive && !gameOver && (
            <Button onClick={initializeGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              Start Game
            </Button>
          )}
          {!gameActive && gameOver && (
            <div className="flex gap-2">
              <Button onClick={initializeGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                Play Again
              </Button>
              <GameShare
                score={score}
                gameName="Memory Match Deluxe"
                gameDescription="Match all card pairs"
                onPointsAdded={handlePointsAdded}
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={!gameActive || card.isMatched || isProcessing}
            className={`
              aspect-square flex items-center justify-center text-3xl
              rounded-lg shadow transition-all duration-300 transform
              ${
                card.isFlipped || card.isMatched
                  ? "bg-white rotate-y-180"
                  : "bg-[#0A3C1F] text-transparent hover:bg-[#0A3C1F]/90"
              }
              ${card.isMatched ? "opacity-60" : "opacity-100"}
              ${gameActive ? "cursor-pointer" : "cursor-default"}
            `}
            aria-label={card.isFlipped || card.isMatched ? `Card ${card.icon}` : "Hidden card"}
          >
            {card.isFlipped || card.isMatched ? card.icon : "?"}
          </button>
        ))}
      </div>

      {/* Game Info */}
      <div className="flex justify-between text-sm">
        <div>Pairs: {matchedPairs}/8</div>
        <div>Moves: {moves}</div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <Card className="p-4 border-t-4 border-t-[#0A3C1F] bg-[#0A3C1F]/5">
          <h3 className="text-xl font-bold text-center mb-2">Game Complete!</h3>
          <p className="text-center mb-1">
            You scored <span className="font-bold text-[#0A3C1F]">{score} points</span>
          </p>
          <p className="text-center mb-4 text-sm">
            Time: {formatTime(timeElapsed)} | Moves: {moves}
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={initializeGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <GameShare
              score={score}
              gameName="Memory Match Deluxe"
              gameDescription="Match all card pairs"
              onPointsAdded={handlePointsAdded}
            />
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-10 pointer-events-none">
          <Loader2 className="animate-spin h-8 w-8 text-[#0A3C1F]" />
        </div>
      )}

      {/* Instructions */}
      {!gameActive && !gameOver && (
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-1">How to Play:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Flip cards to find matching pairs</li>
            <li>Remember card positions to make matches efficiently</li>
            <li>Match all 8 pairs to complete the game</li>
            <li>Faster completion with fewer moves earns more points</li>
            <li>Share your score to earn bonus participation points!</li>
          </ol>
        </div>
      )}
    </div>
  )
}
