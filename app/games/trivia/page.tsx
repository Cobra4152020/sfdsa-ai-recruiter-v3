"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "SF Trivia Challenge | SF Deputy Sheriff Recruitment",
  description: "Test your knowledge about San Francisco and law enforcement with our interactive trivia game. Earn points and badges while learning!",
}

interface TriviaQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const triviaQuestions: TriviaQuestion[] = [
  {
    question: "When was the San Francisco Sheriff's Department established?",
    options: ["1850", "1875", "1900", "1925"],
    correctAnswer: 0,
    explanation: "The San Francisco Sheriff's Department was established in 1850, making it one of the oldest law enforcement agencies in California."
  },
  {
    question: "Which of these is a primary responsibility of SF Deputy Sheriffs?",
    options: [
      "Traffic enforcement",
      "Court security",
      "Parking violations",
      "Building inspections"
    ],
    correctAnswer: 1,
    explanation: "Court security is one of the primary responsibilities of SF Deputy Sheriffs, ensuring the safety of judicial officers, court staff, and the public."
  },
  {
    question: "What is the minimum age requirement to become an SF Deputy Sheriff?",
    options: ["18 years", "21 years", "25 years", "30 years"],
    correctAnswer: 0,
    explanation: "The minimum age requirement to become an SF Deputy Sheriff is 18 years old at the time of application."
  }
]

export default function TriviaPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gameComplete, setGameComplete] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === triviaQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
      setSelectedAnswer(null)
    } else {
      setGameComplete(true)
    }
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowExplanation(false)
    setSelectedAnswer(null)
    setGameComplete(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0A3C1F] mb-2">SF Trivia Challenge</h1>
        <p className="text-gray-700">Test your knowledge about the San Francisco Sheriff's Department</p>
        <div className="mt-4">
          <Badge variant="secondary" className="text-lg">
            Score: {score}/{triviaQuestions.length}
          </Badge>
        </div>
      </div>

      {!gameComplete ? (
        <Card className="max-w-2xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Question {currentQuestion + 1} of {triviaQuestions.length}
          </h2>
          <p className="text-lg mb-6">{triviaQuestions[currentQuestion].question}</p>

          <div className="space-y-4">
            {triviaQuestions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full justify-start p-4 ${
                  selectedAnswer === null
                    ? "bg-white text-[#0A3C1F] hover:bg-gray-100"
                    : selectedAnswer === index
                    ? index === triviaQuestions[currentQuestion].correctAnswer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : index === triviaQuestions[currentQuestion].correctAnswer
                    ? "bg-green-500 text-white"
                    : "bg-white text-[#0A3C1F]"
                }`}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                {triviaQuestions[currentQuestion].explanation}
              </p>
              <Button
                onClick={nextQuestion}
                className="mt-4 bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90"
              >
                {currentQuestion < triviaQuestions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Game Complete!</h2>
          <p className="text-lg mb-4">
            You scored {score} out of {triviaQuestions.length}!
          </p>
          <p className="text-gray-700 mb-6">
            {score === triviaQuestions.length
              ? "Perfect score! You're well on your way to becoming a Deputy Sheriff!"
              : "Keep learning about the SF Sheriff's Department and try again!"}
          </p>
          <div className="space-x-4">
            <Button
              onClick={restartGame}
              className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90"
            >
              Play Again
            </Button>
            <Button
              asChild
              className="bg-[#FFD700] text-[#0A3C1F] hover:bg-[#FFD700]/90"
            >
              <a href="/application-process">Start Application</a>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
} 