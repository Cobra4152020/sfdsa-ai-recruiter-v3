export function generateStaticParams() {
  return [
    { id: "test-user" },
    { id: "user1" },
    { id: "user2" },
    { id: "user3" },
  ];
}

export function generateBadgeParams() {
  return [{ id: "written" }, { id: "oral" }, { id: "physical" }];
}

export function generateChallengeParams() {
  return [
    { id: "daily-trivia" },
    { id: "tiktok-challenge" },
    { id: "special-mission" },
  ];
}

// Add any other static parameter generators needed for dynamic routes
export const staticPaths = {
  users: generateStaticParams(),
  badges: generateBadgeParams(),
  challenges: generateChallengeParams(),
};
