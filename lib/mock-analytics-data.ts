import type {
  UserGrowthData,
  UserEngagementData,
  ConversionData,
  GeographicData,
  RetentionData,
  BadgeDistributionData,
  UserActivitySummary,
} from "../app/types/analytics";

// Mock data for analytics
export const mockAnalyticsData = {
  growth: {
    week: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      total: 1000 + i * 50,
      recruits: 600 + i * 30,
      volunteers: 400 + i * 20,
      new_users: 40 + Math.floor(Math.random() * 20),
      active_users: 800 + Math.floor(Math.random() * 100),
    })) as UserGrowthData[],
    month: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      total: 1000 + i * 15,
      recruits: 600 + i * 10,
      volunteers: 400 + i * 5,
      new_users: 30 + Math.floor(Math.random() * 15),
      active_users: 800 + Math.floor(Math.random() * 100),
    })) as UserGrowthData[],
    quarter: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      total: 1000 + i * 5,
      recruits: 600 + i * 3,
      volunteers: 400 + i * 2,
      new_users: 20 + Math.floor(Math.random() * 10),
      active_users: 800 + Math.floor(Math.random() * 100),
    })) as UserGrowthData[],
    year: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      total: 1000 + i * 100,
      recruits: 600 + i * 60,
      volunteers: 400 + i * 40,
      new_users: 200 + Math.floor(Math.random() * 50),
      active_users: 800 + Math.floor(Math.random() * 200),
    })) as UserGrowthData[],
  },
  engagement: {
    week: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      active_users: 800 + Math.floor(Math.random() * 100),
      average_session_time: 15 + Math.floor(Math.random() * 10),
      interactions: 5 + Math.floor(Math.random() * 3),
    })) as UserEngagementData[],
    month: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      active_users: 800 + Math.floor(Math.random() * 100),
      average_session_time: 15 + Math.floor(Math.random() * 10),
      interactions: 5 + Math.floor(Math.random() * 3),
    })) as UserEngagementData[],
    quarter: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      active_users: 800 + Math.floor(Math.random() * 100),
      average_session_time: 15 + Math.floor(Math.random() * 10),
      interactions: 5 + Math.floor(Math.random() * 3),
    })) as UserEngagementData[],
    year: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      active_users: 800 + Math.floor(Math.random() * 200),
      average_session_time: 15 + Math.floor(Math.random() * 10),
      interactions: 5 + Math.floor(Math.random() * 3),
    })) as UserEngagementData[],
  },
  conversion: Array.from({ length: 10 }, (_, i) => ({
    volunteer_id: `vol-${i + 1}`,
    volunteer_name: `Volunteer ${i + 1}`,
    referrals: Math.floor(1000 * Math.pow(0.8, i)),
    conversions: Math.floor(1000 * Math.pow(0.8, i) * 0.3),
    conversion_rate:
      Math.round((Math.pow(0.8, i) * 100 + Math.random() * 5) * 10) / 10,
  })) as ConversionData[],
  geographic: Array.from({ length: 10 }, (_, i) => ({
    zip_code: `941${String(i).padStart(2, "0")}`,
    region: [
      "San Francisco",
      "Oakland",
      "San Jose",
      "Berkeley",
      "Palo Alto",
      "Mountain View",
      "Fremont",
      "Richmond",
      "Daly City",
      "San Mateo",
    ][i],
    count: Math.floor(Math.random() * 500) + 100,
    percentage: Math.round((Math.random() * 20 + 5) * 10) / 10,
  })) as GeographicData[],
  retention: Array.from({ length: 10 }, (_, i) => ({
    cohort: `Week ${i + 1}`,
    users: 100 - i * 5,
    week1: 100,
    week2: 90 - i * 2,
    week3: 80 - i * 3,
    week4: 70 - i * 4,
    week5: 60 - i * 5,
    week6: 50 - i * 5,
    week7: 40 - i * 5,
    week8: 30 - i * 3,
  })) as RetentionData[],
  badges: Array.from({ length: 8 }, (_, i) => ({
    badge_id: `badge-${i + 1}`,
    badge_name: [
      "Early Bird",
      "Quick Learner",
      "Team Player",
      "Problem Solver",
      "Community Leader",
      "Top Performer",
      "Innovator",
      "Expert",
    ][i],
    count: Math.floor(Math.random() * 500) + 100,
    percentage: Math.round((Math.random() * 20 + 5) * 10) / 10,
  })) as BadgeDistributionData[],
  activity: {
    week: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      logins: Math.floor(Math.random() * 500) + 300,
      profile_updates: Math.floor(Math.random() * 100) + 50,
      applications: Math.floor(Math.random() * 50) + 20,
      messages: Math.floor(Math.random() * 200) + 100,
    })) as UserActivitySummary[],
    month: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      logins: Math.floor(Math.random() * 500) + 300,
      profile_updates: Math.floor(Math.random() * 100) + 50,
      applications: Math.floor(Math.random() * 50) + 20,
      messages: Math.floor(Math.random() * 200) + 100,
    })) as UserActivitySummary[],
    quarter: Array.from({ length: 90 }, (_, i) => ({
      date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      logins: Math.floor(Math.random() * 500) + 300,
      profile_updates: Math.floor(Math.random() * 100) + 50,
      applications: Math.floor(Math.random() * 50) + 20,
      messages: Math.floor(Math.random() * 200) + 100,
    })) as UserActivitySummary[],
    year: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      logins: Math.floor(Math.random() * 2000) + 1000,
      profile_updates: Math.floor(Math.random() * 400) + 200,
      applications: Math.floor(Math.random() * 200) + 100,
      messages: Math.floor(Math.random() * 800) + 400,
    })) as UserActivitySummary[],
  },
};
