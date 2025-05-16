// Mock data for static export
export const mockData = {
  leaderboard: {
    users: [
      { id: 1, name: "John Doe", points: 1000, rank: 1 },
      { id: 2, name: "Jane Smith", points: 950, rank: 2 },
      { id: 3, name: "Bob Johnson", points: 900, rank: 3 },
    ]
  },
  badges: [
    {
      id: "1",
      name: "Written Test",
      description: "Completed written test preparation",
      category: "application",
      color: "bg-blue-500",
      icon: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Oral Board",
      description: "Prepared for oral board interviews",
      category: "application",
      color: "bg-green-700",
      icon: "/placeholder.svg"
    }
  ],
  triviaQuestions: [
    {
      id: 1,
      question: "What is the primary role of a Deputy Sheriff?",
      options: [
        "Law enforcement",
        "Court security",
        "Jail operations",
        "All of the above"
      ],
      correctAnswer: 3
    }
  ],
  stats: {
    totalUsers: 1000,
    activeUsers: 750,
    completedChallenges: 5000,
    averageScore: 85
  },
  notifications: [
    {
      id: 1,
      title: "New Challenge Available",
      message: "Check out the latest trivia challenge!",
      type: "challenge",
      read: false
    }
  ],
  userProfile: {
    name: "Demo User",
    email: "demo@example.com",
    role: "recruit",
    points: 500,
    badges: ["written", "oral"],
    progress: {
      written: 80,
      physical: 60,
      oral: 90
    }
  }
}; 