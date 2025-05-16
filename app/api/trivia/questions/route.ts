
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"

// Fully optimized trivia questions with verified image paths
const fallbackQuestions = [
  {
    id: "sf-1",
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
    id: "sf-2",
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
    id: "sf-3",
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
    id: "sf-4",
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
    id: "sf-5",
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
      source: "static",
    })
  } catch (error) {
    console.error("Error in trivia questions API:", error)

    // Return a proper error response with fallback questions
    return NextResponse.json(
      {
        error: "Failed to generate trivia questions",
        questions: ensureImageUrls(fallbackQuestions.slice(0, 5)),
        source: "error-fallback",
      },
      { status: 200 }, // Return 200 to allow the client to display the fallback questions
    )
  }
}
