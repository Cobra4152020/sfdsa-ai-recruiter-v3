"use client"

import { useState, useEffect } from "react"
import KahootQuestion from "./kahoot-question"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  image_url?: string
  image_alt?: string
  game_id: string
  difficulty: string
}

interface KahootTriviaGameProps {
  gameId: string
  questionCount?: number
}

export default function KahootTriviaGame({ gameId, questionCount = 10 }: KahootTriviaGameProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [gameComplete, setGameComplete] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // In a real app, this would be an API call to fetch questions for the specific game
        const response = await fetch(`/api/trivia/games/${gameId}/questions?limit=${questionCount}`)
        const data = await response.json()

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
        } else {
          // For demo purposes, generate some sample questions
          const sampleQuestions = generateSampleQuestions(gameId, questionCount)
          setQuestions(sampleQuestions)
        }
      } catch (error) {
        console.error("Error fetching questions:", error)
        // For demo purposes, generate some sample questions
        const sampleQuestions = generateSampleQuestions(gameId, questionCount)
        setQuestions(sampleQuestions)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [gameId, questionCount])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1000) // Basic scoring, could be enhanced with time-based scoring
      setCorrectAnswers(correctAnswers + 1)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Game complete
      setGameComplete(true)
      // In a real app, you would save the score to the database here
      saveGameResults()
    }
  }

  const saveGameResults = async () => {
    // In a real app, this would be an API call to save the game results
    try {
      // Example API call
      // await fetch('/api/trivia/attempts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     game_id: gameId,
      //     score,
      //     correct_answers: correctAnswers,
      //     total_questions: questions.length,
      //   }),
      // })
      console.log("Game results saved:", {
        game_id: gameId,
        score,
        correct_answers: correctAnswers,
        total_questions: questions.length,
      })
    } catch (error) {
      console.error("Error saving game results:", error)
    }
  }

  const restartGame = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setGameComplete(false)
  }

  const goToGameSelection = () => {
    router.push("/trivia")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="text-xl">Loading trivia questions...</p>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">Game Complete!</h1>
        <div className="text-center mb-8">
          <p className="text-2xl mb-2">
            Final Score: <span className="font-bold">{score}</span>
          </p>
          <p className="text-xl">
            You got {correctAnswers} out of {questions.length} questions correct!
          </p>
          <p className="text-xl mt-2">Accuracy: {Math.round((correctAnswers / questions.length) * 100)}%</p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={restartGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
            Play Again
          </Button>
          <Button onClick={goToGameSelection} variant="outline" size="lg">
            Choose Another Game
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900">
      {questions.length > 0 && (
        <KahootQuestion
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          timeLimit={20}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}
    </div>
  )
}

// Helper function to generate sample questions for demo purposes
function generateSampleQuestions(gameId: string, count: number): TriviaQuestion[] {
  const gameTopics: Record<string, { questions: string[]; options: string[][]; answers: number[] }> = {
    "sf-baseball": {
      questions: [
        "Who holds the San Francisco Giants record for most career home runs?",
        "In what year did the Giants move from New York to San Francisco?",
        "Which Giants pitcher threw a perfect game in 2012?",
      ],
      options: [
        ["Willie Mays", "Barry Bonds", "Willie McCovey", "Orlando Cepeda"],
        ["1957", "1958", "1960", "1962"],
        ["Tim Lincecum", "Madison Bumgarner", "Matt Cain", "Barry Zito"],
      ],
      answers: [1, 1, 2],
    },
    "sf-basketball": {
      questions: [
        "Who holds the Golden State Warriors franchise record for most points in a single game?",
        "In what year did the Warriors move from Philadelphia to San Francisco?",
        "Which Warriors player scored 37 points in a single quarter against the Sacramento Kings in 2015?",
      ],
      options: [
        ["Wilt Chamberlain", "Rick Barry", "Stephen Curry", "Klay Thompson"],
        ["1959", "1962", "1965", "1971"],
        ["Stephen Curry", "Klay Thompson", "Draymond Green", "Harrison Barnes"],
      ],
      answers: [0, 1, 1],
    },
    "sf-tourist-spots": {
      questions: [
        "What is the name of the famous prison located on Alcatraz Island?",
        "In what year was the Golden Gate Bridge completed?",
        "What is the name of the famous crooked street in San Francisco?",
      ],
      options: [
        ["San Quentin", "Folsom", "Alcatraz Federal Penitentiary", "Leavenworth"],
        ["1933", "1937", "1941", "1945"],
        ["Market Street", "Lombard Street", "California Street", "Powell Street"],
      ],
      answers: [2, 1, 1],
    },
  }

  // Default to tourist spots if game ID not found
  const topic = gameTopics[gameId] || gameTopics["sf-tourist-spots"]

  // Generate sample questions based on the topic
  return Array.from({ length: Math.min(count, topic.questions.length) }).map((_, i) => ({
    id: `sample-${i}`,
    question: topic.questions[i],
    options: topic.options[i],
    correct_answer: topic.answers[i],
    game_id: gameId,
    difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)],
  }))
}
