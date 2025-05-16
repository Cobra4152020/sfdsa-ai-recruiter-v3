import { NextResponse } from "next/server"

export const dynamic = 'force-static'

type GameId = 'sf-football' | 'sf-baseball' | 'sf-basketball' | 'sf-districts' | 'sf-tourist-spots' | 'sf-day-trips'

interface Question {
  id: string
  gameId: GameId
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

// Mock questions data
const STATIC_QUESTIONS: Record<GameId, Question[]> = {
  'sf-football': [
    {
      id: "1",
      gameId: "sf-football",
      question: "Which NFL team plays its home games in San Francisco?",
      options: ["49ers", "Raiders", "Giants", "Warriors"],
      correctAnswer: "49ers",
      explanation: "The San Francisco 49ers are the NFL team based in San Francisco.",
    difficulty: "easy",
      category: "Sports"
    }
  ],
  'sf-baseball': [
    {
      id: "1",
      gameId: "sf-baseball",
      question: "Which MLB team plays at Oracle Park?",
      options: ["Giants", "Athletics", "Dodgers", "Padres"],
      correctAnswer: "Giants",
      explanation: "The San Francisco Giants play their home games at Oracle Park.",
    difficulty: "easy",
      category: "Sports"
    }
  ],
  'sf-basketball': [
    {
      id: "1",
      gameId: "sf-basketball",
      question: "Which NBA team recently moved from Oakland to San Francisco?",
      options: ["Warriors", "Kings", "Lakers", "Clippers"],
      correctAnswer: "Warriors",
      explanation: "The Golden State Warriors moved from Oakland to the Chase Center in San Francisco.",
    difficulty: "easy",
      category: "Sports"
    }
  ],
  'sf-districts': [
    {
      id: "1",
      gameId: "sf-districts",
      question: "Which San Francisco district is known for its Italian restaurants and cafes?",
      options: ["North Beach", "Mission", "Castro", "Haight"],
      correctAnswer: "North Beach",
      explanation: "North Beach is San Francisco's Little Italy, known for its Italian restaurants and cafes.",
    difficulty: "easy",
      category: "Geography"
    }
  ],
  'sf-tourist-spots': [
    {
      id: "1",
      gameId: "sf-tourist-spots",
      question: "What is the famous prison located on Alcatraz Island?",
      options: ["Alcatraz Federal Penitentiary", "San Quentin", "Folsom Prison", "Pelican Bay"],
      correctAnswer: "Alcatraz Federal Penitentiary",
      explanation: "Alcatraz Federal Penitentiary was a maximum security federal prison on Alcatraz Island.",
    difficulty: "easy",
      category: "History"
    }
  ],
  'sf-day-trips': [
    {
      id: "1",
      gameId: "sf-day-trips",
      question: "Which famous wine region is located north of San Francisco?",
      options: ["Napa Valley", "Sonoma Valley", "Both A and B", "Neither"],
      correctAnswer: "Both A and B",
      explanation: "Both Napa Valley and Sonoma Valley are famous wine regions north of San Francisco.",
    difficulty: "easy",
      category: "Geography"
    }
  ]
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const gameId = url.searchParams.get("gameId") as GameId | null
    const count = Number(url.searchParams.get("count") || "10")

    if (!gameId || !STATIC_QUESTIONS[gameId]) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 })
    }

    // Get questions for the specified game
    const questions = STATIC_QUESTIONS[gameId]

    // Return all questions since this is static data
    return NextResponse.json({
      success: true,
      questions,
      source: 'static'
    })
  } catch (error) {
    console.error("Error fetching trivia questions:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
