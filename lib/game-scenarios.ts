export interface GameScenario {
  id: number;
  title: string;
  scenario: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
}

export const gameScenarios: GameScenario[] = [
  {
    id: 1,
    title: "Traffic Stop Escalation",
    scenario: "You've pulled over a vehicle for speeding. As you approach the driver's window, you notice the driver appears nervous, fidgeting with something in their lap, and won't make eye contact. What's your primary course of action?",
    options: [
      "Immediately call for backup and draw your weapon",
      "Maintain tactical awareness, position yourself safely, and proceed with normal traffic stop procedures while staying alert",
      "Return to your patrol car and run additional checks on the vehicle",
      "Ask the driver to step out of the vehicle immediately"
    ],
    correctAnswer: 1,
    explanation: "Maintaining tactical awareness while following standard procedures is the safest approach. The behavior could be normal nervousness or something more serious.",
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    title: "Domestic Violence Call",
    scenario: "You respond to a domestic violence call. Upon arrival, you see a woman with visible bruises who claims she 'fell down stairs.' Her partner is present and very cooperative, offering explanations. What's your next step?",
    options: [
      "Accept the explanation since both parties agree on the story",
      "Leave since no one is pressing charges",
      "Arrest the partner immediately based on visible injuries",
      "Separate the parties and interview them individually while documenting all injuries and observations"
    ],
    correctAnswer: 3,
    explanation: "Separating parties and conducting individual interviews is crucial in domestic violence cases. Victims often minimize incidents when the aggressor is present.",
    difficulty: 'hard',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 3,
    title: "Suspicious Person Report",
    scenario: "You receive a call about a 'suspicious person' walking through a residential neighborhood. The caller reports the person is 'looking at houses' and 'doesn't belong here.' Upon arrival, you see an individual walking on the sidewalk. What's your approach?",
    options: [
      "Approach politely, identify yourself, and engage in voluntary conversation to assess the situation",
      "Immediately detain the person for questioning",
      "Follow the person discreetly from your patrol car",
      "Tell the person to leave the neighborhood immediately"
    ],
    correctAnswer: 0,
    explanation: "Walking in a neighborhood is not illegal. A polite, respectful approach allows you to assess if any actual crime is occurring while respecting civil rights.",
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 4,
    title: "Mental Health Crisis",
    scenario: "You're called to a scene where a person is having a mental health crisis. They're sitting on a bench, talking to themselves loudly, and occasionally yelling at passersby. Several people have called 911. The person hasn't committed any crime but appears distressed.",
    options: [
      "Arrest them for disturbing the peace",
      "Tell them to move along or face arrest",
      "Use de-escalation techniques, speak calmly, and assess if they need mental health services or medical attention",
      "Call mental health services and wait for their arrival without engaging"
    ],
    correctAnswer: 2,
    explanation: "Mental health crises require patience and de-escalation. The goal is to help the person get appropriate care, not punishment.",
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 5,
    title: "Underage Drinking Party",
    scenario: "You respond to a noise complaint that leads you to discover a house party with underage drinking. About 30 teenagers are present, some clearly intoxicated. The homeowner (an adult) claims they didn't know about the drinking. What's your primary concern and action?",
    options: [
      "Focus on safety first - ensure no one drives impaired, then address violations appropriately with emphasis on education",
      "Arrest all underage individuals for underage drinking",
      "Shut down the party and leave without taking action",
      "Only arrest the homeowner for providing alcohol to minors"
    ],
    correctAnswer: 0,
    explanation: "Safety is paramount. Preventing drunk driving saves lives. Educational approaches often work better than mass arrests for underage drinking situations.",
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 6,
    title: "Armed Robbery in Progress",
    scenario: "You receive a call about an armed robbery in progress at a convenience store. You're the first unit to arrive and see a suspect exiting the store with what appears to be a weapon. The suspect sees you and starts running. What's your immediate action?",
    options: [
      "Chase the suspect on foot immediately",
      "Shoot to stop the suspect from escaping",
      "Focus only on helping victims inside the store",
      "Call for backup, establish a perimeter, and coordinate pursuit while maintaining situational awareness"
    ],
    correctAnswer: 3,
    explanation: "Officer safety and tactical coordination are crucial. A hasty pursuit could put you, civilians, and other officers at risk.",
    difficulty: 'hard',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 7,
    title: "Child Custody Dispute",
    scenario: "You're called to a child custody exchange that has become heated. Both parents are yelling, and a 6-year-old child is crying. Each parent claims the other is violating the custody agreement and demands you arrest the other party. The child is scared and clinging to one parent.",
    options: [
      "Tell them to figure it out themselves since it's a civil matter",
      "Calm the situation, separate the parties, review any court orders, and prioritize the child's welfare",
      "Arrest whichever parent seems more aggressive",
      "Take the child into protective custody immediately"
    ],
    correctAnswer: 1,
    explanation: "The child's welfare comes first. De-escalation and careful review of legal documents help resolve custody disputes properly.",
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 8,
    title: "Drug Paraphernalia Discovery",
    scenario: "During a routine traffic stop for a broken taillight, you notice what appears to be drug paraphernalia in plain view on the passenger seat. The driver seems cooperative and admits the items belong to them. They appear to be personal use quantities.",
    options: [
      "Give them a warning and let them dispose of the items",
      "Arrest them immediately for drug possession",
      "Seize the items, document everything properly, and determine appropriate charges based on local policies and circumstances",
      "Ignore it since it's just personal use"
    ],
    correctAnswer: 2,
    explanation: "Proper documentation and following departmental policy ensures fair and legal handling. Many jurisdictions have specific protocols for personal use quantities.",
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 9,
    title: "School Fight Response",
    scenario: "You're called to a high school where a fight has broken out between several students. When you arrive, the fight is over, but tensions are high. Students are recording with phones, and you see one student has a bloody nose. School administrators want all students involved arrested.",
    options: [
      "Only arrest the student who appears to have caused the most damage",
      "Assess injuries, de-escalate tensions, gather facts from multiple sources, and determine appropriate intervention",
      "Arrest all students involved as requested by school administration",
      "Let the school handle it since it's on school property"
    ],
    correctAnswer: 1,
    explanation: "School incidents require careful fact-gathering. Not all altercations require arrests - sometimes mediation and education are more appropriate.",
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 10,
    title: "Elderly Person Welfare Check",
    scenario: "You're conducting a welfare check on an elderly person whose neighbor reported not seeing them for several days. You arrive to find the person confused, the house in disarray, and expired food everywhere. The person insists they're fine and tells you to leave.",
    options: [
      "Clean up their house before leaving",
      "Leave since they told you to go and they're not under arrest",
      "Assess their mental capacity, check for signs of abuse or neglect, and consider involving adult protective services if needed",
      "Force them to go to the hospital immediately"
    ],
    correctAnswer: 2,
    explanation: "Elderly welfare checks require balancing personal autonomy with safety concerns. Professional assessment helps determine if intervention is needed.",
    difficulty: 'hard',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
]; 