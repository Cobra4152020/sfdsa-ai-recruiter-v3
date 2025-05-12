"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Volume2, VolumeX, MoreVertical } from "lucide-react"

// Define the colors for Kahoot-style answer options
const COLORS = {
  red: "bg-red-500 hover:bg-red-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  green: "bg-green-500 hover:bg-green-600",
}

// Define the option shapes
const SHAPES = ["triangle", "diamond", "circle", "square"]

interface KahootQuestionProps {
  question: {
    id: string
    question: string
    options: string[]
    correct_answer: number
    image_url?: string
    image_alt?: string
    game_id: string
    difficulty: string
  }
  onAnswer: (isCorrect: boolean) => void
  timeLimit?: number
  currentQuestion: number
  totalQuestions: number
}

export default function KahootQuestion({
  question,
  onAnswer,
  timeLimit = 20,
  currentQuestion,
  totalQuestions,
}: KahootQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isMuted, setIsMuted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null)
  const tickingSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      backgroundMusicRef.current = new Audio("/sounds/kahoot-lobby.mp3")
      backgroundMusicRef.current.loop = true
      backgroundMusicRef.current.volume = 0.3

      correctSoundRef.current = new Audio("/sounds/correct-answer.mp3")
      incorrectSoundRef.current = new Audio("/sounds/incorrect-answer.mp3")
      tickingSoundRef.current = new Audio("/sounds/countdown-tick.mp3")
      tickingSoundRef.current.loop = true
      tickingSoundRef.current.volume = 0.2

      if (!isMuted) {
        backgroundMusicRef.current.play().catch((e) => console.log("Audio play failed:", e))
        tickingSoundRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }

      return () => {
        backgroundMusicRef.current?.pause()
        tickingSoundRef.current?.pause()
        correctSoundRef.current?.pause()
        incorrectSoundRef.current?.pause()
      }
    }
  }, [])

  // Update mute state for all audio elements
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted
    }
    if (tickingSoundRef.current) {
      tickingSoundRef.current.muted = isMuted
    }
    if (correctSoundRef.current) {
      correctSoundRef.current.muted = isMuted
    }
    if (incorrectSoundRef.current) {
      incorrectSoundRef.current.muted = isMuted
    }
  }, [isMuted])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !selectedOption) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !selectedOption) {
      handleAnswer(-1) // Time's up, no selection
    }
  }, [timeLeft, selectedOption])

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return // Prevent multiple selections

    setSelectedOption(index)
    const correct = index === question.correct_answer
    setIsCorrect(correct)
    setShowFeedback(true)

    // Play appropriate sound
    if (!isMuted) {
      if (correct) {
        correctSoundRef.current?.play()
      } else {
        incorrectSoundRef.current?.play()
      }
      tickingSoundRef.current?.pause()
    }

    // Delay to show feedback before moving to next question
    setTimeout(() => {
      onAnswer(correct)
      setShowFeedback(false)
      setSelectedOption(null)
      setTimeLeft(timeLimit)
    }, 2000)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Calculate points based on time left (Kahoot style)
  const calculatePoints = () => {
    if (!isCorrect) return 0
    return Math.round(1000 * (timeLeft / timeLimit))
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Top bar with progress and controls */}
      <div className="flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          {currentQuestion}/{totalQuestions}
        </div>
        <div className="flex-1 mx-4">
          <div className="flex space-x-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={cn("h-1 flex-1 rounded-full", i < currentQuestion ? "bg-white" : "bg-gray-600")}
              />
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={toggleMute} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Timer */}
      <Progress value={(timeLeft / timeLimit) * 100} className="h-2" />

      {/* Question image */}
      <div className="relative w-full h-64 my-4">
        {question.image_url ? (
          <Image
            src={question.image_url || "/placeholder.svg"}
            alt={question.image_alt || "Question image"}
            fill
            className="object-contain"
          />
        ) : (
          <Image
            src={`/san-francisco-cityscape.png?height=300&width=500&query=San Francisco ${question.game_id.replace("sf-", "")}`}
            alt="Question image placeholder"
            fill
            className="object-contain"
          />
        )}
      </div>

      {/* Question text */}
      <Card className="mx-4 p-6 bg-gray-200 text-gray-900 mb-4">
        <h2 className="text-xl font-bold text-center">{question.question}</h2>
      </Card>

      {/* Answer options in colored boxes */}
      <div className="grid grid-cols-2 gap-4 p-4 mt-auto">
        {question.options.map((option, index) => {
          const colorKey = Object.keys(COLORS)[index % 4] as keyof typeof COLORS
          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedOption !== null}
              className={cn(
                "p-6 rounded-lg text-white font-bold text-center text-xl shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center min-h-[120px]",
                COLORS[colorKey],
                selectedOption === index && "ring-4 ring-white",
                showFeedback && index === question.correct_answer && "ring-4 ring-white",
              )}
            >
              <span className="mb-2">{option}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className={cn("text-5xl font-bold mb-4", isCorrect ? "text-green-400" : "text-red-400")}>
              {isCorrect ? "CORRECT!" : "INCORRECT!"}
            </h2>
            {isCorrect && <p className="text-3xl text-white">+{calculatePoints()} points</p>}
          </div>
        </div>
      )}
    </div>
  )
}
