export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server";

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
}

// Generate static paths for common parameter combinations
export function generateStaticParams() {
  const counts = [5, 10, 15, 20];
  return counts.map((count) => ({ count: count.toString() }));
}

// Static fallback questions
const fallbackQuestions: TriviaQuestion[] = [
  {
    id: "1",
    question: "What is the primary role of a San Francisco Deputy Sheriff?",
    options: [
      "Maintain security in courts and jails",
      "Direct traffic",
      "Issue parking tickets",
      "Patrol beaches",
    ],
    correctAnswer: 0,
    explanation:
      "San Francisco Deputy Sheriffs primarily maintain security in courts and jails, ensuring public safety in these critical facilities.",
    difficulty: "easy",
    category: "general",
    imageUrl: "/images/courthouse.jpg",
    imageAlt: "San Francisco courthouse",
  },
  {
    id: "2",
    question:
      "Which of these is a requirement to become a San Francisco Deputy Sheriff?",
    options: [
      "Must be at least 18 years old",
      "Must be at least 21 years old",
      "Must be at least 25 years old",
      "Must be at least 30 years old",
    ],
    correctAnswer: 1,
    explanation:
      "Candidates must be at least 21 years old to become a San Francisco Deputy Sheriff.",
    difficulty: "easy",
    category: "requirements",
    imageUrl: "/images/badge.jpg",
    imageAlt: "San Francisco Deputy Sheriff badge",
  },
  {
    id: "3",
    question:
      "What is the minimum education requirement for a San Francisco Deputy Sheriff?",
    options: [
      "High school diploma or equivalent",
      "Associate's degree",
      "Bachelor's degree",
      "Master's degree",
    ],
    correctAnswer: 0,
    explanation:
      "A high school diploma or equivalent is the minimum education requirement for becoming a San Francisco Deputy Sheriff.",
    difficulty: "easy",
    category: "requirements",
    imageUrl: "/images/diploma.jpg",
    imageAlt: "High school diploma",
  },
  {
    id: "4",
    question:
      "Which of these is NOT a typical duty of a San Francisco Deputy Sheriff?",
    options: [
      "Court security",
      "Jail operations",
      "Traffic enforcement",
      "Civil process service",
    ],
    correctAnswer: 2,
    explanation:
      "Traffic enforcement is primarily handled by SFPD, not the Sheriff's Department.",
    difficulty: "medium",
    category: "duties",
    imageUrl: "/images/courthouse-security.jpg",
    imageAlt: "Deputy providing courthouse security",
  },
  {
    id: "5",
    question:
      "What is the San Francisco Sheriff's Department's primary jurisdiction?",
    options: [
      "City and County of San Francisco",
      "Bay Area",
      "Northern California",
      "State of California",
    ],
    correctAnswer: 0,
    explanation:
      "The San Francisco Sheriff's Department's primary jurisdiction is the City and County of San Francisco.",
    difficulty: "easy",
    category: "general",
    imageUrl: "/images/sf-map.jpg",
    imageAlt: "Map of San Francisco",
  },
  {
    id: "6",
    question:
      "Which physical fitness test is required for Deputy Sheriff candidates?",
    options: [
      "POST",
      "SFPD fitness test",
      "Military fitness test",
      "FBI fitness test",
    ],
    correctAnswer: 0,
    explanation:
      "Candidates must pass the POST (Peace Officer Standards and Training) physical fitness test.",
    difficulty: "medium",
    category: "requirements",
    imageUrl: "/images/fitness-test.jpg",
    imageAlt: "Physical fitness test",
  },
  {
    id: "7",
    question: "What is the length of the Deputy Sheriff training academy?",
    options: ["3 months", "6 months", "9 months", "12 months"],
    correctAnswer: 1,
    explanation:
      "The Deputy Sheriff training academy is approximately 6 months long.",
    difficulty: "medium",
    category: "training",
    imageUrl: "/images/academy.jpg",
    imageAlt: "Sheriff's academy training",
  },
  {
    id: "8",
    question:
      "Which of these is a key responsibility of Deputy Sheriffs in civil law enforcement?",
    options: [
      "Serving eviction notices",
      "Writing traffic tickets",
      "Investigating homicides",
      "Conducting drug raids",
    ],
    correctAnswer: 0,
    explanation:
      "Serving eviction notices and other civil papers is a key civil law enforcement responsibility of Deputy Sheriffs.",
    difficulty: "medium",
    category: "duties",
    imageUrl: "/images/civil-service.jpg",
    imageAlt: "Deputy serving civil papers",
  },
  {
    id: "9",
    question:
      "What type of driver's license is required to become a Deputy Sheriff?",
    options: [
      "Standard Class C",
      "Commercial Class A",
      "Commercial Class B",
      "Motorcycle license",
    ],
    correctAnswer: 0,
    explanation:
      "A valid standard Class C driver's license is required to become a Deputy Sheriff.",
    difficulty: "easy",
    category: "requirements",
    imageUrl: "/images/drivers-license.jpg",
    imageAlt: "California driver's license",
  },
  {
    id: "10",
    question:
      "Which facility does the San Francisco Sheriff's Department NOT operate?",
    options: [
      "County Jail #2",
      "County Jail #4",
      "Juvenile Hall",
      "County Jail #5",
    ],
    correctAnswer: 2,
    explanation:
      "Juvenile Hall is operated by the Juvenile Probation Department, not the Sheriff's Department.",
    difficulty: "hard",
    category: "facilities",
    imageUrl: "/images/jail.jpg",
    imageAlt: "San Francisco County Jail",
  },
];

// Add fallback images for any missing image paths
const ensureImageUrls = (questions: TriviaQuestion[]): TriviaQuestion[] => {
  return questions.map((question) => {
    if (!question.imageUrl || question.imageUrl.includes("placeholder.svg")) {
      // Generate a placeholder image based on question content
      return {
        ...question,
        imageUrl: `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(question.question)}`,
        imageAlt:
          question.imageAlt ||
          `Image related to question: ${question.question}`,
      };
    }
    return question;
  });
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const count = Number.parseInt(url.searchParams.get("count") || "5", 10);

    // Ensure all questions have valid image URLs
    const questionsWithImages = ensureImageUrls(fallbackQuestions);

    // For static generation, we'll return a deterministic set based on count
    // This ensures the same questions are returned for the same count parameter
    const selected = questionsWithImages.slice(
      0,
      Math.min(count, questionsWithImages.length),
    );

    // Return the selected questions as JSON
    return NextResponse.json({
      questions: selected,
      source: "static",
    });
  } catch (error) {
    console.error("Error in trivia questions API:", error);

    // Return a proper error response with fallback questions
    return NextResponse.json(
      {
        error: "Failed to generate trivia questions",
        questions: ensureImageUrls(fallbackQuestions.slice(0, 5)),
        source: "error-fallback",
      },
      { status: 200 }, // Return 200 to allow the client to display the fallback questions
    );
  }
}
