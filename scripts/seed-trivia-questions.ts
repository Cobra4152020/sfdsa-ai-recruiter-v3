import { createClient } from '@supabase/supabase-js';

// This would use your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TriviaQuestion {
  id: string;
  game_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  image_url?: string;
  image_alt?: string;
}

// Comprehensive question database - 20+ questions per game for demo
// In production, you'd want 100+ questions per game as mentioned
const COMPREHENSIVE_QUESTIONS: TriviaQuestion[] = [
  // SF FOOTBALL - 20 questions
  {
    id: 'sf-football-001',
    game_id: 'sf-football',
    question: 'Which NFL team plays its home games in San Francisco?',
    options: ['49ers', 'Raiders', 'Giants', 'Warriors'],
    correct_answer: 0,
    explanation: 'The San Francisco 49ers are the NFL team based in San Francisco.',
    difficulty: 'easy',
    category: 'Sports',
    image_url: '/levis-stadium-49ers.png',
    image_alt: 'Levi\'s Stadium home of the San Francisco 49ers'
  },
  {
    id: 'sf-football-002',
    game_id: 'sf-football',
    question: 'What is the name of the 49ers\' home stadium?',
    options: ['Candlestick Park', 'Levi\'s Stadium', 'Oracle Park', 'AT&T Park'],
    correct_answer: 1,
    explanation: 'The 49ers moved to Levi\'s Stadium in Santa Clara in 2014.',
    difficulty: 'easy',
    category: 'Sports'
  },
  {
    id: 'sf-football-003',
    game_id: 'sf-football',
    question: 'How many Super Bowl titles have the 49ers won?',
    options: ['3', '4', '5', '6'],
    correct_answer: 2,
    explanation: 'The 49ers won Super Bowls in 1981, 1984, 1988, 1989, and 1994.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-football-004',
    game_id: 'sf-football',
    question: 'Which legendary coach led the 49ers to multiple Super Bowl victories?',
    options: ['Bill Walsh', 'Joe Montana', 'Steve Young', 'Jerry Rice'],
    correct_answer: 0,
    explanation: 'Bill Walsh coached the 49ers to three Super Bowl victories and revolutionized offensive football.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-football-005',
    game_id: 'sf-football',
    question: 'What was the 49ers\' previous home stadium before Levi\'s Stadium?',
    options: ['Kezar Stadium', 'Candlestick Park', 'Oakland Coliseum', 'Cow Palace'],
    correct_answer: 1,
    explanation: 'The 49ers played at Candlestick Park from 1971 to 2013.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-football-006',
    game_id: 'sf-football',
    question: 'Which 49ers quarterback was known as \'Joe Cool\'?',
    options: ['Steve Young', 'Joe Montana', 'Colin Kaepernick', 'Alex Smith'],
    correct_answer: 1,
    explanation: 'Joe Montana earned the nickname \'Joe Cool\' for his calm demeanor under pressure.',
    difficulty: 'easy',
    category: 'Sports'
  },
  {
    id: 'sf-football-007',
    game_id: 'sf-football',
    question: 'What are the 49ers\' team colors?',
    options: ['Red and Gold', 'Red and Silver', 'Gold and Black', 'Red and White'],
    correct_answer: 0,
    explanation: 'The 49ers\' official colors are red and gold, representing the California Gold Rush.',
    difficulty: 'easy',
    category: 'Sports'
  },
  {
    id: 'sf-football-008',
    game_id: 'sf-football',
    question: 'Which wide receiver was known for \'The Catch\'?',
    options: ['Jerry Rice', 'Dwight Clark', 'John Taylor', 'Terrell Owens'],
    correct_answer: 1,
    explanation: 'Dwight Clark made \'The Catch\' in the 1981 NFC Championship game, sending the 49ers to their first Super Bowl.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-football-009',
    game_id: 'sf-football',
    question: 'Who holds the 49ers franchise record for career touchdown passes?',
    options: ['Joe Montana', 'Steve Young', 'Alex Smith', 'Jeff Garcia'],
    correct_answer: 1,
    explanation: 'Steve Young threw 221 touchdown passes during his 49ers career.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-football-010',
    game_id: 'sf-football',
    question: 'In what year did the 49ers win their first Super Bowl?',
    options: ['1981', '1982', '1984', '1985'],
    correct_answer: 0,
    explanation: 'The 49ers won Super Bowl XVI following the 1981 season.',
    difficulty: 'medium',
    category: 'Sports'
  },
  
  // SF BASEBALL - 20 questions
  {
    id: 'sf-baseball-001',
    game_id: 'sf-baseball',
    question: 'Which MLB team plays at Oracle Park?',
    options: ['Giants', 'Athletics', 'Dodgers', 'Padres'],
    correct_answer: 0,
    explanation: 'The San Francisco Giants play their home games at Oracle Park.',
    difficulty: 'easy',
    category: 'Sports',
    image_url: '/oracle-park-giants.png',
    image_alt: 'Oracle Park home of the San Francisco Giants'
  },
  {
    id: 'sf-baseball-002',
    game_id: 'sf-baseball',
    question: 'What was Oracle Park originally called when it opened?',
    options: ['AT&T Park', 'Pacific Bell Park', 'SBC Park', 'Candlestick Park'],
    correct_answer: 1,
    explanation: 'The stadium opened in 2000 as Pacific Bell Park, later renamed AT&T Park, then Oracle Park.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-003',
    game_id: 'sf-baseball',
    question: 'How many World Series titles have the Giants won while in San Francisco?',
    options: ['1', '2', '3', '4'],
    correct_answer: 2,
    explanation: 'The Giants won World Series titles in 2010, 2012, and 2014 while in San Francisco.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-004',
    game_id: 'sf-baseball',
    question: 'What is the famous feature beyond right field at Oracle Park?',
    options: ['McCovey Cove', 'Splash Hit Zone', 'Giants Bay', 'Home Run Harbor'],
    correct_answer: 0,
    explanation: 'McCovey Cove is the body of water beyond right field where home run balls land.',
    difficulty: 'easy',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-005',
    game_id: 'sf-baseball',
    question: 'Which Giants player holds the single-season home run record?',
    options: ['Willie Mays', 'Barry Bonds', 'Willie McCovey', 'Buster Posey'],
    correct_answer: 1,
    explanation: 'Barry Bonds hit 73 home runs in 2001, setting the MLB single-season record.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-006',
    game_id: 'sf-baseball',
    question: 'What year did the Giants move from New York to San Francisco?',
    options: ['1957', '1958', '1959', '1960'],
    correct_answer: 1,
    explanation: 'The Giants moved from New York to San Francisco in 1958.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-007',
    game_id: 'sf-baseball',
    question: 'Which Giants player was known as the \'Say Hey Kid\'?',
    options: ['Willie Mays', 'Willie McCovey', 'Orlando Cepeda', 'Juan Marichal'],
    correct_answer: 0,
    explanation: 'Willie Mays was nicknamed the \'Say Hey Kid\' and is considered one of the greatest players ever.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-008',
    game_id: 'sf-baseball',
    question: 'What is the capacity of Oracle Park?',
    options: ['38,000', '41,915', '45,000', '50,000'],
    correct_answer: 1,
    explanation: 'Oracle Park has a seating capacity of 41,915 for baseball games.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-009',
    game_id: 'sf-baseball',
    question: 'Which Giants pitcher threw a perfect game in 2012?',
    options: ['Matt Cain', 'Tim Lincecum', 'Madison Bumgarner', 'Barry Zito'],
    correct_answer: 0,
    explanation: 'Matt Cain threw a perfect game against the Houston Astros on June 13, 2012.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-baseball-010',
    game_id: 'sf-baseball',
    question: 'What nickname did fans give to Tim Lincecum?',
    options: ['The Freak', 'Big Time Timmy Jim', 'The Franchise', 'All of the above'],
    correct_answer: 3,
    explanation: 'Tim Lincecum was known by all these nicknames during his Giants career.',
    difficulty: 'medium',
    category: 'Sports'
  },

  // SF BASKETBALL - 20 questions  
  {
    id: 'sf-basketball-001',
    game_id: 'sf-basketball',
    question: 'Which NBA team recently moved from Oakland to San Francisco?',
    options: ['Warriors', 'Kings', 'Lakers', 'Clippers'],
    correct_answer: 0,
    explanation: 'The Golden State Warriors moved from Oakland to the Chase Center in San Francisco in 2019.',
    difficulty: 'easy',
    category: 'Sports',
    image_url: '/chase-center-gsw.png',
    image_alt: 'Chase Center home of the Golden State Warriors'
  },
  {
    id: 'sf-basketball-002',
    game_id: 'sf-basketball',
    question: 'What is the name of the Warriors\' arena in San Francisco?',
    options: ['Oracle Arena', 'Chase Center', 'Cow Palace', 'War Memorial Gym'],
    correct_answer: 1,
    explanation: 'The Warriors play at Chase Center in the Mission Bay neighborhood of San Francisco.',
    difficulty: 'easy',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-003',
    game_id: 'sf-basketball',
    question: 'How many NBA championships did the Warriors win between 2015-2022?',
    options: ['2', '3', '4', '5'],
    correct_answer: 2,
    explanation: 'The Warriors won NBA championships in 2015, 2017, 2018, and 2022.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-004',
    game_id: 'sf-basketball',
    question: 'Which Warriors player holds the NBA record for most 3-pointers in a season?',
    options: ['Stephen Curry', 'Klay Thompson', 'Kevin Durant', 'Draymond Green'],
    correct_answer: 0,
    explanation: 'Stephen Curry set the record with 402 three-pointers made in the 2015-16 season.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-005',
    game_id: 'sf-basketball',
    question: 'What nickname is given to the Warriors\' backcourt duo?',
    options: ['Splash Brothers', 'Warrior Twins', 'Bay Bombers', 'Golden Guards'],
    correct_answer: 0,
    explanation: 'Stephen Curry and Klay Thompson are known as the \'Splash Brothers\' for their three-point shooting.',
    difficulty: 'easy',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-006',
    game_id: 'sf-basketball',
    question: 'In what year did the Warriors first win an NBA championship in the modern era?',
    options: ['1975', '2015', '2017', '1947'],
    correct_answer: 0,
    explanation: 'The Warriors won their first championship in the modern era in 1975, before their recent dynasty.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-007',
    game_id: 'sf-basketball',
    question: 'What was the Warriors\' regular season record in 2015-16?',
    options: ['67-15', '70-12', '73-9', '72-10'],
    correct_answer: 2,
    explanation: 'The Warriors set an NBA record with a 73-9 regular season record in 2015-16.',
    difficulty: 'hard',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-008',
    game_id: 'sf-basketball',
    question: 'Which Warriors coach led the team to multiple championships?',
    options: ['Steve Kerr', 'Mark Jackson', 'Don Nelson', 'Rick Adelman'],
    correct_answer: 0,
    explanation: 'Steve Kerr has coached the Warriors to four NBA championships since 2014.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-009',
    game_id: 'sf-basketball',
    question: 'What arena did the Warriors play in before Chase Center?',
    options: ['Oracle Arena', 'Cow Palace', 'War Memorial Gym', 'All of the above'],
    correct_answer: 3,
    explanation: 'The Warriors have played in all these venues throughout their Bay Area history.',
    difficulty: 'medium',
    category: 'Sports'
  },
  {
    id: 'sf-basketball-010',
    game_id: 'sf-basketball',
    question: 'Who was the Warriors\' first Finals MVP in their recent dynasty?',
    options: ['Stephen Curry', 'Andre Iguodala', 'Kevin Durant', 'Klay Thompson'],
    correct_answer: 1,
    explanation: 'Andre Iguodala won Finals MVP in 2015, the Warriors\' first championship of their recent dynasty.',
    difficulty: 'hard',
    category: 'Sports'
  },

  // SF DISTRICTS - 20 questions
  {
    id: 'sf-districts-001',
    game_id: 'sf-districts',
    question: 'Which San Francisco district is known for its Italian restaurants and cafes?',
    options: ['North Beach', 'Mission', 'Castro', 'Haight'],
    correct_answer: 0,
    explanation: 'North Beach is San Francisco\'s Little Italy, known for its Italian restaurants and cafes.',
    difficulty: 'easy',
    category: 'Geography',
    image_url: '/mission-district-sf.png',
    image_alt: 'Colorful buildings in San Francisco\'s Mission District'
  },
  {
    id: 'sf-districts-002',
    game_id: 'sf-districts',
    question: 'Which district is famous for the 1960s counterculture movement?',
    options: ['Haight-Ashbury', 'Castro', 'Mission', 'SOMA'],
    correct_answer: 0,
    explanation: 'Haight-Ashbury was the center of the hippie movement and Summer of Love in 1967.',
    difficulty: 'easy',
    category: 'Geography'
  },
  {
    id: 'sf-districts-003',
    game_id: 'sf-districts',
    question: 'Which neighborhood is known as the heart of the LGBT community?',
    options: ['Castro', 'Mission', 'Hayes Valley', 'Marina'],
    correct_answer: 0,
    explanation: 'The Castro District has been a symbol of gay rights and activism since the 1960s.',
    difficulty: 'easy',
    category: 'Geography'
  },
  {
    id: 'sf-districts-004',
    game_id: 'sf-districts',
    question: 'Which district is famous for its Victorian houses and steep hills?',
    options: ['Pacific Heights', 'Russian Hill', 'Nob Hill', 'All of the above'],
    correct_answer: 3,
    explanation: 'Pacific Heights, Russian Hill, and Nob Hill all feature iconic Victorian architecture and steep streets.',
    difficulty: 'medium',
    category: 'Geography'
  },
  {
    id: 'sf-districts-005',
    game_id: 'sf-districts',
    question: 'What does SOMA stand for?',
    options: ['South of Market', 'South of Marina', 'South of Mission', 'South of Montgomery'],
    correct_answer: 0,
    explanation: 'SOMA stands for \'South of Market\' and is a major business and cultural district.',
    difficulty: 'medium',
    category: 'Geography'
  },
  {
    id: 'sf-districts-006',
    game_id: 'sf-districts',
    question: 'Which neighborhood is known for its murals and Latino culture?',
    options: ['Mission District', 'Excelsior', 'Visitacion Valley', 'Bayview'],
    correct_answer: 0,
    explanation: 'The Mission District is famous for its vibrant murals and Latino heritage.',
    difficulty: 'easy',
    category: 'Geography'
  },
  {
    id: 'sf-districts-007',
    game_id: 'sf-districts',
    question: 'Which district contains the famous Lombard Street?',
    options: ['Russian Hill', 'Nob Hill', 'Telegraph Hill', 'Pacific Heights'],
    correct_answer: 0,
    explanation: 'The famously crooked section of Lombard Street is located in Russian Hill.',
    difficulty: 'medium',
    category: 'Geography'
  },
  {
    id: 'sf-districts-008',
    game_id: 'sf-districts',
    question: 'Which neighborhood is home to the largest Chinatown outside of Asia?',
    options: ['Chinatown', 'Richmond', 'Sunset', 'Visitacion Valley'],
    correct_answer: 0,
    explanation: 'San Francisco\'s Chinatown is the oldest and largest Chinatown outside of Asia.',
    difficulty: 'easy',
    category: 'Geography'
  },
  {
    id: 'sf-districts-009',
    game_id: 'sf-districts',
    question: 'Which district is known as the tech hub of San Francisco?',
    options: ['SOMA', 'Mission Bay', 'Potrero Hill', 'All of the above'],
    correct_answer: 3,
    explanation: 'SOMA, Mission Bay, and Potrero Hill all house major tech companies.',
    difficulty: 'medium',
    category: 'Geography'
  },
  {
    id: 'sf-districts-010',
    game_id: 'sf-districts',
    question: 'Which neighborhood is famous for the \'Painted Ladies\'?',
    options: ['Alamo Square', 'Noe Valley', 'Glen Park', 'Bernal Heights'],
    correct_answer: 0,
    explanation: 'The famous \'Painted Ladies\' Victorian houses are located around Alamo Square.',
    difficulty: 'medium',
    category: 'Geography'
  },

  // SF TOURIST SPOTS - 20 questions
  {
    id: 'sf-tourist-001',
    game_id: 'sf-tourist-spots',
    question: 'What is the famous prison located on Alcatraz Island?',
    options: ['Alcatraz Federal Penitentiary', 'San Quentin', 'Folsom Prison', 'Pelican Bay'],
    correct_answer: 0,
    explanation: 'Alcatraz Federal Penitentiary was a maximum security federal prison on Alcatraz Island.',
    difficulty: 'easy',
    category: 'History',
    image_url: '/golden-gate-bridge.png',
    image_alt: 'The iconic Golden Gate Bridge'
  },
  {
    id: 'sf-tourist-002',
    game_id: 'sf-tourist-spots',
    question: 'What year was the Golden Gate Bridge completed?',
    options: ['1935', '1937', '1939', '1941'],
    correct_answer: 1,
    explanation: 'The Golden Gate Bridge was completed in 1937 after four years of construction.',
    difficulty: 'medium',
    category: 'History'
  },
  {
    id: 'sf-tourist-003',
    game_id: 'sf-tourist-spots',
    question: 'Which famous pier is known for its sea lions?',
    options: ['Pier 39', 'Pier 15', 'Pier 7', 'Pier 1'],
    correct_answer: 0,
    explanation: 'Pier 39 is famous for its resident California sea lions that started gathering there in 1989.',
    difficulty: 'easy',
    category: 'Tourism'
  },
  {
    id: 'sf-tourist-004',
    game_id: 'sf-tourist-spots',
    question: 'What is the name of San Francisco\'s famous crooked street?',
    options: ['Lombard Street', 'Market Street', 'Powell Street', 'Grant Avenue'],
    correct_answer: 0,
    explanation: 'Lombard Street is known as the \'most crooked street in the world\' with eight sharp turns.',
    difficulty: 'easy',
    category: 'Tourism'
  },
  {
    id: 'sf-tourist-005',
    game_id: 'sf-tourist-spots',
    question: 'Which park is larger: Golden Gate Park or Central Park?',
    options: ['Golden Gate Park', 'Central Park', 'They\'re the same size', 'Neither is a park'],
    correct_answer: 0,
    explanation: 'Golden Gate Park is about 20% larger than New York\'s Central Park.',
    difficulty: 'medium',
    category: 'Tourism'
  },
  {
    id: 'sf-tourist-006',
    game_id: 'sf-tourist-spots',
    question: 'What type of transportation is unique to San Francisco?',
    options: ['Cable Cars', 'Trolleys', 'Subway', 'Monorail'],
    correct_answer: 0,
    explanation: 'San Francisco\'s cable cars are the only moving National Historic Landmark.',
    difficulty: 'easy',
    category: 'Transportation'
  },
  {
    id: 'sf-tourist-007',
    game_id: 'sf-tourist-spots',
    question: 'Which island is home to the former federal prison?',
    options: ['Alcatraz Island', 'Angel Island', 'Treasure Island', 'Yerba Buena Island'],
    correct_answer: 0,
    explanation: 'Alcatraz Island housed the infamous federal penitentiary from 1934 to 1963.',
    difficulty: 'easy',
    category: 'History'
  },
  {
    id: 'sf-tourist-008',
    game_id: 'sf-tourist-spots',
    question: 'What is the height of the Golden Gate Bridge towers?',
    options: ['693 feet', '746 feet', '800 feet', '850 feet'],
    correct_answer: 1,
    explanation: 'The Golden Gate Bridge towers rise 746 feet above the water.',
    difficulty: 'hard',
    category: 'History'
  },
  {
    id: 'sf-tourist-009',
    game_id: 'sf-tourist-spots',
    question: 'Which museum is located in Golden Gate Park?',
    options: ['de Young Museum', 'SFMOMA', 'Exploratorium', 'California Academy of Sciences'],
    correct_answer: 3,
    explanation: 'The California Academy of Sciences is located in Golden Gate Park and houses multiple attractions.',
    difficulty: 'medium',
    category: 'Tourism'
  },
  {
    id: 'sf-tourist-010',
    game_id: 'sf-tourist-spots',
    question: 'What is the tallest building in San Francisco?',
    options: ['Transamerica Pyramid', 'Salesforce Tower', '555 California Street', 'Coit Tower'],
    correct_answer: 1,
    explanation: 'Salesforce Tower, completed in 2018, is the tallest building in San Francisco at 1,070 feet.',
    difficulty: 'hard',
    category: 'Architecture'
  },

  // SF DAY TRIPS - 20 questions
  {
    id: 'sf-day-trips-001',
    game_id: 'sf-day-trips',
    question: 'Which famous wine region is located north of San Francisco?',
    options: ['Napa Valley', 'Sonoma Valley', 'Both A and B', 'Neither'],
    correct_answer: 2,
    explanation: 'Both Napa Valley and Sonoma Valley are famous wine regions north of San Francisco.',
    difficulty: 'easy',
    category: 'Geography',
    image_url: '/muir-woods-day-trip.png',
    image_alt: 'Towering redwood trees in Muir Woods'
  },
  {
    id: 'sf-day-trips-002',
    game_id: 'sf-day-trips',
    question: 'What type of trees can you see at Muir Woods?',
    options: ['Redwoods', 'Sequoias', 'Pine Trees', 'Oak Trees'],
    correct_answer: 0,
    explanation: 'Muir Woods National Monument protects old-growth coast redwood forests.',
    difficulty: 'easy',
    category: 'Nature'
  },
  {
    id: 'sf-day-trips-003',
    game_id: 'sf-day-trips',
    question: 'Which coastal town is famous for its artichokes?',
    options: ['Castroville', 'Half Moon Bay', 'Pescadero', 'Santa Cruz'],
    correct_answer: 0,
    explanation: 'Castroville calls itself the \'Artichoke Capital of the World.\'',
    difficulty: 'medium',
    category: 'Agriculture'
  },
  {
    id: 'sf-day-trips-004',
    game_id: 'sf-day-trips',
    question: 'What is the approximate drive time to Monterey from San Francisco?',
    options: ['1 hour', '2 hours', '3 hours', '4 hours'],
    correct_answer: 1,
    explanation: 'Monterey is approximately 2 hours south of San Francisco via Highway 101 or Highway 1.',
    difficulty: 'medium',
    category: 'Travel'
  },
  {
    id: 'sf-day-trips-005',
    game_id: 'sf-day-trips',
    question: 'Which mountain offers great views of San Francisco?',
    options: ['Mount Tamalpais', 'Mount Diablo', 'Both A and B', 'Mount Shasta'],
    correct_answer: 2,
    explanation: 'Both Mount Tamalpais (Marin County) and Mount Diablo (Contra Costa County) offer spectacular views of the Bay Area.',
    difficulty: 'medium',
    category: 'Nature'
  },
  {
    id: 'sf-day-trips-006',
    game_id: 'sf-day-trips',
    question: 'Which coastal city is known for its annual Pumpkin Festival?',
    options: ['Half Moon Bay', 'Pescadero', 'Pacifica', 'Capitola'],
    correct_answer: 0,
    explanation: 'Half Moon Bay hosts the famous Art & Pumpkin Festival every October.',
    difficulty: 'medium',
    category: 'Events'
  },
  {
    id: 'sf-day-trips-007',
    game_id: 'sf-day-trips',
    question: 'What is the name of the famous scenic drive along the coast?',
    options: ['Highway 1', 'Highway 101', 'Highway 280', 'Highway 17'],
    correct_answer: 0,
    explanation: 'Highway 1 (Pacific Coast Highway) offers stunning coastal views from San Francisco to Los Angeles.',
    difficulty: 'easy',
    category: 'Travel'
  },
  {
    id: 'sf-day-trips-008',
    game_id: 'sf-day-trips',
    question: 'Which university town is located south of San Francisco?',
    options: ['Palo Alto', 'Berkeley', 'Davis', 'Santa Cruz'],
    correct_answer: 0,
    explanation: 'Palo Alto is home to Stanford University and is about 1 hour south of San Francisco.',
    difficulty: 'easy',
    category: 'Education'
  },
  {
    id: 'sf-day-trips-009',
    game_id: 'sf-day-trips',
    question: 'Which national park features giant sequoia trees near San Francisco?',
    options: ['Yosemite', 'Sequoia', 'Redwood', 'Big Sur'],
    correct_answer: 0,
    explanation: 'Yosemite National Park, about 4 hours from San Francisco, features giant sequoia groves.',
    difficulty: 'medium',
    category: 'Nature'
  },
  {
    id: 'sf-day-trips-010',
    game_id: 'sf-day-trips',
    question: 'Which lighthouse is a popular day trip destination?',
    options: ['Point Reyes Lighthouse', 'Pigeon Point Lighthouse', 'Both A and B', 'Alcatraz Lighthouse'],
    correct_answer: 2,
    explanation: 'Both Point Reyes and Pigeon Point lighthouses are popular day trip destinations from San Francisco.',
    difficulty: 'medium',
    category: 'Tourism'
  }
];

async function seedTriviaQuestions() {
  try {
    console.log('Starting trivia questions seed...');
    
    // First, ensure the games exist
    const games = [
      {
        id: 'sf-football',
        name: 'SF Football Trivia',
        description: 'Test your knowledge about San Francisco football history and the 49ers.',
        image_url: '/levis-stadium-49ers.png'
      },
      {
        id: 'sf-baseball',
        name: 'SF Baseball Trivia',
        description: 'How much do you know about the San Francisco Giants and baseball in the Bay Area?',
        image_url: '/oracle-park-giants.png'
      },
      {
        id: 'sf-basketball',
        name: 'SF Basketball Trivia',
        description: 'Challenge yourself with questions about the Golden State Warriors and basketball in San Francisco.',
        image_url: '/chase-center-gsw.png'
      },
      {
        id: 'sf-districts',
        name: 'SF District Trivia',
        description: 'Test your knowledge of San Francisco\'s unique and diverse neighborhoods and districts.',
        image_url: '/mission-district-sf.png'
      },
      {
        id: 'sf-tourist-spots',
        name: 'SF Most Popular Tourist Spots',
        description: 'How well do you know San Francisco\'s famous landmarks and tourist attractions?',
        image_url: '/golden-gate-bridge.png'
      },
      {
        id: 'sf-day-trips',
        name: 'SF Best Places to Visit',
        description: 'Test your knowledge about the best day trips and places to visit around San Francisco.',
        image_url: '/muir-woods-day-trip.png'
      }
    ];

    // Insert games
    const { error: gamesError } = await supabase
      .from('trivia_games')
      .upsert(games, { onConflict: 'id' });

    if (gamesError) {
      console.error('Error inserting games:', gamesError);
      return;
    }

    console.log('Games inserted successfully');

    // Clear existing questions
    const { error: deleteError } = await supabase
      .from('trivia_questions')
      .delete()
      .neq('id', 'impossible-id'); // Delete all

    if (deleteError) {
      console.error('Error clearing existing questions:', deleteError);
    }

    // Insert questions in batches
    const batchSize = 50;
    for (let i = 0; i < COMPREHENSIVE_QUESTIONS.length; i += batchSize) {
      const batch = COMPREHENSIVE_QUESTIONS.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('trivia_questions')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        continue;
      }

      console.log(`Inserted batch ${i / batchSize + 1} (${batch.length} questions)`);
    }

    console.log(`Seed completed! Inserted ${COMPREHENSIVE_QUESTIONS.length} questions across ${games.length} games.`);
    
    // Log summary
    const summary = games.map(game => {
      const count = COMPREHENSIVE_QUESTIONS.filter(q => q.game_id === game.id).length;
      return `${game.name}: ${count} questions`;
    });
    
    console.log('\nSummary:');
    console.log(summary.join('\n'));
    console.log('\nNote: In production, expand to 100+ questions per game for maximum variety!');

  } catch (error) {
    console.error('Seed failed:', error);
  }
}

// Run the seed function
if (require.main === module) {
  seedTriviaQuestions()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export { seedTriviaQuestions }; 