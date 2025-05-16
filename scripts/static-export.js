const fs = require('fs');
const path = require('path');
const { mockData } = require('../app/lib/mock-data');

// Create static API responses
const staticApiData = {
  'leaderboard/index.json': mockData.leaderboard,
  'users/index.json': { users: [] },
  'trivia/questions/index.json': { questions: mockData.triviaQuestions },
  'badges/index.json': { badges: mockData.badges },
  'stats/index.json': mockData.stats,
  'notifications/index.json': { notifications: mockData.notifications },
  'health/index.json': { status: 'ok' }
};

// Ensure output directory exists
const staticApiDir = path.join(process.cwd(), 'out', '_static', 'api');
fs.mkdirSync(staticApiDir, { recursive: true });

// Write static API files
Object.entries(staticApiData).forEach(([file, data]) => {
  const filePath = path.join(staticApiDir, file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});

console.log('Static API files generated successfully!'); 