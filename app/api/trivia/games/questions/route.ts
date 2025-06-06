import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export const dynamic = "force-dynamic";

type GameId =
  | "sf-football"
  | "sf-baseball"
  | "sf-basketball"
  | "sf-districts"
  | "sf-tourist-spots"
  | "sf-day-trips";

interface Question {
  id: string;
  gameId: GameId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  imageUrl?: string;
  imageAlt?: string;
}

// Enhanced static questions as fallback (8 per game, but database can have 100+)
const ENHANCED_QUESTIONS: Record<GameId, Question[]> = {
  "sf-football": [
    {
      id: "sf-football-1",
      gameId: "sf-football",
      question: "Which NFL team plays its home games in San Francisco?",
      options: ["49ers", "Raiders", "Giants", "Warriors"],
      correctAnswer: "49ers",
      explanation: "The San Francisco 49ers are the NFL team based in San Francisco.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/levis-stadium-49ers.png",
      imageAlt: "Levi's Stadium home of the San Francisco 49ers"
    },
    {
      id: "sf-football-2",
      gameId: "sf-football",
      question: "What is the name of the 49ers' home stadium?",
      options: ["Candlestick Park", "Levi's Stadium", "Oracle Park", "AT&T Park"],
      correctAnswer: "Levi's Stadium",
      explanation: "The 49ers moved to Levi's Stadium in Santa Clara in 2014.",
      difficulty: "easy",
      category: "Sports"
    },
    {
      id: "sf-football-3",
      gameId: "sf-football",
      question: "How many Super Bowl titles have the 49ers won?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      explanation: "The 49ers won Super Bowls in 1981, 1984, 1988, 1989, and 1994.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-football-4",
      gameId: "sf-football",
      question: "Which legendary coach led the 49ers to multiple Super Bowl victories?",
      options: ["Bill Walsh", "Joe Montana", "Steve Young", "Jerry Rice"],
      correctAnswer: "Bill Walsh",
      explanation: "Bill Walsh coached the 49ers to three Super Bowl victories and revolutionized offensive football.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-football-5",
      gameId: "sf-football",
      question: "What was the 49ers' previous home stadium before Levi's Stadium?",
      options: ["Kezar Stadium", "Candlestick Park", "Oakland Coliseum", "Cow Palace"],
      correctAnswer: "Candlestick Park",
      explanation: "The 49ers played at Candlestick Park from 1971 to 2013.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-football-6",
      gameId: "sf-football",
      question: "Which 49ers quarterback was known as 'Joe Cool'?",
      options: ["Steve Young", "Joe Montana", "Colin Kaepernick", "Alex Smith"],
      correctAnswer: "Joe Montana",
      explanation: "Joe Montana earned the nickname 'Joe Cool' for his calm demeanor under pressure.",
      difficulty: "easy",
      category: "Sports"
    },
    {
      id: "sf-football-7",
      gameId: "sf-football",
      question: "What are the 49ers' team colors?",
      options: ["Red and Gold", "Red and Silver", "Gold and Black", "Red and White"],
      correctAnswer: "Red and Gold",
      explanation: "The 49ers' official colors are red and gold, representing the California Gold Rush.",
      difficulty: "easy",
      category: "Sports"
    },
    {
      id: "sf-football-8",
      gameId: "sf-football",
      question: "Which wide receiver was known as 'The Catch' for his famous touchdown?",
      options: ["Jerry Rice", "Dwight Clark", "John Taylor", "Terrell Owens"],
      correctAnswer: "Dwight Clark",
      explanation: "Dwight Clark made 'The Catch' in the 1981 NFC Championship game, sending the 49ers to their first Super Bowl.",
      difficulty: "hard",
      category: "Sports"
    }
  ],
  "sf-baseball": [
    {
      id: "sf-baseball-1",
      gameId: "sf-baseball",
      question: "Which MLB team plays at Oracle Park?",
      options: ["Giants", "Athletics", "Dodgers", "Padres"],
      correctAnswer: "Giants",
      explanation: "The San Francisco Giants play their home games at Oracle Park.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/oracle-park-giants.png",
      imageAlt: "Oracle Park home of the San Francisco Giants"
    },
    {
      id: "sf-baseball-2",
      gameId: "sf-baseball",
      question: "What was Oracle Park originally called when it opened?",
      options: ["AT&T Park", "Pacific Bell Park", "SBC Park", "Candlestick Park"],
      correctAnswer: "Pacific Bell Park",
      explanation: "The stadium opened in 2000 as Pacific Bell Park, later renamed AT&T Park, then Oracle Park.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-baseball-3",
      gameId: "sf-baseball",
      question: "How many World Series titles have the Giants won while in San Francisco?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "3",
      explanation: "The Giants won World Series titles in 2010, 2012, and 2014 while in San Francisco.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-baseball-4",
      gameId: "sf-baseball",
      question: "What is the famous feature beyond right field at Oracle Park?",
      options: ["McCovey Cove", "Splash Hit Zone", "Giants Bay", "Home Run Harbor"],
      correctAnswer: "McCovey Cove",
      explanation: "McCovey Cove is the body of water beyond right field where home run balls land.",
      difficulty: "easy",
      category: "Sports"
    },
    {
      id: "sf-baseball-5",
      gameId: "sf-baseball",
      question: "Which Giants player holds the single-season home run record?",
      options: ["Willie Mays", "Barry Bonds", "Willie McCovey", "Buster Posey"],
      correctAnswer: "Barry Bonds",
      explanation: "Barry Bonds hit 73 home runs in 2001, setting the MLB single-season record.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-baseball-6",
      gameId: "sf-baseball",
      question: "What year did the Giants move from New York to San Francisco?",
      options: ["1957", "1958", "1959", "1960"],
      correctAnswer: "1958",
      explanation: "The Giants moved from New York to San Francisco in 1958.",
      difficulty: "hard",
      category: "Sports"
    },
    {
      id: "sf-baseball-7",
      gameId: "sf-baseball",
      question: "Which Giants player was known as the 'Say Hey Kid'?",
      options: ["Willie Mays", "Willie McCovey", "Orlando Cepeda", "Juan Marichal"],
      correctAnswer: "Willie Mays",
      explanation: "Willie Mays was nicknamed the 'Say Hey Kid' and is considered one of the greatest players ever.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-baseball-8",
      gameId: "sf-baseball",
      question: "What is the capacity of Oracle Park?",
      options: ["38,000", "41,915", "45,000", "50,000"],
      correctAnswer: "41,915",
      explanation: "Oracle Park has a seating capacity of 41,915 for baseball games.",
      difficulty: "hard",
      category: "Sports"
    }
  ],
  "sf-basketball": [
    {
      id: "sf-basketball-1",
      gameId: "sf-basketball",
      question: "Which NBA team recently moved from Oakland to San Francisco?",
      options: ["Warriors", "Kings", "Lakers", "Clippers"],
      correctAnswer: "Warriors",
      explanation: "The Golden State Warriors moved from Oakland to the Chase Center in San Francisco in 2019.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/chase-center-gsw.png",
      imageAlt: "Chase Center home of the Golden State Warriors"
    },
    {
      id: "sf-basketball-2",
      gameId: "sf-basketball",
      question: "What is the name of the Warriors' arena in San Francisco?",
      options: ["Oracle Arena", "Chase Center", "Cow Palace", "War Memorial Gym"],
      correctAnswer: "Chase Center",
      explanation: "The Warriors play at Chase Center in the Mission Bay neighborhood of San Francisco.",
      difficulty: "easy",
      category: "Sports"
    },
    {
      id: "sf-basketball-3",
      gameId: "sf-basketball",
      question: "How many NBA championships did the Warriors win between 2015-2022?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
      explanation: "The Warriors won NBA championships in 2015, 2017, 2018, and 2022.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-basketball-4",
      gameId: "sf-basketball",
      question: "Which Warriors player holds the NBA record for most 3-pointers in a season?",
      options: ["Stephen Curry", "Klay Thompson", "Kevin Durant", "Draymond Green"],
      correctAnswer: "Stephen Curry",
      explanation: "Stephen Curry set the record with 402 three-pointers made in the 2015-16 season.",
      difficulty: "medium",
      category: "Sports"
    },
    {
      id: "sf-basketball-5",
      gameId: "sf-basketball",
      question: "What nickname is given to the Warriors' backcourt duo?",
      options: ["Splash Brothers", "Warrior Twins", "Bay Bombers", "Golden Guards"],
      correctAnswer: "Splash Brothers",
      explanation: "Stephen Curry and Klay Thompson are known as the 'Splash Brothers' for their three-point shooting.",
      difficulty: "easy",
      category: "Sports"
    },
    {
      id: "sf-basketball-6",
      gameId: "sf-basketball",
      question: "In what year did the Warriors first win an NBA championship in the modern era?",
      options: ["1975", "2015", "2017", "1947"],
      correctAnswer: "1975",
      explanation: "The Warriors won their first championship in the modern era in 1975, before their recent dynasty.",
      difficulty: "hard",
      category: "Sports"
    },
    {
      id: "sf-basketball-7",
      gameId: "sf-basketball",
      question: "What was the Warriors' regular season record in 2015-16?",
      options: ["67-15", "70-12", "73-9", "72-10"],
      correctAnswer: "73-9",
      explanation: "The Warriors set an NBA record with a 73-9 regular season record in 2015-16.",
      difficulty: "hard",
      category: "Sports"
    },
    {
      id: "sf-basketball-8",
      gameId: "sf-basketball",
      question: "Which Warriors coach led the team to multiple championships?",
      options: ["Steve Kerr", "Mark Jackson", "Don Nelson", "Rick Adelman"],
      correctAnswer: "Steve Kerr",
      explanation: "Steve Kerr has coached the Warriors to four NBA championships since 2014.",
      difficulty: "medium",
      category: "Sports"
    }
  ],
  "sf-districts": [
    {
      id: "sf-districts-1",
      gameId: "sf-districts",
      question: "Which San Francisco district is known for its Italian restaurants and cafes?",
      options: ["North Beach", "Mission", "Castro", "Haight"],
      correctAnswer: "North Beach",
      explanation: "North Beach is San Francisco's Little Italy, known for its Italian restaurants and cafes.",
      difficulty: "easy",
      category: "Geography",
      imageUrl: "/mission-district-sf.png",
      imageAlt: "Colorful buildings in San Francisco's Mission District"
    },
    {
      id: "sf-districts-2",
      gameId: "sf-districts",
      question: "Which district is famous for the 1960s counterculture movement?",
      options: ["Haight-Ashbury", "Castro", "Mission", "SOMA"],
      correctAnswer: "Haight-Ashbury",
      explanation: "Haight-Ashbury was the center of the hippie movement and Summer of Love in 1967.",
      difficulty: "easy",
      category: "Geography"
    },
    {
      id: "sf-districts-3",
      gameId: "sf-districts",
      question: "Which neighborhood is known as the heart of the LGBT community?",
      options: ["Castro", "Mission", "Hayes Valley", "Marina"],
      correctAnswer: "Castro",
      explanation: "The Castro District has been a symbol of gay rights and activism since the 1960s.",
      difficulty: "easy",
      category: "Geography"
    },
    {
      id: "sf-districts-4",
      gameId: "sf-districts",
      question: "Which district is famous for its Victorian houses and steep hills?",
      options: ["Pacific Heights", "Russian Hill", "Nob Hill", "All of the above"],
      correctAnswer: "All of the above",
      explanation: "Pacific Heights, Russian Hill, and Nob Hill all feature iconic Victorian architecture and steep streets.",
      difficulty: "medium",
      category: "Geography"
    },
    {
      id: "sf-districts-5",
      gameId: "sf-districts",
      question: "What does SOMA stand for?",
      options: ["South of Market", "South of Marina", "South of Mission", "South of Montgomery"],
      correctAnswer: "South of Market",
      explanation: "SOMA stands for 'South of Market' and is a major business and cultural district.",
      difficulty: "medium",
      category: "Geography"
    },
    {
      id: "sf-districts-6",
      gameId: "sf-districts",
      question: "Which neighborhood is known for its murals and Latino culture?",
      options: ["Mission District", "Excelsior", "Visitacion Valley", "Bayview"],
      correctAnswer: "Mission District",
      explanation: "The Mission District is famous for its vibrant murals and Latino heritage.",
      difficulty: "easy",
      category: "Geography"
    },
    {
      id: "sf-districts-7",
      gameId: "sf-districts",
      question: "Which district contains the famous Lombard Street?",
      options: ["Russian Hill", "Nob Hill", "Telegraph Hill", "Pacific Heights"],
      correctAnswer: "Russian Hill",
      explanation: "The famously crooked section of Lombard Street is located in Russian Hill.",
      difficulty: "medium",
      category: "Geography"
    },
    {
      id: "sf-districts-8",
      gameId: "sf-districts",
      question: "Which neighborhood is home to the largest Chinatown outside of Asia?",
      options: ["Chinatown", "Richmond", "Sunset", "Visitacion Valley"],
      correctAnswer: "Chinatown",
      explanation: "San Francisco's Chinatown is the oldest and largest Chinatown outside of Asia.",
      difficulty: "easy",
      category: "Geography"
    }
  ],
  "sf-tourist-spots": [
    {
      id: "sf-tourist-1",
      gameId: "sf-tourist-spots",
      question: "What is the famous prison located on Alcatraz Island?",
      options: ["Alcatraz Federal Penitentiary", "San Quentin", "Folsom Prison", "Pelican Bay"],
      correctAnswer: "Alcatraz Federal Penitentiary",
      explanation: "Alcatraz Federal Penitentiary was a maximum security federal prison on Alcatraz Island.",
      difficulty: "easy",
      category: "History",
      imageUrl: "/golden-gate-bridge.png",
      imageAlt: "The iconic Golden Gate Bridge"
    },
    {
      id: "sf-tourist-2",
      gameId: "sf-tourist-spots",
      question: "What year was the Golden Gate Bridge completed?",
      options: ["1935", "1937", "1939", "1941"],
      correctAnswer: "1937",
      explanation: "The Golden Gate Bridge was completed in 1937 after four years of construction.",
      difficulty: "medium",
      category: "History"
    },
    {
      id: "sf-tourist-3",
      gameId: "sf-tourist-spots",
      question: "Which famous pier is known for its sea lions?",
      options: ["Pier 39", "Pier 15", "Pier 7", "Pier 1"],
      correctAnswer: "Pier 39",
      explanation: "Pier 39 is famous for its resident California sea lions that started gathering there in 1989.",
      difficulty: "easy",
      category: "Tourism"
    },
    {
      id: "sf-tourist-4",
      gameId: "sf-tourist-spots",
      question: "What is the name of San Francisco's famous crooked street?",
      options: ["Lombard Street", "Market Street", "Powell Street", "Grant Avenue"],
      correctAnswer: "Lombard Street",
      explanation: "Lombard Street is known as the 'most crooked street in the world' with eight sharp turns.",
      difficulty: "easy",
      category: "Tourism"
    },
    {
      id: "sf-tourist-5",
      gameId: "sf-tourist-spots",
      question: "Which park is larger: Golden Gate Park or Central Park?",
      options: ["Golden Gate Park", "Central Park", "They're the same size", "Neither is a park"],
      correctAnswer: "Golden Gate Park",
      explanation: "Golden Gate Park is about 20% larger than New York's Central Park.",
      difficulty: "medium",
      category: "Tourism"
    },
    {
      id: "sf-tourist-6",
      gameId: "sf-tourist-spots",
      question: "What type of transportation is unique to San Francisco?",
      options: ["Cable Cars", "Trolleys", "Subway", "Monorail"],
      correctAnswer: "Cable Cars",
      explanation: "San Francisco's cable cars are the only moving National Historic Landmark.",
      difficulty: "easy",
      category: "Transportation"
    },
    {
      id: "sf-tourist-7",
      gameId: "sf-tourist-spots",
      question: "Which island is home to the former federal prison?",
      options: ["Alcatraz Island", "Angel Island", "Treasure Island", "Yerba Buena Island"],
      correctAnswer: "Alcatraz Island",
      explanation: "Alcatraz Island housed the infamous federal penitentiary from 1934 to 1963.",
      difficulty: "easy",
      category: "History"
    },
    {
      id: "sf-tourist-8",
      gameId: "sf-tourist-spots",
      question: "What is the height of the Golden Gate Bridge towers?",
      options: ["693 feet", "746 feet", "800 feet", "850 feet"],
      correctAnswer: "746 feet",
      explanation: "The Golden Gate Bridge towers rise 746 feet above the water.",
      difficulty: "hard",
      category: "History"
    }
  ],
  "sf-day-trips": [
    {
      id: "sf-day-trips-1",
      gameId: "sf-day-trips",
      question: "Which famous wine region is located north of San Francisco?",
      options: ["Napa Valley", "Sonoma Valley", "Both A and B", "Neither"],
      correctAnswer: "Both A and B",
      explanation: "Both Napa Valley and Sonoma Valley are famous wine regions north of San Francisco.",
      difficulty: "easy",
      category: "Geography",
      imageUrl: "/muir-woods-day-trip.png",
      imageAlt: "Towering redwood trees in Muir Woods"
    },
    {
      id: "sf-day-trips-2",
      gameId: "sf-day-trips",
      question: "What type of trees can you see at Muir Woods?",
      options: ["Redwoods", "Sequoias", "Pine Trees", "Oak Trees"],
      correctAnswer: "Redwoods",
      explanation: "Muir Woods National Monument protects old-growth coast redwood forests.",
      difficulty: "easy",
      category: "Nature"
    },
    {
      id: "sf-day-trips-3",
      gameId: "sf-day-trips",
      question: "Which coastal town is famous for its artichokes?",
      options: ["Castroville", "Half Moon Bay", "Pescadero", "Santa Cruz"],
      correctAnswer: "Castroville",
      explanation: "Castroville calls itself the 'Artichoke Capital of the World.'",
      difficulty: "medium",
      category: "Agriculture"
    },
    {
      id: "sf-day-trips-4",
      gameId: "sf-day-trips",
      question: "What is the approximate drive time to Monterey from San Francisco?",
      options: ["1 hour", "2 hours", "3 hours", "4 hours"],
      correctAnswer: "2 hours",
      explanation: "Monterey is approximately 2 hours south of San Francisco via Highway 101 or Highway 1.",
      difficulty: "medium",
      category: "Travel"
    },
    {
      id: "sf-day-trips-5",
      gameId: "sf-day-trips",
      question: "Which mountain offers great views of San Francisco?",
      options: ["Mount Tamalpais", "Mount Diablo", "Both A and B", "Mount Shasta"],
      correctAnswer: "Both A and B",
      explanation: "Both Mount Tamalpais (Marin County) and Mount Diablo (Contra Costa County) offer spectacular views of the Bay Area.",
      difficulty: "medium",
      category: "Nature"
    },
    {
      id: "sf-day-trips-6",
      gameId: "sf-day-trips",
      question: "Which coastal city is known for its annual Pumpkin Festival?",
      options: ["Half Moon Bay", "Pescadero", "Pacifica", "Capitola"],
      correctAnswer: "Half Moon Bay",
      explanation: "Half Moon Bay hosts the famous Art & Pumpkin Festival every October.",
      difficulty: "medium",
      category: "Events"
    },
    {
      id: "sf-day-trips-7",
      gameId: "sf-day-trips",
      question: "What is the name of the famous scenic drive along the coast?",
      options: ["Highway 1", "Highway 101", "Highway 280", "Highway 17"],
      correctAnswer: "Highway 1",
      explanation: "Highway 1 (Pacific Coast Highway) offers stunning coastal views from San Francisco to Los Angeles.",
      difficulty: "easy",
      category: "Travel"
    },
    {
      id: "sf-day-trips-8",
      gameId: "sf-day-trips",
      question: "Which university town is located south of San Francisco?",
      options: ["Palo Alto", "Berkeley", "Davis", "Santa Cruz"],
      correctAnswer: "Palo Alto",
      explanation: "Palo Alto is home to Stanford University and is about 1 hour south of San Francisco.",
      difficulty: "easy",
      category: "Education"
    }
  ]
};

// Function to shuffle array and get random subset
function getRandomQuestions(questions: Question[], count: number = 8): Question[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const gameId = url.searchParams.get("gameId") as GameId | null;
    const count = parseInt(url.searchParams.get("count") || "8");

    if (!gameId || !ENHANCED_QUESTIONS[gameId]) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // First try to fetch from database
    try {
      const { data: dbQuestions, error } = await supabase
        .from("trivia_questions")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: false });

      if (!error && dbQuestions && dbQuestions.length > 0) {
        // Transform database format to our interface
        const transformedQuestions: Question[] = dbQuestions.map((q: any) => ({
          id: q.id,
          gameId: gameId,
          question: q.question,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'),
          correctAnswer: Array.isArray(q.options) 
            ? q.options[q.correct_answer] 
            : JSON.parse(q.options || '[]')[q.correct_answer],
          explanation: q.explanation || "No explanation provided.",
          difficulty: q.difficulty || "medium",
          category: q.category || "General",
          imageUrl: q.image_url,
          imageAlt: q.image_alt,
        }));

        // Return random subset of database questions
        const selectedQuestions = getRandomQuestions(transformedQuestions, count);
        
        return NextResponse.json({
          success: true,
          questions: selectedQuestions,
          source: "database",
          totalAvailable: transformedQuestions.length,
        });
      }
    } catch (dbError) {
      console.error("Database fetch failed, using static fallback:", dbError);
    }

    // Fallback to enhanced static questions
    const staticQuestions = ENHANCED_QUESTIONS[gameId];
    const selectedQuestions = getRandomQuestions(staticQuestions, Math.min(count, staticQuestions.length));

    return NextResponse.json({
      success: true,
      questions: selectedQuestions,
      source: "static",
      totalAvailable: staticQuestions.length,
    });

  } catch (error) {
    console.error("Error fetching trivia questions:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
