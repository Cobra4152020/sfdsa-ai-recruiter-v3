"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { RefreshCw, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { GameShare } from "@/components/game-share"
import { addParticipationPoints } from "@/lib/points-service"
import { useUser } from "@/context/user-context"
import confetti from "canvas-confetti"

// Dictionary of common words (in a real app, this would be much larger)
const DICTIONARY = [
  "act",
  "add",
  "age",
  "ago",
  "air",
  "all",
  "and",
  "any",
  "arm",
  "art",
  "ask",
  "bad",
  "bag",
  "bar",
  "bat",
  "bed",
  "big",
  "bit",
  "box",
  "boy",
  "but",
  "buy",
  "can",
  "car",
  "cat",
  "cup",
  "cut",
  "day",
  "did",
  "die",
  "dog",
  "dry",
  "eat",
  "egg",
  "end",
  "eye",
  "far",
  "few",
  "fit",
  "fly",
  "for",
  "fun",
  "gas",
  "get",
  "god",
  "got",
  "gun",
  "had",
  "has",
  "hat",
  "her",
  "him",
  "his",
  "hit",
  "hot",
  "how",
  "ice",
  "its",
  "job",
  "key",
  "kid",
  "law",
  "lay",
  "led",
  "leg",
  "let",
  "lie",
  "lot",
  "low",
  "man",
  "map",
  "may",
  "men",
  "met",
  "mix",
  "mom",
  "new",
  "nor",
  "not",
  "now",
  "off",
  "oil",
  "old",
  "one",
  "our",
  "out",
  "own",
  "pay",
  "per",
  "put",
  "ran",
  "red",
  "rid",
  "run",
  "saw",
  "say",
  "sea",
  "see",
  "set",
  "she",
  "sit",
  "six",
  "son",
  "sun",
  "tax",
  "tea",
  "ten",
  "the",
  "tie",
  "too",
  "top",
  "try",
  "two",
  "use",
  "war",
  "was",
  "way",
  "who",
  "why",
  "win",
  "yes",
  "yet",
  "you",
  "able",
  "also",
  "area",
  "army",
  "away",
  "baby",
  "back",
  "ball",
  "bank",
  "base",
  "bath",
  "bear",
  "beat",
  "been",
  "best",
  "bill",
  "bird",
  "blue",
  "body",
  "book",
  "born",
  "both",
  "call",
  "calm",
  "came",
  "card",
  "care",
  "case",
  "cell",
  "city",
  "cold",
  "come",
  "control",
  "cool",
  "cope",
  "copy",
  "core",
  "cost",
  "crew",
  "dark",
  "data",
  "date",
  "dawn",
  "days",
  "dead",
  "deal",
  "dean",
  "dear",
  "debt",
  "deep",
  "deny",
  "desk",
  "dial",
  "dick",
  "diet",
  "disc",
  "disk",
  "does",
  "done",
  "door",
  "dose",
  "down",
  "draw",
  "drew",
  "drop",
  "drug",
  "dual",
  "duke",
  "dust",
  "duty",
  "each",
  "earn",
  "ease",
  "east",
  "easy",
  "edge",
  "else",
  "even",
  "ever",
  "evil",
  "exit",
  "face",
  "fact",
  "fail",
  "fair",
  "fall",
  "farm",
  "fast",
  "fate",
  "fear",
  "feed",
  "feel",
  "feet",
  "fell",
  "felt",
  "file",
  "fill",
  "film",
  "find",
  "fine",
  "fire",
  "firm",
  "fish",
  "five",
  "flat",
  "flow",
  "food",
  "foot",
  "ford",
  "form",
  "fort",
  "four",
  "free",
  "from",
  "fuel",
  "full",
  "fund",
  "gain",
  "game",
  "gate",
  "gave",
  "gear",
  "gene",
  "gift",
  "girl",
  "give",
  "glad",
  "goal",
  "gold",
  "golf",
  "good",
  "grew",
  "grow",
  "gulf",
  "hair",
  "half",
  "hall",
  "hand",
  "hang",
  "hard",
  "harm",
  "hate",
  "have",
  "head",
  "hear",
  "heat",
  "held",
  "hell",
  "help",
  "here",
  "hero",
  "high",
  "hill",
  "hire",
  "hold",
  "hole",
  "holy",
  "home",
  "hope",
  "host",
  "hour",
  "huge",
  "hung",
  "hunt",
  "hurt",
  "idea",
  "inch",
]

// Letter frequencies similar to Scrabble
const LETTER_FREQUENCIES = {
  a: 9,
  b: 2,
  c: 2,
  d: 4,
  e: 12,
  f: 2,
  g: 3,
  h: 2,
  i: 9,
  j: 1,
  k: 1,
  l: 4,
  m: 2,
  n: 6,
  o: 8,
  p: 2,
  q: 1,
  r: 6,
  s: 4,
  t: 6,
  u: 4,
  v: 2,
  w: 2,
  x: 1,
  y: 2,
  z: 1,
}

export function WordConstructor() {
  const [letters, setLetters] = useState<string[]>([])
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; index: number }[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const [submittedWords, setSubmittedWords] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const { toast } = useToast()
  const { user, isLoggedIn } = useUser()

  // Generate random letters
  const generateLetters = useCallback(() => {
    const newLetters: string[] = []
    const letters = Object.keys(LETTER_FREQUENCIES)
    const frequencies = Object.values(LETTER_FREQUENCIES)

    // Create a weighted pool of letters based on frequencies
    const letterPool: string[] = []
    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < frequencies[i]; j++) {
        letterPool.push(letters[i])
      }
    }

    // Draw 12 random letters from the pool
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * letterPool.length)
      newLetters.push(letterPool[randomIndex])
    }

    return newLetters
  }, [])

  // Start a new game
  const startGame = useCallback(() => {
    setLetters(generateLetters())
    setSelectedLetters([])
    setCurrentWord("")
    setSubmittedWords([])
    setScore(0)
    setTimeLeft(60)
    setGameActive(true)
    setGameOver(false)
  }, [generateLetters])

  // Handle letter selection
  const selectLetter = (letter: string, index: number) => {
    if (gameActive && !selectedLetters.some((l) => l.index === index)) {
      const newSelectedLetters = [...selectedLetters, { letter, index }]
      setSelectedLetters(newSelectedLetters)
      setCurrentWord(newSelectedLetters.map((l) => l.letter).join(""))
    }
  }

  // Handle word submission
  const submitWord = () => {
    if (currentWord.length < 3) {
      toast({
        title: "Word too short",
        description: "Words must be at least 3 letters long.",
        variant: "destructive",
      })
      return
    }

    if (submittedWords.includes(currentWord)) {
      toast({
        title: "Word already used",
        description: "You've already used this word.",
        variant: "destructive",
      })
      return
    }

    if (DICTIONARY.includes(currentWord.toLowerCase())) {
      // Calculate score (1 point per letter, bonus for longer words)
      const wordScore = currentWord.length + (currentWord.length > 5 ? 3 : 0)
      setScore((prevScore) => prevScore + wordScore)
      setSubmittedWords((prev) => [...prev, currentWord])

      toast({
        title: "Good word!",
        description: `+"${wordScore}" points for "${currentWord}"`,
        variant: "default",
      })

      // Clear selection
      setSelectedLetters([])
      setCurrentWord("")
    } else {
      toast({
        title: "Not in dictionary",
        description: `"${currentWord}" is not in our dictionary.`,
        variant: "destructive",
      })
    }
  }

  // Clear current selection
  const clearSelection = () => {
    setSelectedLetters([])
    setCurrentWord("")
  }

  // Count down timer
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false)
      setGameOver(true)

      // Trigger confetti for good scores
      if (score > 20) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#0A3C1F", "#FFFFFF"],
        })
      }

      // Add points to user account if logged in
      if (isLoggedIn && user?.id) {
        const gamePoints = Math.floor(score / 2) // Convert game score to participation points
        addParticipationPoints(user.id, gamePoints, "word_game", `Scored ${score} in Word Constructor game`)

        toast({
          title: "Points Added!",
          description: `You earned ${gamePoints} participation points!`,
          duration: 3000,
        })
      }
    }

    return () => clearTimeout(timer)
  }, [gameActive, timeLeft, score, isLoggedIn, user, toast])

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
          <Badge
            variant="outline"
            className={`text-lg py-2 ${timeLeft < 10 ? "border-red-500 text-red-500" : "border-[#0A3C1F] text-[#0A3C1F]"}`}
          >
            Time: {timeLeft}s
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
                gameName="Word Constructor"
                gameDescription="Build words from letters"
                onPointsAdded={handlePointsAdded}
              />
            </div>
          )}
        </div>
      </div>

      {/* Current Word */}
      <div className="flex flex-col items-center gap-2">
        <Input
          value={currentWord}
          readOnly
          className="text-center text-xl font-bold h-12 bg-gray-50"
          placeholder={gameActive ? "Select letters to form a word" : "Press Start to begin"}
        />

        {gameActive && (
          <div className="flex gap-2">
            <Button
              onClick={submitWord}
              disabled={currentWord.length < 3}
              className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
              size="sm"
            >
              <Check className="mr-1 h-4 w-4" />
              Submit
            </Button>
            <Button onClick={clearSelection} variant="outline" size="sm" disabled={selectedLetters.length === 0}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Letter Grid */}
      <div className="grid grid-cols-4 gap-2">
        {letters.map((letter, index) => {
          const isSelected = selectedLetters.some((l) => l.index === index)
          return (
            <Button
              key={`${letter}-${index}`}
              onClick={() => selectLetter(letter, index)}
              disabled={!gameActive || isSelected}
              className={`
                h-14 text-xl font-bold
                ${
                  isSelected
                    ? "bg-[#0A3C1F]/20 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-[#0A3C1F]/10 text-[#0A3C1F] border-2 border-[#0A3C1F]"
                }
              `}
              variant="outline"
            >
              {letter.toUpperCase()}
            </Button>
          )
        })}
      </div>

      {/* Submitted Words */}
      <div>
        <h3 className="font-medium mb-2">Your Words:</h3>
        <div className="flex flex-wrap gap-2">
          {submittedWords.length > 0 ? (
            submittedWords.map((word, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1">
                {word}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500 italic">No words submitted yet</p>
          )}
        </div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <Card className="p-4 border-t-4 border-t-[#0A3C1F] bg-[#0A3C1F]/5">
          <h3 className="text-xl font-bold text-center mb-2">Game Over!</h3>
          <p className="text-center mb-4">
            You scored <span className="font-bold text-[#0A3C1F]">{score} points</span> with {submittedWords.length}{" "}
            words!
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={startGame} className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <RefreshCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <GameShare
              score={score}
              gameName="Word Constructor"
              gameDescription="Build words from letters"
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
            <li>Create words using the letters provided</li>
            <li>Words must be at least 3 letters long</li>
            <li>Score points based on word length</li>
            <li>You have 60 seconds to find as many words as possible</li>
            <li>Share your score to earn bonus participation points!</li>
          </ol>
        </div>
      )}
    </div>
  )
}
