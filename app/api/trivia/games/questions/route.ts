import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const gameId = searchParams.get("gameId") || ""
    const count = Number.parseInt(searchParams.get("count") || "5", 10)

    // Create Supabase client
    const supabase = createClient()

    // Query the database for questions related to the game
    const { data: questions, error } = await supabase
      .from("trivia_questions")
      .select("*")
      .eq("game_id", gameId)
      .order("id")
      .limit(count)

    if (error) {
      console.error("Error fetching trivia questions:", error)
      return NextResponse.json({ error: "Failed to fetch trivia questions", details: error.message }, { status: 500 })
    }

    // If no questions found, generate sample questions
    if (!questions || questions.length === 0) {
      const sampleQuestions = generateSampleQuestions(gameId, count)
      return NextResponse.json({ questions: sampleQuestions })
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Unexpected error in trivia questions API:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

// Helper function to generate sample questions for demo purposes
function generateSampleQuestions(gameId: string, count: number) {
  const gameTopics: Record<string, { questions: string[]; options: string[][]; answers: number[] }> = {
    "sf-football": {
      questions: [
        "Who holds the San Francisco 49ers record for most career touchdown passes?",
        "In what year did the 49ers win their first Super Bowl?",
        "Which 49ers quarterback won 5 Super Bowls?",
        "Who is the 49ers all-time leading rusher?",
        "Which stadium did the 49ers play in before Levi's Stadium?",
      ],
      options: [
        ["Joe Montana", "Steve Young", "John Brodie", "Jimmy Garoppolo"],
        ["1982", "1985", "1989", "1995"],
        ["Joe Montana", "Steve Young", "Colin Kaepernick", "Jimmy Garoppolo"],
        ["Frank Gore", "Roger Craig", "Joe Perry", "Garrison Hearst"],
        ["Candlestick Park", "Kezar Stadium", "Oracle Park", "Monster Park"],
      ],
      answers: [0, 0, 0, 0, 0],
    },
    "sf-baseball": {
      questions: [
        "Who holds the San Francisco Giants record for most career home runs?",
        "In what year did the Giants move from New York to San Francisco?",
        "Which Giants pitcher threw a perfect game in 2012?",
        "How many World Series championships have the San Francisco Giants won?",
        "Which Giants player won the NL MVP award three times?",
      ],
      options: [
        ["Willie Mays", "Barry Bonds", "Willie McCovey", "Orlando Cepeda"],
        ["1957", "1958", "1960", "1962"],
        ["Tim Lincecum", "Madison Bumgarner", "Matt Cain", "Barry Zito"],
        ["1", "2", "3", "4"],
        ["Willie Mays", "Barry Bonds", "Buster Posey", "Willie McCovey"],
      ],
      answers: [1, 1, 2, 2, 1],
    },
    "sf-basketball": {
      questions: [
        "Who holds the Golden State Warriors franchise record for most points in a single game?",
        "In what year did the Warriors move from Philadelphia to San Francisco?",
        "Which Warriors player scored 37 points in a single quarter against the Sacramento Kings in 2015?",
        "How many NBA championships have the Golden State Warriors won since moving to the Bay Area?",
        "Who was the head coach during the Warriors' 2015 championship run?",
      ],
      options: [
        ["Wilt Chamberlain", "Rick Barry", "Stephen Curry", "Klay Thompson"],
        ["1959", "1962", "1965", "1971"],
        ["Stephen Curry", "Klay Thompson", "Draymond Green", "Harrison Barnes"],
        ["3", "4", "5", "6"],
        ["Steve Kerr", "Mark Jackson", "Don Nelson", "Alvin Attles"],
      ],
      answers: [0, 1, 1, 3, 0],
    },
    "sf-districts": {
      questions: [
        "Which San Francisco district is known for its LGBTQ+ culture and history?",
        "Which district is home to the famous 'Painted Ladies' Victorian houses?",
        "Which San Francisco district is known for its Italian heritage?",
        "Which district contains Chinatown?",
        "Which district is home to the Palace of Fine Arts?",
      ],
      options: [
        ["Castro", "Mission", "Haight-Ashbury", "SoMa"],
        ["Alamo Square", "Pacific Heights", "Nob Hill", "Russian Hill"],
        ["North Beach", "Mission", "Noe Valley", "Richmond"],
        ["Downtown", "Financial District", "Nob Hill", "Telegraph Hill"],
        ["Marina", "Presidio", "Richmond", "Sunset"],
      ],
      answers: [0, 0, 0, 0, 0],
    },
    "sf-tourist-spots": {
      questions: [
        "What is the name of the famous prison located on Alcatraz Island?",
        "In what year was the Golden Gate Bridge completed?",
        "What is the name of the famous crooked street in San Francisco?",
        "Which San Francisco museum features interactive science exhibits?",
        "What is the name of San Francisco's historic cable car system?",
      ],
      options: [
        ["San Quentin", "Folsom", "Alcatraz Federal Penitentiary", "Leavenworth"],
        ["1933", "1937", "1941", "1945"],
        ["Market Street", "Lombard Street", "California Street", "Powell Street"],
        ["de Young Museum", "Legion of Honor", "Exploratorium", "Asian Art Museum"],
        ["BART", "Muni", "San Francisco Municipal Railway", "Powell-Hyde Line"],
      ],
      answers: [2, 1, 1, 2, 2],
    },
    "sf-day-trips": {
      questions: [
        "Which famous wine region is located north of San Francisco?",
        "Which national park, known for its giant sequoias, is closest to San Francisco?",
        "Which coastal town south of San Francisco is known for its 17-Mile Drive?",
        "Which beach town north of San Francisco is known for its surfing?",
        "Which historic gold rush town is a popular day trip from San Francisco?",
      ],
      options: [
        ["Sonoma Valley", "Napa Valley", "Russian River Valley", "All of the above"],
        ["Yosemite", "Sequoia", "Kings Canyon", "Redwood"],
        ["Santa Cruz", "Monterey", "Carmel", "Half Moon Bay"],
        ["Stinson Beach", "Bolinas", "Pacifica", "Bodega Bay"],
        ["Sacramento", "Columbia", "Nevada City", "Sonora"],
      ],
      answers: [3, 0, 2, 1, 1],
    },
  }

  // Default to tourist spots if game ID not found
  const topic = gameTopics[gameId] || gameTopics["sf-tourist-spots"]

  // Generate sample questions based on the topic
  return Array.from({ length: Math.min(count, topic.questions.length) }).map((_, i) => ({
    id: `sample-${gameId}-${i}`,
    question: topic.questions[i],
    options: topic.options[i],
    correctAnswer: topic.answers[i],
    explanation: `This is the explanation for the correct answer: ${topic.options[i][topic.answers[i]]}`,
    difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)],
    category: gameId.replace("sf-", "").replace(/-/g, " "),
    game_id: gameId,
    imageUrl: getImageUrlForQuestion(gameId, i),
    imageAlt: `Image related to ${topic.questions[i]}`,
  }))
}

function getImageUrlForQuestion(gameId: string, index: number): string {
  const imageMap: Record<string, string[]> = {
    "sf-football": [
      "/levis-stadium-49ers.png",
      "/joe-montana-49ers.png",
      "/san-francisco-49ers-logo.png",
      "/candlestick-park.png",
      "/49ers-super-bowl-trophy.png",
    ],
    "sf-baseball": [
      "/oracle-park-giants.png",
      "/barry-bonds-giants-record.png",
      "/giants-world-series.png",
      "/sf-giants-logo.png",
      "/willie-mays-giants.png",
    ],
    "sf-basketball": [
      "/chase-center-gsw.png",
      "/warriors-championship.png",
      "/steph-curry-warriors.png",
      "/klay-thompson-warriors.png",
      "/draymond-green-warriors.png",
    ],
  }

  // If we have specific images for this game and index, use them
  if (imageMap[gameId] && imageMap[gameId][index]) {
    return imageMap[gameId][index]
  }

  // Otherwise, use a placeholder with the question text
  return `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(gameId)} trivia question ${index + 1}`
}
