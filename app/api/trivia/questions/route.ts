import { NextResponse } from "next/server"

// Fully optimized trivia questions with verified image paths
const fallbackQuestions = [
  {
    question: "What year was the Golden Gate Bridge completed?",
    options: ["1937", "1927", "1947", "1957"],
    correctAnswer: 0,
    explanation: "The Golden Gate Bridge was completed in 1937 after four years of construction.",
    difficulty: "easy",
    category: "landmarks",
    imageUrl: "/golden-gate-bridge.png",
    imageAlt: "The Golden Gate Bridge in San Francisco",
  },
  {
    question: "Which famous prison is located on an island in San Francisco Bay?",
    options: ["Rikers Island", "San Quentin", "Alcatraz", "Folsom"],
    correctAnswer: 2,
    explanation: "Alcatraz Federal Penitentiary operated from 1934 to 1963 on Alcatraz Island in San Francisco Bay.",
    difficulty: "easy",
    category: "landmarks",
    imageUrl: "/alcatraz-prison-san-francisco.png",
    imageAlt: "Alcatraz prison on its island in San Francisco Bay",
  },
  {
    question: "What was the name of the 1906 natural disaster that devastated San Francisco?",
    options: ["Great Quake", "San Francisco Tremor", "Golden Gate Disaster", "California Shaker"],
    correctAnswer: 0,
    explanation: "The Great Quake of 1906 caused devastating fires and destroyed over 80% of the city.",
    difficulty: "medium",
    category: "history",
    imageUrl: "/1906-san-francisco-earthquake.png",
    imageAlt: "Aftermath of the 1906 San Francisco earthquake",
  },
  {
    question: "Which famous San Francisco neighborhood is known for its LGBT history and activism?",
    options: ["Haight-Ashbury", "Mission District", "Castro", "North Beach"],
    correctAnswer: 2,
    explanation:
      "The Castro District has been the center of LGBT activism and culture in San Francisco since the 1960s.",
    difficulty: "medium",
    category: "culture",
    imageUrl: "/castro-district-san-francisco.png",
    imageAlt: "The iconic Castro Theater in San Francisco's Castro District",
  },
  {
    question: "What is the name of San Francisco's famous cable car system?",
    options: ["Market Street Railway", "Muni Metro", "BART", "San Francisco Municipal Railway"],
    correctAnswer: 3,
    explanation:
      "San Francisco Municipal Railway (Muni) operates the historic cable car system, which is the last manually operated cable car system in the world.",
    difficulty: "easy",
    category: "transportation",
    imageUrl: "/san-francisco-cable-car.png",
    imageAlt: "A San Francisco cable car climbing up a hill",
  },
  {
    question: "Which famous San Francisco hill has eight sharp turns?",
    options: ["Nob Hill", "Russian Hill", "Telegraph Hill", "Lombard Street"],
    correctAnswer: 3,
    explanation:
      "Lombard Street is famous for its eight hairpin turns and is known as 'the most crooked street in the world.'",
    difficulty: "easy",
    category: "landmarks",
    imageUrl: "/lombard-street-san-francisco.png",
    imageAlt: "The famous winding section of Lombard Street with flowers and cars",
  },
  {
    question: "What is the name of the technology district in San Francisco?",
    options: ["Silicon Valley", "Tech Alley", "Digital District", "Silicon Hills"],
    correctAnswer: 0,
    explanation: "Silicon Valley, south of San Francisco, is home to many technology companies and startups.",
    difficulty: "medium",
    category: "culture",
    imageUrl: "/silicon-valley-tech.png",
    imageAlt: "Aerial view of tech company headquarters in Silicon Valley",
  },
  {
    question: "Which San Francisco neighborhood is known for its Italian heritage?",
    options: ["Chinatown", "North Beach", "Mission District", "Japantown"],
    correctAnswer: 1,
    explanation:
      "North Beach is San Francisco's Little Italy, known for its Italian restaurants, cafes, and cultural heritage.",
    difficulty: "medium",
    category: "culture",
    imageUrl: "/north-beach-italian-street.png",
    imageAlt: "Italian restaurants and cafes in San Francisco's North Beach neighborhood",
  },
  {
    question: "What is the name of the famous San Francisco sourdough bread company?",
    options: ["Golden Gate Bakery", "Boudin Bakery", "Francisco's Finest", "Bay Bread"],
    correctAnswer: 1,
    explanation:
      "Boudin Bakery has been making sourdough bread in San Francisco since 1849 using the same mother dough.",
    difficulty: "medium",
    category: "food",
    imageUrl: "/boudin-sourdough.png",
    imageAlt: "Boudin Bakery's famous sourdough bread in San Francisco",
  },
  {
    question: "Which famous event occurred in San Francisco's Golden Gate Park in 1967?",
    options: ["Moon Festival", "Summer of Love", "World's Fair", "Olympics"],
    correctAnswer: 1,
    explanation:
      "The Summer of Love in 1967 was a social phenomenon where thousands of hippies gathered in Golden Gate Park's Haight-Ashbury neighborhood.",
    difficulty: "hard",
    category: "history",
    imageUrl: "/summer-of-love-1967-san-francisco.png",
    imageAlt: "Hippies gathering during the 1967 Summer of Love in San Francisco",
  },
  {
    question: "What is the name of San Francisco's oldest building?",
    options: ["Coit Tower", "Mission Dolores", "Ferry Building", "Palace of Fine Arts"],
    correctAnswer: 1,
    explanation:
      "Mission Dolores (Mission San Francisco de Asís) was founded in 1776 and is the oldest surviving structure in San Francisco.",
    difficulty: "hard",
    category: "history",
    imageUrl: "/mission-dolores-san-francisco.png",
    imageAlt: "The historic Mission Dolores, San Francisco's oldest building",
  },
  {
    question: "What major event struck San Francisco in 1906?",
    options: ["Flood", "Earthquake and Fire", "Hurricane", "Economic Depression"],
    correctAnswer: 1,
    explanation:
      "The 1906 San Francisco earthquake and subsequent fires devastated the city, destroying over 80% of the city and killing thousands.",
    difficulty: "easy",
    category: "history",
    imageUrl: "/1906-san-francisco-aftermath.png",
    imageAlt: "Devastation from the 1906 San Francisco earthquake and fire",
  },
  {
    question: "Which famous chocolate company is headquartered in San Francisco?",
    options: ["Hershey's", "Godiva", "Ghirardelli", "Cadbury"],
    correctAnswer: 2,
    explanation:
      "Ghirardelli Chocolate Company was founded in San Francisco in 1852 and its headquarters and flagship store are still located in Ghirardelli Square.",
    difficulty: "medium",
    category: "business",
    imageUrl: "/ghirardelli-square-san-francisco.png",
    imageAlt: "Ghirardelli Square in San Francisco with its famous chocolate sign",
  },
  {
    question: "What is the name of the famous San Francisco sourdough bread bakery?",
    options: ["La Boulangerie", "Acme Bread", "Boudin Bakery", "Tartine"],
    correctAnswer: 2,
    explanation:
      "Boudin Bakery, established in 1849, is famous for its San Francisco sourdough bread, made from a mother dough (starter) that dates back to the Gold Rush.",
    difficulty: "medium",
    category: "food",
    imageUrl: "/boudin-bakery-san-francisco.png",
    imageAlt: "Boudin Bakery store at Fisherman's Wharf in San Francisco",
  },
  {
    question: "What year was San Francisco founded?",
    options: ["1776", "1835", "1849", "1906"],
    correctAnswer: 0,
    explanation:
      "San Francisco was founded on June 29, 1776, when colonists from Spain established the Presidio of San Francisco.",
    difficulty: "medium",
    category: "history",
    imageUrl: "/presidio-san-francisco-historical.png",
    imageAlt: "Historical image of the Presidio of San Francisco",
  },
]

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

    // Ensure all questions have valid image URLs
    const questionsWithImages = ensureImageUrls(fallbackQuestions)

    // Shuffle the questions and select the requested number
    const shuffled = [...questionsWithImages].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, questionsWithImages.length))

    // Return the selected questions as JSON
    return NextResponse.json({
      questions: selected,
      source: "optimized",
    })
  } catch (error) {
    // Log the error without destructuring
    console.error("Error in trivia questions API:", error)

    // Return a proper error response
    return NextResponse.json(
      {
        error: "Failed to generate trivia questions",
        questions: ensureImageUrls(fallbackQuestions.slice(0, 5)),
        source: "error-fallback",
      },
      { status: 500 },
    )
  }
}
