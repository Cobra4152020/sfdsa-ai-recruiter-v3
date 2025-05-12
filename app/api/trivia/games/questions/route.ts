import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { error, info, warn } from "@/lib/logging-service"
import { v4 as uuidv4 } from "uuid"

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
    {
      id: "sf-football-3",
      question: "In which Super Bowl did the 49ers defeat the Cincinnati Bengals 20-16?",
      options: ["Super Bowl XVI", "Super Bowl XIX", "Super Bowl XXIII", "Super Bowl XXIV"],
      correctAnswer: 2,
      explanation: "The 49ers defeated the Bengals 20-16 in Super Bowl XXIII, played on January 22, 1989.",
      difficulty: "hard",
      category: "football",
      imageUrl: "/49ers-super-bowl-xxiii.png",
    },
    {
      id: "sf-football-4",
      question: "Which 49ers quarterback won the NFL MVP award in 1992?",
      options: ["Joe Montana", "Steve Young", "Jeff Garcia", "Colin Kaepernick"],
      correctAnswer: 1,
      explanation: "Steve Young won the NFL MVP award in 1992, the first of his three MVP awards.",
      difficulty: "medium",
      category: "football",
      imageUrl: "/steve-young-mvp.png",
    },
    {
      id: "sf-football-5",
      question: "Who holds the 49ers record for most rushing yards in a career?",
      options: ["Frank Gore", "Roger Craig", "Joe Perry", "Garrison Hearst"],
      correctAnswer: 0,
      explanation: "Frank Gore is the 49ers' all-time rushing leader with 11,073 yards from 2005 to 2014.",
      difficulty: "medium",
      category: "football",
      imageUrl: "/frank-gore-49ers.png",
    },
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
    {
      id: "sf-baseball-3",
      question: "In what year did the Giants move from New York to San Francisco?",
      options: ["1952", "1958", "1962", "1970"],
      correctAnswer: 1,
      explanation: "The Giants moved from New York to San Francisco in 1958.",
      difficulty: "medium",
      category: "baseball",
      imageUrl: "/giants-move-1958.png",
    },
    {
      id: "sf-baseball-4",
      question: "How many World Series championships have the San Francisco Giants won?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2,
      explanation: "The San Francisco Giants have won 3 World Series championships (2010, 2012, and 2014).",
      difficulty: "medium",
      category: "baseball",
      imageUrl: "/placeholder.svg?key=taw9f",
    },
    {
      id: "sf-baseball-5",
      question: "Who is the Giants' all-time leader in home runs?",
      options: ["Barry Bonds", "Willie Mays", "Willie McCovey", "Mel Ott"],
      correctAnswer: 1,
      explanation: "Willie Mays is the Giants' all-time leader with 646 home runs during his time with the team.",
      difficulty: "medium",
      category: "baseball",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Willie Mays Giants home run",
    },
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
    {
      id: "sf-basketball-3",
      question: "How many NBA championships have the Warriors won since moving to the Bay Area?",
      options: ["3", "4", "6", "7"],
      correctAnswer: 3,
      explanation: "The Warriors have won 7 NBA championships since moving to the Bay Area in 1962.",
      difficulty: "medium",
      category: "basketball",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Golden State Warriors NBA championship trophy",
    },
    {
      id: "sf-basketball-4",
      question: "Which Warriors player set the NBA record for most 3-pointers in a single game with 14?",
      options: ["Stephen Curry", "Klay Thompson", "Kevin Durant", "Draymond Green"],
      correctAnswer: 1,
      explanation:
        "Klay Thompson set the NBA record with 14 three-pointers in a game against the Chicago Bulls in 2018.",
      difficulty: "medium",
      category: "basketball",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Klay Thompson three point record",
    },
    {
      id: "sf-basketball-5",
      question: "In what year did the Warriors draft Stephen Curry?",
      options: ["2007", "2008", "2009", "2010"],
      correctAnswer: 2,
      explanation: "The Warriors drafted Stephen Curry with the 7th overall pick in the 2009 NBA Draft.",
      difficulty: "easy",
      category: "basketball",
      imageUrl: "/placeholder.svg?height=300&width=500&query=Stephen Curry draft Warriors 2009",
    },
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
      imageUrl: "/castro-rainbow-flags.png",
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
      imageUrl: "/san-francisco-chinatown-gate.png",
    },
    {
      id: "sf-districts-3",
      question: "Which San Francisco district was the center of the 'Beat Generation' in the 1950s?",
      options: ["Mission District", "Haight-Ashbury", "North Beach", "SoMa"],
      correctAnswer: 2,
      explanation: "North Beach was the center of the Beat Generation movement in the 1950s.",
      difficulty: "medium",
      category: "districts",
      imageUrl: "/north-beach-italian-street.png",
    },
    {
      id: "sf-districts-4",
      question: "Which district was the center of the 'Summer of Love' in 1967?",
      options: ["Castro", "Mission", "Haight-Ashbury", "Tenderloin"],
      correctAnswer: 2,
      explanation: "Haight-Ashbury was the center of the counterculture 'Summer of Love' in 1967.",
      difficulty: "medium",
      category: "districts",
      imageUrl: "/summer-of-love-1967-san-francisco.png",
    },
    {
      id: "sf-districts-5",
      question: "Which San Francisco district is known for its Latino culture and murals?",
      options: ["Mission District", "Noe Valley", "Sunset District", "Richmond District"],
      correctAnswer: 0,
      explanation: "The Mission District is known for its strong Latino culture and colorful murals.",
      difficulty: "easy",
      category: "districts",
      imageUrl: "/mission-district-sf.png",
    },
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
      imageUrl: "/alcatraz-island-san-francisco.png",
    },
    {
      id: "sf-tourist-spots-2",
      question: "What is the name of the famous crooked street in San Francisco?",
      options: ["Market Street", "Lombard Street", "Van Ness Avenue", "Geary Boulevard"],
      correctAnswer: 1,
      explanation: "Lombard Street is known as the 'crookedest street in the world' with its eight hairpin turns.",
      difficulty: "easy",
      category: "tourist-spots",
      imageUrl: "/lombard-street-crooked.png",
    },
    {
      id: "sf-tourist-spots-3",
      question: "Which famous San Francisco landmark opened in 1937?",
      options: ["Coit Tower", "Golden Gate Bridge", "Fisherman's Wharf", "Transamerica Pyramid"],
      correctAnswer: 1,
      explanation: "The Golden Gate Bridge opened in 1937 and has become the iconic symbol of San Francisco.",
      difficulty: "easy",
      category: "tourist-spots",
      imageUrl: "/golden-gate-bridge.png",
    },
    {
      id: "sf-tourist-spots-4",
      question: "What is the name of the famous square in San Francisco's downtown?",
      options: ["Pioneer Square", "Union Square", "Market Square", "Embarcadero Plaza"],
      correctAnswer: 1,
      explanation:
        "Union Square is a 2.6-acre public plaza in downtown San Francisco and one of the city's main shopping areas.",
      difficulty: "medium",
      category: "tourist-spots",
      imageUrl: "/union-square-san-francisco.png",
    },
    {
      id: "sf-tourist-spots-5",
      question: "Which famous San Francisco attraction features historic cable cars?",
      options: ["Cable Car Museum", "Fisherman's Wharf", "Powell-Hyde Line", "All of the above"],
      correctAnswer: 3,
      explanation:
        "All of these are famous San Francisco attractions featuring historic cable cars. The Cable Car Museum, Fisherman's Wharf, and the Powell-Hyde Line are all popular tourist destinations.",
      difficulty: "medium",
      category: "tourist-spots",
      imageUrl: "/san-francisco-cable-car-powell.png",
    },
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
      imageUrl: "/napa-valley-vineyards.png",
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
      imageUrl: "/monterey-bay-aquarium-interior.png",
    },
    {
      id: "sf-day-trips-3",
      question: "Which national park, famous for its giant redwoods, is located near San Francisco?",
      options: [
        "Yosemite National Park",
        "Muir Woods National Monument",
        "Sequoia National Park",
        "Kings Canyon National Park",
      ],
      correctAnswer: 1,
      explanation:
        "Muir Woods National Monument is famous for its old-growth coastal redwoods and is located just north of San Francisco.",
      difficulty: "easy",
      category: "day-trips",
      imageUrl: "/muir-woods-day-trip.png",
    },
    {
      id: "sf-day-trips-4",
      question: "Which picturesque waterfront town is located just across the Golden Gate Bridge from San Francisco?",
      options: ["Oakland", "Berkeley", "Sausalito", "Tiburon"],
      correctAnswer: 2,
      explanation:
        "Sausalito is a picturesque waterfront town located just across the Golden Gate Bridge from San Francisco.",
      difficulty: "easy",
      category: "day-trips",
      imageUrl: "/sausalito-day-trip.png",
    },
    {
      id: "sf-day-trips-5",
      question: "Which famous technology region is located south of San Francisco?",
      options: ["Silicon Valley", "Tech Alley", "Digital Heights", "Computer Canyon"],
      correctAnswer: 0,
      explanation:
        "Silicon Valley, the global center for technology and innovation, is located south of San Francisco.",
      difficulty: "easy",
      category: "day-trips",
      imageUrl: "/silicon-valley-tech-hq.png",
    },
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
  // Generate a unique request ID for tracking this request through logs
  const requestId = uuidv4()

  try {
    const url = new URL(req.url)
    const count = Number.parseInt(url.searchParams.get("count") || "5", 10)
    const gameId = url.searchParams.get("gameId") || "sf-football"

    // Log the incoming request
    info("Trivia questions request received", {
      component: "trivia-api",
      action: "fetch-questions",
      requestId,
      gameId,
      count,
    })

    // Try to fetch questions from the database first
    const supabase = getServiceSupabase()
    let dbQuestions = []
    let dbError = null

    try {
      // Add timeout to the database query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Database query timeout after 5 seconds")), 5000)
      })

      const queryPromise = supabase.from("trivia_questions").select("*").eq("game_id", gameId).order("id").limit(100)

      // Race between the query and the timeout
      const result = (await Promise.race([queryPromise, timeoutPromise])) as any

      if (result.error) {
        throw result.error
      }

      dbQuestions = result.data || []

      // Log successful database fetch
      info("Database questions fetched successfully", {
        component: "trivia-api",
        action: "db-fetch",
        requestId,
        gameId,
        questionCount: dbQuestions.length,
      })
    } catch (error) {
      dbError = error

      // Log database error
      warn(
        "Failed to fetch questions from database",
        {
          component: "trivia-api",
          action: "db-fetch",
          requestId,
          gameId,
          error: error instanceof Error ? error.message : String(error),
        },
        error,
      )
    }

    let questions = []
    let source = "unknown"

    // Determine which questions to use
    if (dbError || !dbQuestions || dbQuestions.length === 0) {
      // Log fallback to static questions
      warn(`No questions found in database for ${gameId}, using fallback questions`, {
        component: "trivia-api",
        action: "fallback-questions",
        requestId,
        gameId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      })

      // Use fallback questions if database fetch fails or returns no results
      questions = fallbackQuestions[gameId] || []
      source = "fallback"

      // If no fallback questions exist for this game, create some generic ones
      if (!questions || questions.length === 0) {
        warn(`No fallback questions found for ${gameId}, creating generic questions`, {
          component: "trivia-api",
          action: "generic-questions",
          requestId,
          gameId,
        })

        questions = createGenericQuestions(gameId)
        source = "generic"
      }
    } else {
      // Map database questions to the expected format
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
      source = "database"
    }

    // Ensure we have enough questions
    if (questions.length === 0) {
      // This is a critical error - we should always have at least some questions
      error("No questions available after all fallbacks", {
        component: "trivia-api",
        action: "no-questions",
        requestId,
        gameId,
      })

      // Create emergency questions as a last resort
      questions = createGenericQuestions("emergency")
      source = "emergency"
    }

    // Ensure all questions have valid image URLs
    const questionsWithImages = ensureImageUrls(questions)

    // Shuffle the questions and select the requested number
    const shuffled = [...questionsWithImages].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, questionsWithImages.length))

    // Log successful response
    info("Trivia questions successfully prepared", {
      component: "trivia-api",
      action: "questions-prepared",
      requestId,
      gameId,
      source,
      questionCount: selected.length,
      totalAvailable: questions.length,
    })

    // Return the selected questions as JSON
    return NextResponse.json({
      questions: selected,
      source,
      requestId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Log the critical error
    error(
      "Critical error in trivia questions API",
      {
        component: "trivia-api",
        action: "critical-error",
        requestId,
        error: error instanceof Error ? error.message : String(error),
      },
      error,
    )

    // Create some emergency questions to return
    const emergencyQuestions = createGenericQuestions("emergency")

    // Return a proper error response with emergency questions
    return NextResponse.json(
      {
        error: "Failed to generate trivia questions",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        questions: emergencyQuestions,
        source: "emergency",
        requestId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    ) // Still return 200 to allow the client to display the emergency questions
  }
}

// Add this function to create generic questions if no fallback exists
function createGenericQuestions(gameId: string) {
  return [
    {
      id: `emergency-1`,
      question: "Which famous bridge is located in San Francisco?",
      options: ["Brooklyn Bridge", "Golden Gate Bridge", "London Bridge", "Sydney Harbour Bridge"],
      correctAnswer: 1,
      explanation: "The Golden Gate Bridge is San Francisco's most iconic landmark.",
      difficulty: "easy",
      category: "landmarks",
      imageUrl: "/golden-gate-bridge.png",
    },
    {
      id: `emergency-2`,
      question: "What is the name of the famous prison located on an island in San Francisco Bay?",
      options: ["Rikers Island", "Alcatraz", "San Quentin", "Folsom"],
      correctAnswer: 1,
      explanation: "Alcatraz Island in San Francisco Bay was home to the infamous federal prison from 1934 to 1963.",
      difficulty: "easy",
      category: "landmarks",
      imageUrl: "/alcatraz-prison-san-francisco.png",
    },
    {
      id: `emergency-3`,
      question: "Which San Francisco neighborhood is known for its LGBTQ+ history?",
      options: ["Mission District", "Castro District", "Chinatown", "Fisherman's Wharf"],
      correctAnswer: 1,
      explanation: "The Castro District is known for its LGBTQ+ history and culture.",
      difficulty: "easy",
      category: "neighborhoods",
      imageUrl: "/castro-district-san-francisco.png",
    },
    {
      id: `emergency-4`,
      question: "What is the name of the famous crooked street in San Francisco?",
      options: ["Market Street", "Lombard Street", "Van Ness Avenue", "Geary Boulevard"],
      correctAnswer: 1,
      explanation: "Lombard Street is known as the 'crookedest street in the world' with its eight hairpin turns.",
      difficulty: "easy",
      category: "landmarks",
      imageUrl: "/lombard-street-crooked.png",
    },
    {
      id: `emergency-5`,
      question: "What is the name of San Francisco's Chinatown?",
      options: ["San Francisco Chinatown", "Little China", "Asian District", "Oriental Quarter"],
      correctAnswer: 0,
      explanation: "San Francisco's Chinatown is the oldest Chinatown in North America.",
      difficulty: "easy",
      category: "neighborhoods",
      imageUrl: "/san-francisco-chinatown-gate.png",
    },
  ]
}
