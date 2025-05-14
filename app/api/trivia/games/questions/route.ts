import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Football trivia questions
const footballQuestions = [
  {
    id: "fb-1",
    question: "In what year did the San Francisco 49ers win their first Super Bowl?",
    options: ["1982", "1985", "1989", "1995"],
    correctAnswer: 0,
    explanation:
      "The 49ers won their first Super Bowl (Super Bowl XVI) on January 24, 1982, defeating the Cincinnati Bengals 26-21.",
    difficulty: "medium",
    category: "football",
    imageUrl: "/levis-stadium-49ers.png",
    imageAlt: "Levi's Stadium, home of the San Francisco 49ers",
  },
  {
    id: "fb-2",
    question: "Who is the 49ers' all-time leader in passing yards?",
    options: ["Steve Young", "Joe Montana", "Jeff Garcia", "John Brodie"],
    correctAnswer: 1,
    explanation:
      "Joe Montana is the 49ers' all-time leader in passing yards with 35,124 yards during his time with the team (1979-1992).",
    difficulty: "medium",
    category: "football",
    imageUrl: "/joe-montana-49ers.png",
    imageAlt: "Joe Montana in his San Francisco 49ers uniform",
  },
  {
    id: "fb-3",
    question: "How many Super Bowl championships have the San Francisco 49ers won?",
    options: ["3", "5", "6", "7"],
    correctAnswer: 1,
    explanation:
      "The San Francisco 49ers have won 5 Super Bowl championships (1981, 1984, 1988, 1989, and 1994 seasons).",
    difficulty: "easy",
    category: "football",
    imageUrl: "/49ers-super-bowl-xxiii.png",
    imageAlt: "San Francisco 49ers celebrating a Super Bowl victory",
  },
  {
    id: "fb-4",
    question: "Which 49ers quarterback won the NFL MVP award in 1992?",
    options: ["Joe Montana", "Steve Young", "Jeff Garcia", "Colin Kaepernick"],
    correctAnswer: 1,
    explanation: "Steve Young won the NFL MVP award in 1992, the first of his two MVP awards with the 49ers.",
    difficulty: "medium",
    category: "football",
    imageUrl: "/steve-young-mvp.png",
    imageAlt: "Steve Young in action as 49ers quarterback",
  },
  {
    id: "fb-5",
    question: "Who is the 49ers' all-time rushing leader?",
    options: ["Roger Craig", "Frank Gore", "Garrison Hearst", "Joe Perry"],
    correctAnswer: 1,
    explanation:
      "Frank Gore is the 49ers' all-time rushing leader with 11,073 yards during his time with the team (2005-2014).",
    difficulty: "medium",
    category: "football",
    imageUrl: "/frank-gore-49ers.png",
    imageAlt: "Frank Gore running with the football for the 49ers",
  },
  {
    id: "fb-6",
    question: "What was the name of the 49ers' home stadium before Levi's Stadium?",
    options: ["Oracle Park", "Candlestick Park", "Monster Park", "3Com Park"],
    correctAnswer: 1,
    explanation: "Candlestick Park was the 49ers' home from 1971 to 2013, before they moved to Levi's Stadium in 2014.",
    difficulty: "easy",
    category: "football",
    imageUrl: "/levis-stadium-49ers.png",
    imageAlt: "Aerial view of Levi's Stadium in Santa Clara",
  },
  {
    id: "fb-7",
    question: "Which 49ers head coach led the team to 5 Super Bowl victories?",
    options: ["Bill Walsh", "George Seifert", "Jim Harbaugh", "Steve Mariucci"],
    correctAnswer: 0,
    explanation: "Bill Walsh led the 49ers to 3 Super Bowl victories, while George Seifert led them to the other 2.",
    difficulty: "hard",
    category: "football",
    imageUrl: "/joe-montana-49ers.png",
    imageAlt: "Bill Walsh coaching the San Francisco 49ers",
  },
  {
    id: "fb-8",
    question: "In what year did the 49ers move to Levi's Stadium?",
    options: ["2012", "2014", "2016", "2018"],
    correctAnswer: 1,
    explanation: "The 49ers moved to Levi's Stadium in Santa Clara for the 2014 NFL season.",
    difficulty: "easy",
    category: "football",
    imageUrl: "/levis-stadium-49ers.png",
    imageAlt: "Levi's Stadium during a 49ers game",
  },
  {
    id: "fb-9",
    question: "Which 49ers wide receiver is known as 'The GOAT'?",
    options: ["Terrell Owens", "Dwight Clark", "Jerry Rice", "John Taylor"],
    correctAnswer: 2,
    explanation:
      "Jerry Rice is widely considered the greatest wide receiver of all time and nicknamed 'The GOAT' (Greatest Of All Time).",
    difficulty: "easy",
    category: "football",
    imageUrl: "/joe-montana-49ers.png",
    imageAlt: "Jerry Rice making a catch for the 49ers",
  },
  {
    id: "fb-10",
    question: "What is the name of the 49ers' famous play in the 1981 NFC Championship Game?",
    options: ["The Drive", "The Catch", "The Fumble", "The Tackle"],
    correctAnswer: 1,
    explanation:
      "'The Catch' refers to Dwight Clark's game-winning touchdown reception from Joe Montana against the Dallas Cowboys.",
    difficulty: "medium",
    category: "football",
    imageUrl: "/49ers-super-bowl-xxiii.png",
    imageAlt: "Dwight Clark making 'The Catch'",
  },
]

// Baseball trivia questions
const baseballQuestions = [
  {
    id: "bb-1",
    question: "In what year did the Giants move to San Francisco from New York?",
    options: ["1952", "1958", "1962", "1970"],
    correctAnswer: 1,
    explanation: "The Giants moved from New York to San Francisco in 1958.",
    difficulty: "medium",
    category: "baseball",
    imageUrl: "/giants-move-1958.png",
    imageAlt: "Historic image of the Giants' move to San Francisco",
  },
  {
    id: "bb-2",
    question: "What is the name of the San Francisco Giants' home ballpark?",
    options: ["AT&T Park", "Oracle Park", "Candlestick Park", "PacBell Park"],
    correctAnswer: 1,
    explanation: "Oracle Park (formerly AT&T Park and PacBell Park) has been the Giants' home since 2000.",
    difficulty: "easy",
    category: "baseball",
    imageUrl: "/oracle-park-giants.png",
    imageAlt: "Oracle Park, home of the San Francisco Giants",
  },
  {
    id: "bb-3",
    question: "How many World Series championships have the San Francisco Giants won?",
    options: ["1", "3", "5", "8"],
    correctAnswer: 1,
    explanation: "The San Francisco Giants have won 3 World Series championships (2010, 2012, and 2014).",
    difficulty: "easy",
    category: "baseball",
    imageUrl: "/oracle-park-giants.png",
    imageAlt: "San Francisco Giants celebrating a World Series victory",
  },
  {
    id: "bb-4",
    question: "Which Giants player hit 73 home runs in a single season, setting an MLB record?",
    options: ["Willie Mays", "Willie McCovey", "Barry Bonds", "Buster Posey"],
    correctAnswer: 2,
    explanation: "Barry Bonds hit 73 home runs in 2001, setting the MLB single-season record.",
    difficulty: "easy",
    category: "baseball",
    imageUrl: "/barry-bonds-giants-record.png",
    imageAlt: "Barry Bonds hitting a home run for the Giants",
  },
  {
    id: "bb-5",
    question: "What is the nickname of the Giants' home ballpark on San Francisco Bay?",
    options: ["The Yard", "The Box", "The Cove", "The Bay"],
    correctAnswer: 0,
    explanation: "Oracle Park is often referred to as 'The Yard' by locals and fans.",
    difficulty: "medium",
    category: "baseball",
    imageUrl: "/oracle-park-giants.png",
    imageAlt: "Oracle Park with San Francisco Bay in the background",
  },
]

// Basketball trivia questions
const basketballQuestions = [
  {
    id: "bk-1",
    question: "In what year did the Golden State Warriors move to San Francisco from Philadelphia?",
    options: ["1962", "1971", "1985", "1999"],
    correctAnswer: 0,
    explanation:
      "The Warriors moved from Philadelphia to San Francisco in 1962, and later became the Golden State Warriors in 1971.",
    difficulty: "medium",
    category: "basketball",
    imageUrl: "/chase-center-gsw.png",
    imageAlt: "Chase Center, home of the Golden State Warriors",
  },
  {
    id: "bk-2",
    question: "What is the name of the Golden State Warriors' home arena in San Francisco?",
    options: ["Oracle Arena", "Chase Center", "SAP Center", "Cow Palace"],
    correctAnswer: 1,
    explanation:
      "Chase Center has been the Warriors' home arena since 2019, after they moved from Oracle Arena in Oakland.",
    difficulty: "easy",
    category: "basketball",
    imageUrl: "/chase-center-gsw.png",
    imageAlt: "Chase Center in San Francisco",
  },
  {
    id: "bk-3",
    question: "How many NBA championships have the Golden State Warriors won since 2015?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation: "The Golden State Warriors have won 4 NBA championships since 2015 (2015, 2017, 2018, and 2022).",
    difficulty: "easy",
    category: "basketball",
    imageUrl: "/chase-center-gsw.png",
    imageAlt: "Golden State Warriors celebrating an NBA championship",
  },
  {
    id: "bk-4",
    question: "Which Warriors player is known as the 'Splash Brother' along with Klay Thompson?",
    options: ["Kevin Durant", "Draymond Green", "Stephen Curry", "Andrew Wiggins"],
    correctAnswer: 2,
    explanation:
      "Stephen Curry and Klay Thompson are known as the 'Splash Brothers' for their exceptional three-point shooting.",
    difficulty: "easy",
    category: "basketball",
    imageUrl: "/chase-center-gsw.png",
    imageAlt: "Stephen Curry shooting a three-pointer",
  },
  {
    id: "bk-5",
    question: "In what year did the Warriors move from Oakland to San Francisco?",
    options: ["2017", "2018", "2019", "2020"],
    correctAnswer: 2,
    explanation: "The Warriors moved from Oracle Arena in Oakland to Chase Center in San Francisco in 2019.",
    difficulty: "medium",
    category: "basketball",
    imageUrl: "/chase-center-gsw.png",
    imageAlt: "Aerial view of Chase Center in San Francisco",
  },
]

// San Francisco districts trivia questions
const districtsQuestions = [
  {
    id: "dist-1",
    question: "Which San Francisco district is known as 'Little Italy'?",
    options: ["Mission District", "North Beach", "Chinatown", "Nob Hill"],
    correctAnswer: 1,
    explanation: "North Beach is known as San Francisco's Little Italy, famous for its Italian restaurants and cafes.",
    difficulty: "medium",
    category: "districts",
    imageUrl: "/north-beach-italian-street.png",
    imageAlt: "Italian restaurants in North Beach, San Francisco",
  },
  {
    id: "dist-2",
    question: "Which district is home to the famous 'Painted Ladies' Victorian houses?",
    options: ["Haight-Ashbury", "Pacific Heights", "Alamo Square", "Noe Valley"],
    correctAnswer: 2,
    explanation:
      "The 'Painted Ladies' are located in Alamo Square, a residential neighborhood and park in San Francisco.",
    difficulty: "medium",
    category: "districts",
    imageUrl: "/mission-district-sf.png",
    imageAlt: "The Painted Ladies Victorian houses in Alamo Square",
  },
  {
    id: "dist-3",
    question: "Which San Francisco district is known for its Hispanic culture and murals?",
    options: ["Mission District", "Sunset District", "Richmond District", "Tenderloin"],
    correctAnswer: 0,
    explanation: "The Mission District is known for its Hispanic culture, colorful murals, and vibrant street art.",
    difficulty: "easy",
    category: "districts",
    imageUrl: "/mission-district-sf.png",
    imageAlt: "Colorful murals in the Mission District",
  },
  {
    id: "dist-4",
    question: "Which district is home to San Francisco's Japantown?",
    options: ["Western Addition", "Fillmore", "Pacific Heights", "Presidio"],
    correctAnswer: 0,
    explanation: "Japantown is located in the Western Addition district of San Francisco.",
    difficulty: "hard",
    category: "districts",
    imageUrl: "/mission-district-sf.png",
    imageAlt: "Japantown in San Francisco",
  },
  {
    id: "dist-5",
    question: "Which San Francisco district is known for its LGBTQ+ history and culture?",
    options: ["SoMa", "Castro", "Noe Valley", "Hayes Valley"],
    correctAnswer: 1,
    explanation: "The Castro District is known as a center of LGBTQ+ culture and activism in San Francisco.",
    difficulty: "easy",
    category: "districts",
    imageUrl: "/castro-rainbow-flags.png",
    imageAlt: "Rainbow flags in the Castro District",
  },
]

// San Francisco tourist spots trivia questions
const touristSpotsQuestions = [
  {
    id: "tour-1",
    question: "Which famous prison is located on an island in San Francisco Bay?",
    options: ["San Quentin", "Alcatraz", "Folsom", "Rikers Island"],
    correctAnswer: 1,
    explanation: "Alcatraz Island in San Francisco Bay was home to the infamous federal prison from 1934 to 1963.",
    difficulty: "easy",
    category: "tourist-spots",
    imageUrl: "/alcatraz-island-san-francisco.png",
    imageAlt: "Alcatraz Island in San Francisco Bay",
  },
  {
    id: "tour-2",
    question: "What is the name of the famous crooked street in San Francisco?",
    options: ["Market Street", "Lombard Street", "Powell Street", "California Street"],
    correctAnswer: 1,
    explanation: "Lombard Street is known as the 'crookedest street in the world' with its eight hairpin turns.",
    difficulty: "easy",
    category: "tourist-spots",
    imageUrl: "/lombard-street-crooked.png",
    imageAlt: "The famous winding section of Lombard Street",
  },
  {
    id: "tour-3",
    question: "Which famous San Francisco landmark has towers that rise 746 feet above the water?",
    options: ["Coit Tower", "Transamerica Pyramid", "Golden Gate Bridge", "Salesforce Tower"],
    correctAnswer: 2,
    explanation: "The Golden Gate Bridge's towers rise 746 feet above the water.",
    difficulty: "medium",
    category: "tourist-spots",
    imageUrl: "/golden-gate-bridge.png",
    imageAlt: "The Golden Gate Bridge in San Francisco",
  },
  {
    id: "tour-4",
    question: "What is the name of San Francisco's famous Chinatown entrance gate?",
    options: ["Dragon Gate", "Golden Gate", "Chinatown Gate", "Fortune Gate"],
    correctAnswer: 0,
    explanation: "The Dragon Gate marks the entrance to San Francisco's Chinatown on Grant Avenue.",
    difficulty: "medium",
    category: "tourist-spots",
    imageUrl: "/san-francisco-chinatown-gate.png",
    imageAlt: "The Dragon Gate entrance to San Francisco's Chinatown",
  },
  {
    id: "tour-5",
    question: "Which famous San Francisco square is known for high-end shopping?",
    options: ["Ghirardelli Square", "Union Square", "Portsmouth Square", "Washington Square"],
    correctAnswer: 1,
    explanation:
      "Union Square is San Francisco's premier shopping district with luxury retailers and department stores.",
    difficulty: "easy",
    category: "tourist-spots",
    imageUrl: "/union-square-san-francisco.png",
    imageAlt: "Union Square in San Francisco with shoppers and stores",
  },
]

// San Francisco day trips trivia questions
const dayTripsQuestions = [
  {
    id: "day-1",
    question: "Which famous wine region is a popular day trip from San Francisco?",
    options: ["Sonoma Valley", "Napa Valley", "Russian River Valley", "All of these"],
    correctAnswer: 3,
    explanation:
      "Sonoma Valley, Napa Valley, and Russian River Valley are all popular wine regions for day trips from San Francisco.",
    difficulty: "easy",
    category: "day-trips",
    imageUrl: "/napa-valley-vineyards.png",
    imageAlt: "Vineyards in Napa Valley, California",
  },
  {
    id: "day-2",
    question: "Which coastal town north of San Francisco is known for its houseboats and views?",
    options: ["Half Moon Bay", "Sausalito", "Tiburon", "Bolinas"],
    correctAnswer: 1,
    explanation: "Sausalito is known for its Richardson Bay houseboat community and beautiful views of San Francisco.",
    difficulty: "medium",
    category: "day-trips",
    imageUrl: "/sausalito-day-trip.png",
    imageAlt: "Houseboats and San Francisco view from Sausalito",
  },
  {
    id: "day-3",
    question: "Which national monument featuring redwood trees is close to San Francisco?",
    options: ["Muir Woods", "Sequoia National Park", "Big Basin", "Armstrong Redwoods"],
    correctAnswer: 0,
    explanation:
      "Muir Woods National Monument is located just north of San Francisco and features old-growth coast redwoods.",
    difficulty: "easy",
    category: "day-trips",
    imageUrl: "/muir-woods-day-trip.png",
    imageAlt: "Tall redwood trees in Muir Woods National Monument",
  },
  {
    id: "day-4",
    question: "Which famous aquarium is located about 2 hours south of San Francisco?",
    options: ["Steinhart Aquarium", "Aquarium of the Bay", "Monterey Bay Aquarium", "Long Beach Aquarium"],
    correctAnswer: 2,
    explanation: "The Monterey Bay Aquarium is a world-renowned facility located about 2 hours south of San Francisco.",
    difficulty: "medium",
    category: "day-trips",
    imageUrl: "/monterey-bay-aquarium-interior.png",
    imageAlt: "Inside the Monterey Bay Aquarium with fish tanks",
  },
  {
    id: "day-5",
    question: "Which state park features dramatic coastal cliffs and is a popular day trip?",
    options: ["Point Reyes", "Big Sur", "Mount Tamalpais", "Angel Island"],
    correctAnswer: 0,
    explanation:
      "Point Reyes National Seashore features dramatic coastal cliffs and is a popular day trip from San Francisco.",
    difficulty: "medium",
    category: "day-trips",
    imageUrl: "/muir-woods-day-trip.png",
    imageAlt: "Coastal cliffs at Point Reyes National Seashore",
  },
]

// Map game IDs to their respective question sets
const gameQuestions = {
  "sf-football": footballQuestions,
  "sf-baseball": baseballQuestions,
  "sf-basketball": basketballQuestions,
  "sf-districts": districtsQuestions,
  "sf-tourist-spots": touristSpotsQuestions,
  "sf-day-trips": dayTripsQuestions,
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

    // Get the appropriate question set for the requested game
    const questionSet = gameQuestions[gameId] || footballQuestions

    // Ensure all questions have valid image URLs
    const questionsWithImages = ensureImageUrls(questionSet)

    // Shuffle the questions and select the requested number
    const shuffled = [...questionsWithImages].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, questionsWithImages.length))

    // Generate a request ID for tracking
    const requestId = uuidv4()

    // Return the selected questions as JSON
    return NextResponse.json({
      questions: selected,
      source: "optimized",
      requestId,
    })
  } catch (error) {
    // Log the error without destructuring
    console.error("Error in trivia game questions API:", error)

    // Get fallback questions based on the game ID
    const url = new URL(req.url)
    const gameId = url.searchParams.get("gameId") || "sf-football"
    const fallbackSet = gameQuestions[gameId] || footballQuestions

    // Return a proper error response with fallback questions
    return NextResponse.json(
      {
        error: "Failed to generate trivia questions",
        questions: ensureImageUrls(fallbackSet.slice(0, 5)),
        source: "error-fallback",
      },
      { status: 500 },
    )
  }
}
