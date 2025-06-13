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
  correctAnswer: number;
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
      correctAnswer: 0,
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
      correctAnswer: 1,
      explanation: "The 49ers moved to Levi's Stadium in Santa Clara in 2014.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/levis-stadium-49ers.png",
      imageAlt: "A wide shot of Levi's Stadium, home of the 49ers"
    },
    {
      id: "sf-football-3",
      gameId: "sf-football",
      question: "How many Super Bowl titles have the 49ers won?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2,
      explanation: "The 49ers won Super Bowls in 1981, 1984, 1988, 1989, and 1994.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/49ers-super-bowl-rings.png",
      imageAlt: "A collection of the five San Francisco 49ers Super Bowl rings"
    },
    {
      id: "sf-football-4",
      gameId: "sf-football",
      question: "Which legendary coach led the 49ers to multiple Super Bowl victories?",
      options: ["Bill Walsh", "Joe Montana", "Steve Young", "Jerry Rice"],
      correctAnswer: 0,
      explanation: "Bill Walsh coached the 49ers to three Super Bowl victories and revolutionized offensive football.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/bill-walsh-coach.png",
      imageAlt: "Portrait of legendary 49ers coach Bill Walsh"
    },
    {
      id: "sf-football-5",
      gameId: "sf-football",
      question: "What was the 49ers' previous home stadium before Levi's Stadium?",
      options: ["Kezar Stadium", "Candlestick Park", "Oakland Coliseum", "Cow Palace"],
      correctAnswer: 1,
      explanation: "The 49ers played at Candlestick Park from 1971 to 2013.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/candlestick-park-49ers.png",
      imageAlt: "An evening shot of the iconic Candlestick Park"
    },
    {
      id: "sf-football-6",
      gameId: "sf-football",
      question: "Which 49ers quarterback was known as 'Joe Cool'?",
      options: ["Steve Young", "Joe Montana", "Colin Kaepernick", "Alex Smith"],
      correctAnswer: 1,
      explanation: "Joe Montana earned the nickname 'Joe Cool' for his calm demeanor under pressure.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/joe-montana-cool.png",
      imageAlt: "Joe Montana, known as Joe Cool, on the 49ers sideline"
    },
    {
      id: "sf-football-7",
      gameId: "sf-football",
      question: "What are the 49ers' team colors?",
      options: ["Red and Gold", "Red and Silver", "Gold and Black", "Red and White"],
      correctAnswer: 0,
      explanation: "The 49ers' official colors are red and gold, representing the California Gold Rush.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/49ers-red-and-gold-logo.png",
      imageAlt: "The San Francisco 49ers red and gold team logo"
    },
    {
      id: "sf-football-8",
      gameId: "sf-football",
      question: "Which wide receiver was known as 'The Catch' for his famous touchdown?",
      options: ["Jerry Rice", "Dwight Clark", "John Taylor", "Terrell Owens"],
      correctAnswer: 1,
      explanation: "Dwight Clark made 'The Catch' in the 1981 NFC Championship game, sending the 49ers to their first Super Bowl.",
      difficulty: "hard",
      category: "Sports",
      imageUrl: "/dwight-clark-the-catch.png",
      imageAlt: "Dwight Clark making the iconic play known as 'The Catch'"
    }
  ],
  "sf-baseball": [
    {
      id: "sf-baseball-1",
      gameId: "sf-baseball",
      question: "Which MLB team plays at Oracle Park?",
      options: ["Giants", "Athletics", "Dodgers", "Padres"],
      correctAnswer: 0,
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
      correctAnswer: 1,
      explanation: "The stadium opened in 2000 as Pacific Bell Park, later renamed AT&T Park, then Oracle Park.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/oracle-park-history.png",
      imageAlt: "A historical photo of Oracle Park when it was named Pacific Bell Park"
    },
    {
      id: "sf-baseball-3",
      gameId: "sf-baseball",
      question: "How many World Series titles have the Giants won while in San Francisco?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2,
      explanation: "The Giants won World Series titles in 2010, 2012, and 2014 while in San Francisco.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/sf-giants-world-series-trophies.png",
      imageAlt: "The three World Series trophies won by the San Francisco Giants"
    },
    {
      id: "sf-baseball-4",
      gameId: "sf-baseball",
      question: "What is the famous feature beyond right field at Oracle Park?",
      options: ["McCovey Cove", "Splash Hit Zone", "Giants Bay", "Home Run Harbor"],
      correctAnswer: 0,
      explanation: "McCovey Cove is the body of water beyond right field where home run balls land.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/mccovey-cove-oracle-park.png",
      imageAlt: "Kayakers waiting for a splash hit in McCovey Cove at Oracle Park"
    },
    {
      id: "sf-baseball-5",
      gameId: "sf-baseball",
      question: "Which Giants player holds the single-season home run record?",
      options: ["Willie Mays", "Barry Bonds", "Willie McCovey", "Buster Posey"],
      correctAnswer: 1,
      explanation: "Barry Bonds hit 73 home runs in 2001, setting the MLB single-season record.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/barry-bonds-73-hr.png",
      imageAlt: "Barry Bonds hitting his record-breaking 73rd home run"
    },
    {
      id: "sf-baseball-6",
      gameId: "sf-baseball",
      question: "What year did the Giants move from New York to San Francisco?",
      options: ["1957", "1958", "1959", "1960"],
      correctAnswer: 1,
      explanation: "The Giants moved from New York to San Francisco in 1958.",
      difficulty: "hard",
      category: "Sports",
      imageUrl: "/giants-move-to-sf.png",
      imageAlt: "A vintage newspaper announcing the Giants' move to San Francisco"
    },
    {
      id: "sf-baseball-7",
      gameId: "sf-baseball",
      question: "Which Giants player was known as the 'Say Hey Kid'?",
      options: ["Willie Mays", "Willie McCovey", "Orlando Cepeda", "Juan Marichal"],
      correctAnswer: 0,
      explanation: "Willie Mays was nicknamed the 'Say Hey Kid' and is considered one of the greatest players ever.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/willie-mays-say-hey-kid.png",
      imageAlt: "A classic photo of the legendary Willie Mays, the 'Say Hey Kid'"
    },
    {
      id: "sf-baseball-8",
      gameId: "sf-baseball",
      question: "What is the capacity of Oracle Park?",
      options: ["38,000", "41,915", "45,000", "50,000"],
      correctAnswer: 1,
      explanation: "Oracle Park has a seating capacity of 41,915 for baseball games.",
      difficulty: "hard",
      category: "Sports",
      imageUrl: "/oracle-park-full-stadium.png",
      imageAlt: "A packed Oracle Park showing its full seating capacity"
    }
  ],
  "sf-basketball": [
    {
      id: "sf-basketball-1",
      gameId: "sf-basketball",
      question: "Which NBA team recently moved from Oakland to San Francisco?",
      options: ["Warriors", "Kings", "Lakers", "Clippers"],
      correctAnswer: 0,
      explanation: "The Golden State Warriors moved from Oakland to the Chase Center in San Francisco in 2019.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/chase-center-gsw.png",
      imageAlt: "The exterior of the modern Chase Center in San Francisco"
    },
    {
      id: "sf-basketball-2",
      gameId: "sf-basketball",
      question: "What is the name of the Warriors' arena in San Francisco?",
      options: ["Oracle Arena", "Chase Center", "Cow Palace", "War Memorial Gym"],
      correctAnswer: 1,
      explanation: "The Warriors play at Chase Center in the Mission Bay neighborhood of San Francisco.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/chase-center-gsw.png",
      imageAlt: "The exterior of the modern Chase Center in San Francisco"
    },
    {
      id: "sf-basketball-3",
      gameId: "sf-basketball",
      question: "How many NBA championships did the Warriors win between 2015-2022?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2,
      explanation: "The Warriors won NBA championships in 2015, 2017, 2018, and 2022.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/gsw-championship-rings.png",
      imageAlt: "The four NBA championship rings of the Golden State Warriors dynasty"
    },
    {
      id: "sf-basketball-4",
      gameId: "sf-basketball",
      question: "Which Warriors player holds the NBA record for most 3-pointers in a season?",
      options: ["Stephen Curry", "Klay Thompson", "Kevin Durant", "Draymond Green"],
      correctAnswer: 0,
      explanation: "Stephen Curry set the record with 402 three-pointers made in the 2015-16 season.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/steph-curry-3-pointer.png",
      imageAlt: "Stephen Curry shooting his signature three-point shot"
    },
    {
      id: "sf-basketball-5",
      gameId: "sf-basketball",
      question: "What nickname is given to the Warriors' backcourt duo?",
      options: ["Splash Brothers", "Warrior Twins", "Bay Bombers", "Golden Guards"],
      correctAnswer: 0,
      explanation: "Stephen Curry and Klay Thompson are known as the 'Splash Brothers' for their three-point shooting.",
      difficulty: "easy",
      category: "Sports",
      imageUrl: "/splash-brothers-curry-thompson.png",
      imageAlt: "Stephen Curry and Klay Thompson, the 'Splash Brothers', celebrating"
    },
    {
      id: "sf-basketball-6",
      gameId: "sf-basketball",
      question: "Before moving to San Francisco, what city were the Warriors based in?",
      options: ["Philadelphia", "San Diego", "Oakland", "San Jose"],
      correctAnswer: 2,
      explanation: "The Warriors were based in Oakland from 1971 to 2019.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/oracle-arena-oakland-gsw.png",
      imageAlt: "The exterior of Oracle Arena in Oakland, former home of the Warriors"
    },
    {
      id: "sf-basketball-7",
      gameId: "sf-basketball",
      question: "Who is the head coach that led the Warriors to their recent championships?",
      options: ["Mark Jackson", "Don Nelson", "Steve Kerr", "Alvin Gentry"],
      correctAnswer: 2,
      explanation: "Steve Kerr became head coach in 2014 and has led the team to four NBA titles.",
      difficulty: "medium",
      category: "Sports",
      imageUrl: "/steve-kerr-coach-gsw.png",
      imageAlt: "Head coach Steve Kerr directing the Golden State Warriors"
    },
    {
      id: "sf-basketball-8",
      gameId: "sf-basketball",
      question: "What iconic feature is the city of San Francisco known for?",
      options: ["Golden Gate Bridge", "Statue of Liberty", "Eiffel Tower", "Space Needle"],
      correctAnswer: 0,
      explanation: "The Golden Gate Bridge is San Francisco's most famous landmark.",
      difficulty: "easy",
      category: "General",
      imageUrl: "/golden-gate-bridge-sf.png",
      imageAlt: "The iconic Golden Gate Bridge at sunset"
    }
  ],
  "sf-districts": [
    {
      id: "sf-districts-1",
      gameId: "sf-districts",
      question: "Which San Francisco district is known for its Italian restaurants and cafes?",
      options: ["North Beach", "Mission", "Castro", "Haight"],
      correctAnswer: 0,
      explanation: "North Beach is San Francisco's Little Italy, known for its Italian restaurants and cafes.",
      difficulty: "easy",
      category: "Geography",
      imageUrl: "/north-beach-italian-street.png",
      imageAlt: "Italian restaurants and cafes in North Beach"
    },
    {
      id: "sf-districts-2",
      gameId: "sf-districts",
      question: "Which district is famous for the 1960s counterculture movement?",
      options: ["Haight-Ashbury", "Castro", "Mission", "SOMA"],
      correctAnswer: 0,
      explanation: "Haight-Ashbury was the center of the hippie movement and Summer of Love in 1967.",
      difficulty: "easy",
      category: "Geography",
      imageUrl: "/summer-of-love-1967-san-francisco.png",
      imageAlt: "Haight-Ashbury during the Summer of Love in 1967"
    },
    {
      id: "sf-districts-3",
      gameId: "sf-districts",
      question: "Which neighborhood is known as the heart of the LGBT community?",
      options: ["Castro", "Mission", "Hayes Valley", "Marina"],
      correctAnswer: 0,
      explanation: "The Castro District has been a symbol of gay rights and activism since the 1960s.",
      difficulty: "easy",
      category: "Geography",
      imageUrl: "/castro-rainbow-flags.png",
      imageAlt: "Rainbow flags in the Castro district"
    },
    {
      id: "sf-districts-4",
      gameId: "sf-districts",
      question: "Which district is famous for its Victorian houses and steep hills?",
      options: ["Pacific Heights", "Russian Hill", "Nob Hill", "All of the above"],
      correctAnswer: 3,
      explanation: "Pacific Heights, Russian Hill, and Nob Hill all feature iconic Victorian architecture and steep streets.",
      difficulty: "medium",
      category: "Geography",
      imageUrl: "/san-francisco-apartments.png",
      imageAlt: "Victorian houses on steep San Francisco hills"
    },
    {
      id: "sf-districts-5",
      gameId: "sf-districts",
      question: "What does SOMA stand for?",
      options: ["South of Market", "South of Marina", "South of Mission", "South of Montgomery"],
      correctAnswer: 0,
      explanation: "SOMA stands for 'South of Market' and is a major business and cultural district.",
      difficulty: "medium",
      category: "Geography",
      imageUrl: "/silicon-valley-tech.png",
      imageAlt: "Modern buildings in the SOMA district"
    },
    {
      id: "sf-districts-6",
      gameId: "sf-districts",
      question: "Which district is known for its vibrant murals and Latino culture?",
      options: ["The Mission", "The Castro", "Haight-Ashbury", "North Beach"],
      correctAnswer: 0,
      explanation: "The Mission District is famous for its colorful street art and deep Latino roots.",
      difficulty: "easy",
      category: "Geography",
      imageUrl: "/mission-district-sf.png",
      imageAlt: "Vibrant murals and culture in the Mission District"
    },
    {
      id: "sf-districts-7",
      gameId: "sf-districts",
      question: "Which district contains the famous Lombard Street?",
      options: ["Russian Hill", "Nob Hill", "Telegraph Hill", "Pacific Heights"],
      correctAnswer: 0,
      explanation: "The famously crooked section of Lombard Street is located in Russian Hill.",
      difficulty: "medium",
      category: "Geography",
      imageUrl: "/lombard-street-crooked.png",
      imageAlt: "The famous crooked Lombard Street in Russian Hill"
    },
    {
      id: "sf-districts-8",
      gameId: "sf-districts",
      question: "Which district is known for its stunning views of the Golden Gate Bridge?",
      options: ["The Presidio", "Golden Gate Park", "The Marina", "Fisherman's Wharf"],
      correctAnswer: 0,
      explanation: "The Presidio, a former military post, offers some of the most spectacular views of the Golden Gate Bridge.",
      difficulty: "medium",
      category: "Geography",
      imageUrl: "/golden-gate-bridge.png",
      imageAlt: "Stunning view of the Golden Gate Bridge from the Presidio"
    }
  ],
  "sf-tourist-spots": [
    {
      id: "sf-tourist-1",
      gameId: "sf-tourist-spots",
      question: "What is the famous prison located on Alcatraz Island?",
      options: ["Alcatraz Federal Penitentiary", "San Quentin", "Folsom Prison", "Pelican Bay"],
      correctAnswer: 0,
      explanation: "Alcatraz Federal Penitentiary was a maximum security federal prison on Alcatraz Island.",
      difficulty: "easy",
      category: "History",
      imageUrl: "/alcatraz-island-san-francisco.png",
      imageAlt: "The infamous Alcatraz Island prison in the San Francisco Bay"
    },
    {
      id: "sf-tourist-2",
      gameId: "sf-tourist-spots",
      question: "What year was the Golden Gate Bridge completed?",
      options: ["1935", "1937", "1939", "1941"],
      correctAnswer: 1,
      explanation: "The Golden Gate Bridge was completed in 1937 after four years of construction.",
      difficulty: "medium",
      category: "History"
    },
    {
      id: "sf-tourist-3",
      gameId: "sf-tourist-spots",
      question: "Which famous pier is known for its sea lions?",
      options: ["Pier 39", "Pier 15", "Pier 7", "Pier 1"],
      correctAnswer: 0,
      explanation: "Pier 39 is famous for its resident California sea lions that started gathering there in 1989.",
      difficulty: "easy",
      category: "Tourism"
    },
    {
      id: "sf-tourist-4",
      gameId: "sf-tourist-spots",
      question: "What is the name of San Francisco's famous crooked street?",
      options: ["Lombard Street", "Market Street", "Powell Street", "Grant Avenue"],
      correctAnswer: 0,
      explanation: "Lombard Street is known as the 'most crooked street in the world' with eight sharp turns.",
      difficulty: "easy",
      category: "Tourism"
    },
    {
      id: "sf-tourist-5",
      gameId: "sf-tourist-spots",
      question: "Which park is larger: Golden Gate Park or Central Park?",
      options: ["Golden Gate Park", "Central Park", "They're the same size", "Neither is a park"],
      correctAnswer: 0,
      explanation: "Golden Gate Park is about 20% larger than New York's Central Park.",
      difficulty: "medium",
      category: "Tourism"
    },
    {
      id: "sf-tourist-6",
      gameId: "sf-tourist-spots",
      question: "What type of transportation is unique to San Francisco?",
      options: ["Cable Cars", "Trolleys", "Subway", "Monorail"],
      correctAnswer: 0,
      explanation: "San Francisco's cable cars are the only moving National Historic Landmark.",
      difficulty: "easy",
      category: "Transportation"
    },
    {
      id: "sf-tourist-7",
      gameId: "sf-tourist-spots",
      question: "Which island is home to the former federal prison?",
      options: ["Alcatraz Island", "Angel Island", "Treasure Island", "Yerba Buena Island"],
      correctAnswer: 0,
      explanation: "Alcatraz Island housed the infamous federal penitentiary from 1934 to 1963.",
      difficulty: "easy",
      category: "History"
    },
    {
      id: "sf-tourist-8",
      gameId: "sf-tourist-spots",
      question: "What is the height of the Golden Gate Bridge towers?",
      options: ["693 feet", "746 feet", "800 feet", "850 feet"],
      correctAnswer: 1,
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
      correctAnswer: 0,
      explanation: "Both Napa Valley and Sonoma Valley are famous wine regions north of San Francisco.",
      difficulty: "easy",
      category: "Wine Country",
      imageUrl: "/napa-valley-vineyards.png",
      imageAlt: "Lush vineyards in the beautiful Napa Valley"
    },
    {
      id: "sf-day-trips-2",
      gameId: "sf-day-trips",
      question: "What national monument, located just north of the Golden Gate Bridge, is famous for its giant redwood trees?",
      options: ["Muir Woods", "Yosemite", "Redwood National Park", "Pinnacles National Park"],
      correctAnswer: 0,
      explanation: "Muir Woods National Monument is home to towering old-growth coast redwood trees.",
      difficulty: "easy",
      category: "Nature",
      imageUrl: "/muir-woods-redwoods.png",
      imageAlt: "Towering giant redwood trees in Muir Woods"
    },
    {
      id: "sf-day-trips-3",
      gameId: "sf-day-trips",
      question: "Which coastal town south of SF is known for its charming European-style architecture?",
      options: ["Carmel-by-the-Sea", "Santa Cruz", "Half Moon Bay", "Monterey"],
      correctAnswer: 0,
      explanation: "Carmel-by-the-Sea is a picturesque town known for its storybook cottages and art galleries.",
      difficulty: "medium",
      category: "Coastal Towns",
      imageUrl: "/carmel-by-the-sea.png",
      imageAlt: "A charming, storybook-style cottage in Carmel-by-the-Sea"
    },
    {
      id: "sf-day-trips-4",
      gameId: "sf-day-trips",
      question: "Which city, home to a famous university, is located across the bay from San Francisco?",
      options: ["Berkeley", "Oakland", "Palo Alto", "Sausalito"],
      correctAnswer: 0,
      explanation: "Berkeley is home to the University of California, Berkeley, and is located in the East Bay.",
      difficulty: "medium",
      category: "Cities",
      imageUrl: "/berkeley-university-campus.png",
      imageAlt: "The iconic Sather Tower on the UC Berkeley campus"
    },
    {
      id: "sf-day-trips-5",
      gameId: "sf-day-trips",
      question: "What scenic driving route runs along the coast south of San Francisco?",
      options: ["Highway 1", "Route 66", "Pacific Coast Highway", "Interstate 5"],
      correctAnswer: 0,
      explanation: "California State Route 1, also known as the Pacific Coast Highway, offers breathtaking coastal views.",
      difficulty: "easy",
      category: "Scenic Drives",
      imageUrl: "/highway-1-bixby-bridge.png",
      imageAlt: "A car driving along Highway 1 with the Bixby Bridge in the background"
    },
    {
      id: "sf-day-trips-6",
      gameId: "sf-day-trips",
      question: "Which seaside city is famous for its boardwalk amusement park and surfing culture?",
      options: ["Santa Cruz", "Half Moon Bay", "Capitola", "Pacifica"],
      correctAnswer: 0,
      explanation: "Santa Cruz is well-known for its historic boardwalk, surfing spots, and laid-back vibe.",
      difficulty: "medium",
      category: "Coastal Towns",
      imageUrl: "/santa-cruz-boardwalk.png",
      imageAlt: "The roller coaster at the Santa Cruz Beach Boardwalk"
    },
    {
      id: "sf-day-trips-7",
      gameId: "sf-day-trips",
      question: "What is the main attraction in the city of Monterey?",
      options: ["Monterey Bay Aquarium", "Cannery Row", "Fisherman's Wharf", "17-Mile Drive"],
      correctAnswer: 0,
      explanation: "The Monterey Bay Aquarium is a world-class aquarium renowned for its marine life exhibits.",
      difficulty: "medium",
      category: "Attractions",
      imageUrl: "/monterey-bay-aquarium.png",
      imageAlt: "The stunning Open Sea exhibit at the Monterey Bay Aquarium"
    },
    {
      id: "sf-day-trips-8",
      gameId: "sf-day-trips",
      question: "Which waterfront town is known for its houseboats and views of San Francisco?",
      options: ["Sausalito", "Tiburon", "Muir Beach", "Stinson Beach"],
      correctAnswer: 0,
      explanation: "Sausalito, just across the Golden Gate Bridge, is famous for its artistic houseboat communities and stunning city views.",
      difficulty: "medium",
      category: "Cities",
      imageUrl: "/sausalito-houseboats.png",
      imageAlt: "Colorful houseboats docked in Sausalito, with the San Francisco skyline in the distance"
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
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId") as GameId;
    const count = parseInt(searchParams.get("count") || "8");

    if (!gameId || !ENHANCED_QUESTIONS[gameId]) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // Try to fetch from the database first
    const { data: dbQuestions, error } = await supabase
      .from("trivia_questions")
      .select("*")
      .eq("game_id", gameId);

    if (error || !dbQuestions || dbQuestions.length === 0) {
      console.error("Database fetch failed, using static fallback:");
    } else {
      // Transform database format to our interface
      const transformedQuestions: Question[] = dbQuestions.map((q: any) => ({
        id: q.id,
        gameId: gameId,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'),
        correctAnswer: q.correct_answer,
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
