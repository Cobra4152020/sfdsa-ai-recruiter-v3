"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { RefreshCw, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { GameShare } from "@/components/game-share"
import { addParticipationPoints } from "@/lib/points-service"
import { useUser } from "@/context/user-context"
import confetti from "canvas-confetti"

// Wheel segments configuration with more negative outcomes
const WHEEL_SEGMENTS = [
  { label: "+100", value: 100, color: "#0A3C1F", textColor: "#FFFFFF" },
  { label: "-75", value: -75, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+25", value: 25, color: "#005BB5", textColor: "#FFFFFF" },
  { label: "-100", value: -100, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+5", value: 5, color: "#FFD700", textColor: "#000000" },
  { label: "-50", value: -50, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+50", value: 50, color: "#0A3C1F", textColor: "#FFFFFF" },
  { label: "-150", value: -150, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+20", value: 20, color: "#005BB5", textColor: "#FFFFFF" },
  { label: "-25", value: -25, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+200", value: 200, color: "#0A3C1F", textColor: "#FFFFFF" },
  { label: "-200", value: -200, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+15", value: 15, color: "#FFD700", textColor: "#000000" },
  { label: "-80", value: -80, color: "#DC2626", textColor: "#FFFFFF" },
  { label: "+10", value: 10, color: "#FFD700", textColor: "#000000" },
  { label: "-120", value: -120, color: "#DC2626", textColor: "#FFFFFF" },
]

export function SpinToWin() {
  const [spinsLeft, setSpinsLeft] = useState(3)
  const [score, setScore] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [resultValue, setResultValue] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const { user, isLoggedIn } = useUser()

  // Start a new game
  const startGame = () => {
    setSpinsLeft(3)
    setScore(0)
    setIsSpinning(false)
    setRotation(0)
    setGameActive(true)
    setGameOver(false)
    setResultValue(null)

    // Redraw the wheel
    drawWheel()
  }

  // Draw the wheel
  const drawWheel = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw segments
    const segmentAngle = (2 * Math.PI) / WHEEL_SEGMENTS.length

    for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
      const segment = WHEEL_SEGMENTS[i]

      // Start and end angles
      const startAngle = i * segmentAngle
      const endAngle = (i + 1) * segmentAngle

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      // Fill segment
      ctx.fillStyle = segment.color
      ctx.fill()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + segmentAngle / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = segment.textColor
      ctx.font = "bold 14px Arial"
      ctx.fillText(segment.label, radius - 20, 6)
      ctx.restore()
    }

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI)
    ctx.fillStyle = "#FFFFFF"
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrow
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation * (Math.PI / 180))

    ctx.beginPath()
    ctx.moveTo(0, -radius - 10)
    ctx.lineTo(-10, -radius + 10)
    ctx.lineTo(10, -radius + 10)
    ctx.closePath()

    ctx.fillStyle = "#000000"
    ctx.fill()
    ctx.restore()
  }

  // Spin the wheel
  const spinWheel = () => {
    if (isSpinning || spinsLeft <= 0) return

    setIsSpinning(true)
    setResultValue(null)

    // Decrease spins left
    setSpinsLeft((prevSpins) => prevSpins - 1)

    // Random spin between 2 and 5 full rotations (720-1800 degrees)
    const spinAmount = 720 + Math.random() * 1080

    // Duration between 3 and 4 seconds
    const duration = 3000 + Math.random() * 1000

    // Segment size in degrees
    const segmentSize = 360 / WHEEL_SEGMENTS.length

    // Animation start time
    const startTime = Date.now()

    // Final rotation (aligned to a segment)
    const finalRotation = Math.floor((rotation + spinAmount) / segmentSize) * segmentSize

    // Animation function
    const animate = () => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Easing function (cubic in-out)
      const easedProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      // Calculate current rotation
      const currentRotation = rotation + spinAmount * easedProgress

      // Update rotation
      setRotation(currentRotation % 360)

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)

        // Determine which segment was landed on
        const normalizedRotation = ((finalRotation % 360) + 360) % 360
        const segmentIndex = Math.floor(normalizedRotation / segmentSize) % WHEEL_SEGMENTS.length
        const segment = WHEEL_SEGMENTS[WHEEL_SEGMENTS.length - 1 - segmentIndex]

        // Display result
        setResultValue(segment.value)

        // Update score
        setScore((prevScore) => {
          const newScore = Math.max(0, prevScore + segment.value)
          return newScore
        })

        // Show toast notification
        if (segment.value > 0) {
          toast({
            title: "You won points!",
            description: `+${segment.value} points added to your score!`,
            variant: "default",
          })

          if (segment.value >= 100) {
            // Trigger confetti for big wins
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
            })
          }
        } else {
          toast({
            title: "Uh oh!",
            description: `${segment.value} points deducted from your score!`,
            variant: "destructive",
          })
        }

        // Check if game is over
        if (spinsLeft <= 1) {
          setTimeout(() => {
            endGame()
          }, 1000)
        }
      }
    }

    // Start animation
    animate()
  }

  // End game
  const endGame = () => {
    setGameActive(false)
    setGameOver(true)

    // Add points to user account if logged in
    if (isLoggedIn && user?.id) {
      const gamePoints = Math.floor(score / 2) // Convert game score to participation points

      // Only award points if score is positive
      if (gamePoints > 0) {
        addParticipationPoints(user.id, gamePoints, "spin_game", `Scored ${score} in Spin to Win game`)

        toast({
          title: "Points Added!",
          description: `You earned ${gamePoints} participation points!`,
          duration: 3000,
        })
      }
    }
  }

  // Draw wheel when component mounts or rotation changes
  useEffect(() => {
    drawWheel()
  }, [rotation])

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        drawWheel()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [rotation])

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
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-lg py-2 border-[#0A3C1F] text-[#0A3C1F]">
            Spins: {spinsLeft}
          </Badge>
        </div>
        <div>
          {!gameActive && !gameOver && (
            <Button onClick={startGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              Start Game
            </Button>
          )}
          {!gameActive && gameOver && (
            <div className="flex gap-2">
              <Button onClick={startGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                Play Again
              </Button>
              <GameShare
                score={score}
                gameName="Spin to Win"
                gameDescription="Spin the wheel for points"
                onPointsAdded={handlePointsAdded}
              />
            </div>
          )}
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative flex justify-center">
        <canvas ref={canvasRef} width={300} height={300} className="max-w-full" />

        {resultValue !== null && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge
              className={`
                text-2xl py-3 px-4 animate-bounce shadow-lg
                ${
                  resultValue > 0
                    ? "bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              `}
            >
              {resultValue > 0 ? `+${resultValue}` : resultValue}
            </Badge>
          </div>
        )}
      </div>

      {/* Spin Button */}
      <div className="flex justify-center">
        <Button
          onClick={spinWheel}
          disabled={!gameActive || isSpinning || spinsLeft <= 0}
          className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white text-lg py-6 px-8"
          size="lg"
        >
          {isSpinning ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Spinning...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-5 w-5" />
              Spin the Wheel
            </>
          )}
        </Button>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <Card className="p-4 border-t-4 border-t-[#0A3C1F] bg-[#0A3C1F]/5">
          <h3 className="text-xl font-bold text-center mb-2">Game Over!</h3>
          <p className="text-center mb-4">
            You finished with <span className="font-bold text-[#0A3C1F]">{score} points</span>!
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={startGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <GameShare
              score={score}
              gameName="Spin to Win"
              gameDescription="Spin the wheel for points"
              onPointsAdded={handlePointsAdded}
            />
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!gameActive && !gameOver && (
        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-1">How to Play:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Spin the wheel to win or lose points</li>
            <li>Green segments add points to your score</li>
            <li>Red segments deduct points from your score</li>
            <li>You get 3 spins per game</li>
            <li>Be careful! The wheel has many high-risk negative outcomes</li>
            <li>Share your final score to earn bonus participation points!</li>
          </ol>
        </div>
      )}
    </div>
  )
}
