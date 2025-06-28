import { FileText, Shield, BrainCircuit, Users, Video } from "lucide-react";

export interface Question {
    id: number;
    text: string;
    options: {
      id: string;
      text: string;
    }[];
    correctAnswerId: string;
    domain: "Writing" | "Reading" | "Reasoning" | "Physical";
  }
  
  export interface PracticeTest {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    questions: number;
    durationMinutes: number;
    pointsToUnlock: number;
  }

  export const availableTests: PracticeTest[] = [
    {
      id: "pelletb",
      title: "POST Entry-Level Law Enforcement Test Battery (PELLETB)",
      description: "Measures skills in writing, reading comprehension, and reasoning. The state standard for law enforcement.",
      icon: FileText,
      questions: 120,
      durationMinutes: 150,
      pointsToUnlock: 150,
    },
    {
      id: "react-exam",
      title: "REACT Correction Officer Practice Test",
      description: "Measures skills in writing, reading comprehension, and reasoning, tailored for Corrections Officers.",
      icon: Shield,
      questions: 100,
      durationMinutes: 120,
      pointsToUnlock: 120,
    },
    {
      id: "situational-judgment",
      title: "Situational Judgment Test (SJT)",
      description: "Assesses your judgment and decision-making skills in realistic work-related scenarios.",
      icon: BrainCircuit,
      questions: 30,
      durationMinutes: 45,
      pointsToUnlock: 120,
    },
    {
      id: "physical-ability",
      title: "Physical Ability Test (PAT) Prep Guide",
      description: "A guide and checklist to prepare you for the physical requirements of the academy.",
      icon: Shield,
      questions: 10,
      durationMinutes: 20,
      pointsToUnlock: 100,
    },
    {
      id: "count-test",
      title: "Count Test Practice",
      description: "Practice your ability to accurately track inmate movements and counts in a correctional facility setting, a key component of the NTN Corrections Test.",
      icon: Users,
      questions: 15,
      durationMinutes: 10,
      pointsToUnlock: 110,
    },
    {
      id: "incident-observation",
      title: "Incident Observation & Report Writing",
      description: "Watch a scenario, take notes, and answer questions based on your observations to practice for the report writing portion of the exam.",
      icon: Video,
      questions: 10,
      durationMinutes: 15,
      pointsToUnlock: 130,
    },
  ];
  
  export const testQuestions: { [key: string]: Question[] } = {
    "pelletb": [
      {
        id: 1,
        text: "Choose the sentence that is most clearly written and grammatically correct.",
        options: [
          { id: "a", text: "The suspect, he was seen leaving the building." },
          { id: "b", text: "Leaving the building, the suspect was seen by the officer." },
          { id: "c", text: "The officer saw the suspect leaving the building." },
          { id: "d", text: "The suspect was seen by the officer and he was leaving the building." },
        ],
        correctAnswerId: "c",
        domain: "Writing"
      },
      {
        id: 2,
        text: "Read the passage and fill in the blanks with the best option: 'The evidence was ___ on the table. Its ___ on the case was significant.'",
        options: [
          { id: "a", text: "lain, affect" },
          { id: "b", text: "laid, effect" },
          { id: "c", text: "lay, effect" },
          { id: "d", text: "laid, affect" },
        ],
        correctAnswerId: "b",
        domain: "Writing"
      },
      {
        id: 3,
        text: "Read the following paragraph: 'Incident 22-A45 involved a burglary at 123 Main St. The suspect gained entry by breaking a rear window. The homeowner reported that several electronic items were missing. No witnesses have come forward. The responding officer secured the scene and collected fingerprints from the window frame.' According to the report, how did the suspect enter the residence?",
        options: [
          { id: "a", text: "Through an unlocked front door." },
          { id: "b", text: "By breaking a window at the back of the house." },
          { id: "c", text: "The report does not state how the suspect entered." },
          { id: "d", text: "By tricking the homeowner." },
        ],
        correctAnswerId: "b",
        domain: "Reading"
      },
      {
        id: 4,
        text: "An officer can file 3 reports in 60 minutes. A trainee can file 2 reports in 60 minutes. If they work together, how long will it take them to file 10 reports?",
        options: [
          { id: "a", text: "90 minutes" },
          { id: "b", text: "120 minutes" },
          { id: "c", text: "150 minutes" },
          { id: "d", text: "180 minutes" },
        ],
        correctAnswerId: "b",
        domain: "Reasoning"
      },
      {
        id: 5,
        text: "A patrol car's license plate follows a pattern: 7A3, 6B6, 5C9, ___. What is the next plate in the sequence?",
        options: [
          { id: "a", text: "4D12" },
          { id: "b", text: "4D11" },
          { id: "c", text: "3D12" },
          { id: "d", text: "4C12" },
        ],
        correctAnswerId: "a",
        domain: "Reasoning"
      }
    ],
    "react-exam": [
      {
        id: 1,
        text: "An inmate claims their personal property is missing from their cell. What is the first, most appropriate action to take?",
        options: [
          { id: "a", text: "Tell the inmate it's their own responsibility." },
          { id: "b", text: "Conduct a thorough search of the inmate's cell and common areas." },
          { id: "c", text: "File a formal report and document the inmate's claim." },
          { id: "d", text: "Immediately accuse the cellmate of theft." },
        ],
        correctAnswerId: "c",
        domain: "Reasoning",
      },
      {
        id: 2,
        text: "Choose the sentence that is most clearly written for a formal report.",
        options: [
          { id: "a", text: "The inmate was acting weird and I saw him take the stuff." },
          { id: "b", text: "I observed the inmate remove several items from the commissary shelf without paying." },
          { id: "c", text: "He took the items from the shelf and didn't pay, I saw it." },
          { id: "d", text: "The items were taken by the inmate without him paying." },
        ],
        correctAnswerId: "b",
        domain: "Writing"
      },
      {
        id: 3,
        text: "Read the following paragraph: 'Incident 22-A45 involved a burglary at 123 Main St. The suspect gained entry by breaking a rear window. The homeowner reported that several electronic items were missing. No witnesses have come forward. The responding officer secured the scene and collected fingerprints from the window frame.' According to the report, how did the suspect enter the residence?",
        options: [
          { id: "a", text: "Through an unlocked front door." },
          { id: "b", text: "By breaking a window at the back of the house." },
          { id: "c", text: "The report does not state how the suspect entered." },
          { id: "d", text: "By tricking the homeowner." },
        ],
        correctAnswerId: "b",
        domain: "Reading"
      },
      {
        id: 4,
        text: "An officer can file 3 reports in 60 minutes. A trainee can file 2 reports in 60 minutes. If they work together, how long will it take them to file 10 reports?",
        options: [
          { id: "a", text: "90 minutes" },
          { id: "b", text: "120 minutes" },
          { id: "c", text: "150 minutes" },
          { id: "d", text: "180 minutes" },
        ],
        correctAnswerId: "b",
        domain: "Reasoning"
      },
      {
        id: 5,
        text: "A patrol car's license plate follows a pattern: 7A3, 6B6, 5C9, ___. What is the next plate in the sequence?",
        options: [
          { id: "a", text: "4D12" },
          { id: "b", text: "4D11" },
          { id: "c", text: "3D12" },
          { id: "d", text: "4C12" },
        ],
        correctAnswerId: "a",
        domain: "Reasoning"
      }
    ],
    "situational-judgment": [
      {
        id: 1,
        text: "You are on patrol and witness a minor traffic violation. The driver is a well-known community leader who has been supportive of the Sheriff's Office. What is the most appropriate initial action?",
        options: [
          { id: "a", text: "Ignore the violation to maintain a good relationship." },
          { id: "b", text: "Issue a warning and use it as an educational opportunity." },
          { id: "c", text: "Issue a ticket immediately to show no one is above the law." },
          { id: "d", text: "Ask your supervisor for advice before taking any action." },
        ],
        correctAnswerId: "b",
        domain: "Reasoning"
      },
      {
        id: 2,
        text: "During a search, your partner finds a small, valuable item and pockets it, unseen by others. What is your most critical responsibility?",
        options: [
          { id: "a", text: "Confront your partner privately after the search." },
          { id: "b", text: "Report the incident to your supervisor immediately, following department policy." },
          { id: "c", text: "Pretend you didn't see it to avoid conflict with your partner." },
          { id: "d", text: "Take the item from your partner and log it into evidence yourself." },
        ],
        correctAnswerId: "b",
        domain: "Reasoning"
      },
      {
          id: 3,
          text: "You respond to a noise complaint at a house party. The host is uncooperative and verbally aggressive. How should you proceed?",
          options: [
            { id: "a", text: "Immediately arrest the host for obstruction." },
            { id: "b", text: "Disengage and leave, as it's a minor issue." },
            { id: "c", text: "Remain calm, use de-escalation techniques, and request backup if needed." },
            { id: "d", text: "Raise your voice to assert authority and gain control." },
          ],
          correctAnswerId: "c",
          domain: "Reasoning"
      }
    ],
    "physical-ability": [
      {
        id: 1,
        text: "500 Yard Run",
        options: [{id: 'a', text: "Target time: Under 2 minutes"}],
        correctAnswerId: 'a',
        domain: "Physical"
      },
      {
        id: 2,
        text: "99 Yard Obstacle Course",
        options: [{id: 'a', text: "Target: Under 35 seconds. Must navigate sharp turns, curbs, and a 34-inch sawhorse."}],
        correctAnswerId: 'a',
        domain: "Physical"
      },
      {
        id: 3,
        text: "Body Drag",
        options: [{id: 'a', text: "Target: Under 20 seconds. Lift and drag a 165-pound dummy 32 feet."}],
        correctAnswerId: 'a',
        domain: "Physical"
      }
    ],
    "count-test": [
      {
        id: 1,
        text: "Cell Block A starts with 15 inmates. 3 go to the medical bay, 2 go to visitation, and 4 new inmates arrive from intake. What is the final count in Cell Block A?",
        options: [ {id: "a", text: "14"}, {id: "b", text: "15"}, {id: "c", text: "16"}, {id: "d", text: "17"} ],
        correctAnswerId: "a",
        domain: "Reasoning"
      },
      {
        id: 2,
        text: "The cafeteria holds 120 inmates. At the start of lunch, it is at 50% capacity. 25 inmates leave and 40 inmates enter. What is the final number of inmates?",
        options: [ {id: "a", text: "75"}, {id: "b", text: "85"}, {id: "c", text: "95"}, {id: "d", text: "105"} ],
        correctAnswerId: "b",
        domain: "Reasoning"
      }
    ],
    "incident-observation": [
        {
            id: 1,
            text: "Based on the scenario (to be implemented with a video/image), what color shirt was the primary instigator wearing?",
            options: [ {id: "a", text: "Blue"}, {id: "b", text: "Red"}, {id: "c", text: "Green"}, {id: "d", text: "Black"} ],
            correctAnswerId: "b",
            domain: "Reading"
        }
    ],
  }; 