import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"

// Fallback questions for each game
const fallbackQuestions = {
  "sf-football": [
    {
      id: "sf-football-1",
      question: "Which team plays their home games at Levi's Stadium?",
      options: ["San Francisco 49ers", "Oakland Raiders", "San Francisco Giants", "Golden State Warriors"],
      correctAnswer: 0,
      explanation:
        "The San Francisco 49ers play their home games at Levi's Stadium, which opened in 2014 in Santa Clara.",
      difficulty: "easy",
      category: "football",
      imageUrl: "/levis-stadium-49ers.png",
    },
    {
      id: "sf-football-2",
      question: "Who is the 49ers' all-time leader in passing yards?",
      options: ["Steve Young", "Joe Montana", "Colin Kaepernick", "Jimmy Garoppolo"],
      correctAnswer: 1,
      explanation:
        "Joe Montana is the 49ers' all-time leader in passing yards with 35,124 yards during his time with the team from 1979 to 1992.",
      difficulty: "medium",
      category: "football",
      imageUrl: "/joe-montana-49ers.png",
    },
    // More fallback questions would be added here
  ],
  "sf-baseball": [
    {
      id: "sf-baseball-1",
      question: "Where do the San Francisco Giants play their home games?",
      options: ["AT&T Park", "Oracle Park", "Candlestick Park", "PacBell Park"],
      correctAnswer: 1,
      explanation: "The San Francisco Giants play at Oracle Park, which was renamed from AT&T Park in 2019.",
      difficulty: "easy",
      category: "baseball",
      imageUrl: "/oracle-park-giants.png",
    },
    {
      id: "sf-baseball-2",
      question: "Which Giants player hit 73 home runs in a single season, setting an MLB record?",
      options: ["Willie Mays", "Barry Bonds", "Willie McCovey", "Buster Posey"],
      correctAnswer: 1,
      explanation: "Barry Bonds hit 73 home runs in the 2001 season, setting the MLB single-season home run record.",
      difficulty: "easy",
      category: "baseball",
      imageUrl: "/barry-bonds-giants-record.png",
    },
    // More fallback questions would be added here
  ],
  "sf-basketball": [
    {
      id: "sf-basketball-1",
      question: "Where do the Golden State Warriors play their home games?",
      options: ["Oracle Arena", "Chase Center", "SAP Center", "Levi's Stadium"],
      correctAnswer: 1,
      explanation: "The Golden State Warriors play at Chase Center in San Francisco, which opened in 2019.",
      difficulty: "easy",
      category: "basketball",
      imageUrl: "/chase-center-gsw.png",
    },
    {
      id: "sf-basketball-2",
      question: "Who holds the Warriors' franchise record for most points in a single game?",
      options: ["Stephen Curry", "Klay Thompson", "Wilt Chamberlain", "Kevin Durant"],
      correctAnswer: 2,
      explanation:
        "Wilt Chamberlain scored 100 points for the Warriors against the New York Knicks on March 2, 1962, which remains an NBA record.",
      difficulty: "medium",
      category: "basketball",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Wilt Chamberlain Warriors 100 points",
    },
    // More fallback questions would be added here
  ],
  "sf-districts": [
    {
      id: "sf-districts-1",
      question: "Which San Francisco district is known for its LGBTQ+ history and culture?",
      options: ["Mission District", "Castro District", "North Beach", "Haight-Ashbury"],
      correctAnswer: 1,
      explanation:
        "The Castro District is known for its LGBTQ+ history and culture, and has been a symbol of LGBTQ+ activism since the 1960s.",
      difficulty: "easy",
      category: "districts",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Castro District San Francisco rainbow flags",
    },
    {
      id: "sf-districts-2",
      question: "Which district is home to San Francisco's Chinatown?",
      options: ["Financial District", "North Beach", "Nob Hill", "Richmond District"],
      correctAnswer: 0,
      explanation:
        "San Francisco's Chinatown is located adjacent to the Financial District and is the oldest Chinatown in North America.",
      difficulty: "easy",
      category: "districts",
      imageUrl: "/placeholder.svg?height=300&width=500&query=San Francisco Chinatown gate",
    },
    // More fallback questions would be added here
  ],
  "sf-tourist-spots": [
    {
      id: "sf-tourist-spots-1",
      question: "Which famous prison is located on an island in San Francisco Bay?",
      options: ["San Quentin", "Alcatraz", "Folsom", "Rikers Island"],
      correctAnswer: 1,
      explanation: "Alcatraz Island in San Francisco Bay was home to the infamous federal prison from 1934 to 1963.",
      difficulty: "easy",
      category: "tourist-spots",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Alcatraz Island San Francisco",
    },
    {
      id: "sf-tourist-spots-2",
      question: "What is the name of the famous crooked street in San Francisco?",
      options: ["Market Street", "Lombard Street", "Van Ness Avenue", "Geary Boulevard"],
      correctAnswer: 1,
      explanation: "Lombard Street is known as the 'crookedest street in the world' with its eight hairpin turns.",
      difficulty: "easy",
      category: "tourist-spots",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Lombard Street San Francisco crooked",
    },
    // More fallback questions would be added here
  ],
  "sf-day-trips": [
    {
      id: "sf-day-trips-1",
      question: "Which famous wine region is located north of San Francisco?",
      options: ["Sonoma Valley", "Napa Valley", "Both Sonoma and Napa Valley", "Central Valley"],
      correctAnswer: 2,
      explanation:
        "Both Sonoma Valley and Napa Valley are famous wine regions located north of San Francisco, perfect for day trips.",
      difficulty: "easy",
      category: "day-trips",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Napa Valley vineyards",
    },
    {
      id: "sf-day-trips-2",
      question: "Which coastal town south of San Francisco is known for its aquarium and cannery row?",
      options: ["Santa Cruz", "Half Moon Bay", "Monterey", "Carmel-by-the-Sea"],
      correctAnswer: 2,
      explanation:
        "Monterey is known for the world-famous Monterey Bay Aquarium and historic Cannery Row, made famous by John Steinbeck.",
      difficulty: "medium",
      category: "day-trips",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Monterey Bay Aquarium California",
    },
    // More fallback questions would be added here
  ],
}

// Add fallback images for any missing image paths
const ensureImageUrls = (questions) => {
  return questions.map((question) => {
    if (!question.imageUrl || question.imageUrl.includes("placeholder.svg")) {
      // Generate a placeholder image based on question content
      return {
        ...question,
        imageUrl: `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(question.question)}`,
        imageAlt: question.imageAlt || `Image related to question: ${question.question}`,
      }
    }
    return question
  })
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const count = Number.parseInt(url.searchParams.get("count") || "5", 10)
    const gameId = url.searchParams.get("gameId") || "sf-football"

    // Try to fetch questions from the database first
    const supabase = getServiceSupabase()
    const { data: dbQuestions, error } = await supabase
      .from("trivia_questions")
      .select("*")
      .eq("game_id", gameId)
      .order("id")
      .limit(100)

    let questions = []

    if (error || !dbQuestions || dbQuestions.length === 0) {
      console.warn(`No questions found in database for ${gameId}, using fallback questions`)
      // Use fallback questions if database fetch fails or returns no results
      questions = fallbackQuestions[gameId] || fallbackQuestions["sf-football"]
    } else {
      questions = dbQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        category: q.category,
        imageUrl: q.image_url,
        imageAlt: q.image_alt || `Image for ${q.question}`,
      }))
    }

    // Ensure all questions have valid image URLs
    const questionsWithImages = ensureImageUrls(questions)

    // Shuffle the questions and select the requested number
    const shuffled = [...questionsWithImages].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, questionsWithImages.length))

    // Return the selected questions as JSON
    return NextResponse.json({
      questions: selected,
      source: error ? "fallback" : "database",
    })
  } catch (error) {
    // Log the error without destructuring
    console.error("Error in trivia questions API:", error)

    // Return a proper error response
    return NextResponse.json(
      {
        error: "Failed to generate trivia questions",
        questions: [],
        source: "error",
      },
      { status: 500 },
    )
  }
}
