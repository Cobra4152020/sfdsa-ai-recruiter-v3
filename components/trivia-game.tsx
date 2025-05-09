"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import {
  Share2,
  Award,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Trophy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ImageIcon,
} from "lucide-react"
import confetti from "canvas-confetti"
import Image from "next/image"

interface TriviaQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  imageUrl?: string
  imageAlt?: string
}

interface BadgeResult {
  id: string
  badge_type: string
  earned_at: string
}

// Fallback questions in case API fails
const FALLBACK_QUESTIONS: TriviaQuestion[] = [
  {
    question: "What year was the Golden Gate Bridge completed?",
    options: ["1927", "1937", "1947", "1957"],
    correctAnswer: 1,
    explanation: "The Golden Gate Bridge was completed in 1937 and opened to the public on May 27 of that year.",
    difficulty: "medium",
    category: "San Francisco Landmarks",
  },
  {
    question: "Which San Francisco neighborhood is known as 'Little Italy'?",
    options: ["Mission District", "North Beach", "Chinatown", "Fisherman's Wharf"],
    correctAnswer: 1,
    explanation: "North Beach is San Francisco's Little Italy, known for its Italian restaurants, cafes, and history.",
    difficulty: "easy",
    category: "San Francisco Neighborhoods",
  },
  {
    question: "What was the name of the famous prison located on Alcatraz Island?",
    options: ["San Quentin", "Folsom", "Alcatraz Federal Penitentiary", "Leavenworth"],
    correctAnswer: 2,
    explanation:
      "Alcatraz Federal Penitentiary operated from 1934 to 1963 and housed notorious criminals like Al Capone.",
    difficulty: "easy",
    category: "San Francisco History",
  },
  {
    question: "In what year did the great San Francisco earthquake and fire occur?",
    options: ["1896", "1906", "1916", "1926"],
    correctAnswer: 1,
    explanation:
      "The devastating earthquake and subsequent fires occurred on April 18, 1906, destroying over 80% of the city.",
    difficulty: "medium",
    category: "San Francisco History",
  },
  {
    question: "Which famous San Francisco street is known for its eight hairpin turns?",
    options: ["Market Street", "Lombard Street", "California Street", "Van Ness Avenue"],
    correctAnswer: 1,
    explanation:
      "Lombard Street between Hyde and Leavenworth Streets is famous for its eight sharp turns and is often called 'the crookedest street in the world.'",
    difficulty: "easy",
    category: "San Francisco Landmarks",
  },
]

export function TriviaGame() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showBadgeDialog, setShowBadgeDialog] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState<BadgeResult | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showMidGameShareDialog, setShowMidGameShareDialog] = useState(false)
  const [pointsAwarded, setPointsAwarded] = useState(0)
  const [hasSharedMidGame, setHasSharedMidGame] = useState(false)
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>({})
  const sharePromptShown = useRef(false)
  const imageRetries = useRef<Record<number, number>>({})
  const [fetchError, setFetchError] = useState<string | null>(null)

  const { currentUser, isLoggedIn } = useUser()
  const { toast } = useToast()

  // Fetch trivia questions
  useEffect(() => {
    fetchQuestions()
  }, [])

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isTimerRunning && timeLeft === 0) {
      // Time's up, auto-submit current answer or mark as incorrect
      handleAnswerSubmit()
    }

    return () => clearTimeout(timer)
  }, [timeLeft, isTimerRunning])

  // Start timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !isGameOver && !isAnswerSubmitted && questions[currentQuestionIndex]) {
      setIsTimerRunning(true)
    }
  }, [questions, currentQuestionIndex, isAnswerSubmitted, isGameOver])

  // Show mid-game share prompt after the second question
  useEffect(() => {
    if (currentQuestionIndex === 2 && !isAnswerSubmitted && !sharePromptShown.current && !hasSharedMidGame) {
      sharePromptShown.current = true
      // Pause the timer while showing the share dialog
      setIsTimerRunning(false)
      setShowMidGameShareDialog(true)
    }
  }, [currentQuestionIndex, isAnswerSubmitted, hasSharedMidGame])

  const fetchQuestions = async () => {
    setIsLoading(true)
    setFetchError(null)

    try {
      // Add cache busting parameter to avoid cached responses
      const cacheBuster = new Date().getTime()
      const response = await fetch(`/api/trivia/questions?count=5&_=${cacheBuster}`)

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`)
      }

      const data = await response.json()

      if (data.questions && data.questions.length > 0) {
        // Pre-load images to avoid loading delays during gameplay
        data.questions.forEach((question, index) => {
          if (question.imageUrl && !question.imageUrl.startsWith("data:")) {
            const img = new Image()
            img.src = question.imageUrl
            img.crossOrigin = "anonymous"
            img.onload = () => {
              console.log(`Image pre-loaded: ${question.imageUrl}`)
            }
            img.onerror = () => {
              console.warn(`Image failed to pre-load: ${question.imageUrl}`)
            }
          }
        })

        setQuestions(data.questions)
      } else {
        console.warn("No questions returned from API, using fallback questions")
        setQuestions(FALLBACK_QUESTIONS)
      }
    } catch (error) {
      // Don't destructure the error, just log it as is
      console.error("Error fetching trivia questions:", error)

      // Set a user-friendly error message
      setFetchError("We're having trouble loading questions. Using offline questions instead.")

      // Use fallback questions when API fails
      setQuestions(FALLBACK_QUESTIONS)

      // Show toast notification
      toast({
        title: "Using offline questions",
        description: "We're having trouble connecting to our servers. Using local questions instead.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
      setIsTimerRunning(true)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleAnswerSubmit = async () => {
    setIsTimerRunning(false)
    setIsAnswerSubmitted(true)

    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return // Safety check

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore((prev) => prev + 1)

      // Show confetti for correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
      })
    }

    // If this is the last question, end the game
    if (currentQuestionIndex === questions.length - 1) {
      if (isLoggedIn && currentUser) {
        try {
          const response = await fetch("/api/trivia/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: currentUser.id,
              score: isCorrect ? score + 1 : score,
              totalQuestions: questions.length,
            }),
          })

          const result = await response.json()

          if (result.success) {
            setPointsAwarded(result.pointsAwarded)

            // If a badge was awarded, show the badge dialog
            if (result.badgeAwarded) {
              setEarnedBadge(result.badgeAwarded)
              setShowBadgeDialog(true)
            }
          }
        } catch (error) {
          console.error("Error submitting trivia results:", error)
        }
      }

      setIsGameOver(true)
    }
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setCurrentQuestionIndex((prev) => prev + 1)
    setTimeLeft(30) // Reset timer for next question
    setIsTimerRunning(true)
  }

  const handleRestartGame = () => {
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setIsGameOver(false)
    setScore(0)
    setTimeLeft(30)
    setHasSharedMidGame(false)
    setImageLoadError({})
    imageRetries.current = {}
    sharePromptShown.current = false
    fetchQuestions()
  }

  const handleShareBadge = () => {
    setShowBadgeDialog(false)
    setShowShareDialog(true)
  }

  const handleShare = async (platform: string) => {
    const isMidGameShare = showMidGameShareDialog
    const shareText = isMidGameShare
      ? `I'm playing the San Francisco Trivia Game with Sgt. Ken! Test your knowledge of SF and see if you can beat my score!`
      : earnedBadge
        ? `I just earned the ${getBadgeName(earnedBadge?.badge_type || "")} badge playing the San Francisco Trivia Game! Test your knowledge too!`
        : `I scored ${score}/${questions.length} on the San Francisco Trivia Game! Think you can beat me?`

    const shareUrl = `${window.location.origin}/trivia`
    let shareLink = ""

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
        break
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        })
        if (isMidGameShare) {
          setShowMidGameShareDialog(false)
          setIsTimerRunning(true)
          setHasSharedMidGame(true)
        } else {
          setShowShareDialog(false)
        }

        // Record the share and award points
        if (isLoggedIn && currentUser) {
          recordShare("clipboard", isMidGameShare)
        }
        return
    }

    // Open share link in new window
    window.open(shareLink, "_blank")

    if (isMidGameShare) {
      setShowMidGameShareDialog(false)
      setIsTimerRunning(true)
      setHasSharedMidGame(true)
    } else {
      setShowShareDialog(false)
    }

    // Record the share and award points
    if (isLoggedIn && currentUser) {
      recordShare(platform, isMidGameShare)
    }
  }

  const recordShare = async (platform: string, isMidGameShare: boolean) => {
    try {
      const currentQuestion = isMidGameShare && questions[currentQuestionIndex] ? currentQuestionIndex : null

      const response = await fetch("/api/trivia/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          platform,
          questionId: currentQuestion,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Points awarded!",
          description: "You earned 15 points for sharing!",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error recording share:", error)
    }
  }

  const handleSkipShare = () => {
    setShowMidGameShareDialog(false)
    setIsTimerRunning(true)
  }

  const handleImageError = (index: number) => {
    // Track retry attempts for this image
    const retries = imageRetries.current[index] || 0

    // Only allow 2 retries before marking as error
    if (retries < 2) {
      imageRetries.current[index] = retries + 1

      // Try to reload with a cache buster
      const question = questions[index]
      if (question && question.imageUrl) {
        // Add timestamp to bust cache
        const cacheBuster = new Date().getTime()
        let newUrl = question.imageUrl

        // If it's a placeholder.svg URL, regenerate it
        if (question.imageUrl.includes("placeholder.svg")) {
          newUrl = `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(question.question)}&_=${cacheBuster}`
        } else if (!question.imageUrl.includes("?")) {
          newUrl = `${question.imageUrl}?_=${cacheBuster}`
        } else {
          newUrl = `${question.imageUrl}&_=${cacheBuster}`
        }

        // Update the image URL
        const updatedQuestions = [...questions]
        updatedQuestions[index] = {
          ...question,
          imageUrl: newUrl,
        }
        setQuestions(updatedQuestions)

        // Don't mark as error yet
        return
      }
    }

    // If we've exceeded retries or couldn't reload, mark as error
    setImageLoadError((prev) => ({ ...prev, [index]: true }))
  }

  const getBadgeName = (badgeType: string): string => {
    switch (badgeType) {
      case "trivia-participant":
        return "Trivia Participant"
      case "trivia-enthusiast":
        return "Trivia Enthusiast"
      case "trivia-master":
        return "Trivia Master"
      default:
        return "SF Trivia Badge"
    }
  }

  const getBadgeDescription = (badgeType: string): string => {
    switch (badgeType) {
      case "trivia-participant":
        return "Awarded for participating in your first SF Trivia Game round."
      case "trivia-enthusiast":
        return "Awarded for completing 5 rounds of the SF Trivia Game."
      case "trivia-master":
        return "Awarded for achieving 3 perfect scores in the SF Trivia Game."
      default:
        return "A special badge earned through the SF Trivia Game."
    }
  }

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-6" />
          <Skeleton className="h-48 w-full mb-6 rounded-lg" /> {/* Image placeholder */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isGameOver) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">Game Over!</h2>

          <div className="bg-[#0A3C1F]/10 rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-[#0A3C1F] mb-2">
              {score} / {questions.length}
            </div>
            <p className="text-gray-600">
              {score === questions.length
                ? "Perfect score! Amazing job!"
                : score >= questions.length / 2
                  ? "Great job! You know San Francisco well!"
                  : "Good effort! Keep learning about San Francisco!"}
            </p>

            {isLoggedIn && (
              <div className="mt-4 p-3 bg-[#FFD700]/20 rounded-lg">
                <p className="font-semibold text-[#0A3C1F]">
                  <Trophy className="h-5 w-5 inline-block mr-2" />
                  You earned {pointsAwarded} points!
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleRestartGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>

            {isLoggedIn ? (
              <Button
                onClick={() => setShowShareDialog(true)}
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = "/badges")}
                variant="outline"
                className="border-[#0A3C1F] text-[#0A3C1F]"
              >
                <Award className="h-4 w-4 mr-2" />
                View Badges
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Make sure we have questions and a valid currentQuestion before rendering
  if (!questions.length || !questions[currentQuestionIndex]) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-[#0A3C1F] mb-4">
            {fetchError ? "Error Loading Questions" : "Loading Questions..."}
          </h2>

          {fetchError && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <AlertCircle className="h-5 w-5 inline-block mr-2" />
              {fetchError}
            </div>
          )}

          <Button onClick={fetchQuestions} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
            <RefreshCw className="h-4 w-4 mr-2" />
            {fetchError ? "Try Again" : "Retry Loading Questions"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <>
      <Card className="shadow-md">
        <CardContent className="p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                Score: {score}/{currentQuestionIndex}
              </span>
            </div>
            <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2" />
          </div>

          {/* Timer */}
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="px-3 py-1">
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
            <div className={`flex items-center gap-1 ${timeLeft <= 10 ? "text-red-500" : "text-gray-600"}`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          </div>

          {/* Question Image */}
          {currentQuestion.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden relative w-full h-48 md:h-64 bg-gray-100">
              {!imageLoadError[currentQuestionIndex] ? (
                <Image
                  src={currentQuestion.imageUrl || "/placeholder.svg"}
                  alt={currentQuestion.imageAlt || `Image for question about ${currentQuestion.category}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(currentQuestionIndex)}
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">
                      {currentQuestion.category ? `Image related to ${currentQuestion.category}` : "Image unavailable"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question */}
          <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswerSubmitted}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedAnswer === index
                    ? isAnswerSubmitted
                      ? index === currentQuestion.correctAnswer
                        ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                        : "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
                      : "bg-[#0A3C1F]/10 border-[#0A3C1F] dark:bg-[#0A3C1F]/30"
                    : isAnswerSubmitted && index === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {isAnswerSubmitted ? (
                      index === currentQuestion.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <span className="h-5 w-5 inline-block text-center font-medium text-gray-500">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )
                    ) : (
                      <span className="h-5 w-5 inline-block text-center font-medium text-gray-500">
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation (shown after answering) */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
              >
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Explanation</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-200">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex justify-between mt-6">
            {!isAnswerSubmitted ? (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">
                {currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
              </Button>
            )}

            <Button variant="outline" onClick={handleRestartGame} className="border-[#0A3C1F] text-[#0A3C1F]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mid-Game Share Dialog */}
      <Dialog open={showMidGameShareDialog} onOpenChange={setShowMidGameShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">Share and Earn Points!</DialogTitle>
          <DialogDescription className="text-center">
            Share this trivia game with friends and earn 15 bonus points!
          </DialogDescription>

          <div className="py-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center mb-4">
              <Share2 className="h-12 w-12 text-[#0A3C1F]" />
            </div>
            <p className="text-center mb-4">
              Help us recruit more deputies by sharing this trivia game on social media!
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90" onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/90" onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={() => handleShare("copy")} className="border-[#0A3C1F] text-[#0A3C1F]">
                <Mail className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkipShare} className="w-full">
              Skip for now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Badge Earned Dialog */}
      <Dialog open={showBadgeDialog} onOpenChange={setShowBadgeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-center">Badge Earned!</DialogTitle>
          <div className="py-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
              <Award className="h-16 w-16 text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold text-[#0A3C1F] mb-2">{getBadgeName(earnedBadge?.badge_type || "")}</h3>
            <p className="text-center text-gray-600">{getBadgeDescription(earnedBadge?.badge_type || "")}</p>
          </div>
          <DialogFooter>
            <Button onClick={handleShareBadge} className="w-full bg-[#0A3C1F]">
              <Share2 className="h-4 w-4 mr-2" />
              Share Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Share Your Achievement</DialogTitle>
          <DialogDescription>
            {earnedBadge
              ? `Share your new "${getBadgeName(earnedBadge.badge_type)}" badge with friends!`
              : `Share your trivia score of ${score}/${questions.length} with friends!`}
          </DialogDescription>

          <div className="grid grid-cols-2 gap-4 my-4">
            <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90" onClick={() => handleShare("facebook")}>
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90" onClick={() => handleShare("twitter")}>
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button className="bg-[#0A66C2] hover:bg-[#0A66C2]/90" onClick={() => handleShare("linkedin")}>
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" onClick={() => handleShare("copy")} className="border-[#0A3C1F] text-[#0A3C1F]">
              <Mail className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <div className="bg-[#0A3C1F]/5 p-3 rounded-lg text-sm">
            <p className="font-medium">Customize your message:</p>
            <textarea
              className="w-full mt-2 p-2 border rounded-md text-sm"
              rows={3}
              defaultValue={
                earnedBadge
                  ? `I just earned the ${getBadgeName(earnedBadge.badge_type)} badge playing the San Francisco Trivia Game! Test your knowledge too!`
                  : `I scored ${score}/${questions.length} on the San Francisco Trivia Game! Think you can beat me?`
              }
            ></textarea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
