export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

// Static fallback questions with proper Unsplash URLs
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
    imageUrl: "https://source.unsplash.com/800x600/?courthouse,justice",
    imageAlt: "San Francisco courthouse",
  },
  {
    id: "2",
    question:
      "Which of these is a requirement to become a San Francisco Deputy Sheriff?",
    options: [
      "Must be at least 20 years old",
      "Must be at least 21 years old",
      "Must be at least 25 years old",
      "Must be at least 30 years old",
    ],
    correctAnswer: 1,
    explanation:
      "Candidates must be at least 21 years old to become a San Francisco Deputy Sheriff.",
    difficulty: "easy",
    category: "requirements",
    imageUrl: "https://source.unsplash.com/800x600/?badge,sheriff",
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
    imageUrl: "https://source.unsplash.com/800x600/?diploma,education",
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
    imageUrl: "https://source.unsplash.com/800x600/?courthouse,security",
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
    imageUrl: "https://source.unsplash.com/800x600/?san-francisco,map",
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
    imageUrl: "https://source.unsplash.com/800x600/?fitness,training",
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
    imageUrl: "https://source.unsplash.com/800x600/?academy,training",
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
    imageUrl: "https://source.unsplash.com/800x600/?legal,documents",
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
    imageUrl: "https://source.unsplash.com/800x600/?drivers-license,california",
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
    imageUrl: "https://source.unsplash.com/800x600/?jail,facility",
    imageAlt: "San Francisco County Jail",
  },
];

// Add fallback images for any missing image paths
const ensureImageUrls = (questions: TriviaQuestion[]): TriviaQuestion[] => {
  return questions.map((question) => {
    if (!question.imageUrl || question.imageUrl.includes("placeholder.svg") || question.imageUrl.startsWith("/")) {
      // Generate a placeholder image based on question content
      const keywords = question.category || "sheriff";
      return {
        ...question,
        imageUrl: `https://source.unsplash.com/800x600/?${keywords}`,
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
    const gameId = url.searchParams.get("gameId") || "sf-district";

    // Try to fetch questions from database first
    try {
      const { data: dbQuestions, error } = await supabase
        .from('trivia_questions')
        .select('*')
        .eq('category', gameId === 'sf-district' ? 'general' : gameId)
        .limit(count);

      if (!error && dbQuestions && dbQuestions.length > 0) {
        // Transform database questions to match our interface
        const transformedQuestions: TriviaQuestion[] = dbQuestions.map((q: any) => ({
          id: q.id.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          category: q.category,
          imageUrl: q.imageUrl || `https://source.unsplash.com/800x600/?${q.category || 'sheriff'}`,
          imageAlt: q.imageAlt || `Image related to ${q.category || 'sheriff'} question`,
        }));

        // Ensure all questions have valid image URLs
        const questionsWithImages = ensureImageUrls(transformedQuestions);

        return NextResponse.json({
          questions: questionsWithImages,
          source: "database",
        });
      }
    } catch (dbError) {
      console.error("Database error, falling back to static questions:", dbError);
    }

    // Fallback to static questions if database fails
    const questionsWithImages = ensureImageUrls(fallbackQuestions);
    const selected = questionsWithImages.slice(
      0,
      Math.min(count, questionsWithImages.length),
    );

    return NextResponse.json({
      questions: selected,
      source: "static-fallback",
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