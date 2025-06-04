export interface UserGrowthData {
  date: string;
  total: number;
  recruits: number;
  volunteers: number;
  new_users: number;
  active_users: number;
}

export interface UserEngagementData {
  date: string;
  active_users: number;
  average_session_time: number;
  interactions: number;
}

export interface ConversionData {
  volunteer_id: string;
  volunteer_name: string;
  referrals: number;
  conversions: number;
  conversion_rate: number;
}

export interface GeographicData {
  zip_code: string;
  region: string;
  count: number;
  percentage: number;
}

export interface RetentionData {
  cohort: string;
  users: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  week6: number;
  week7: number;
  week8: number;
}

export interface BadgeDistributionData {
  badge_id: string;
  badge_name: string;
  count: number;
  percentage: number;
}

export interface UserActivitySummary {
  date: string;
  logins: number;
  profile_updates: number;
  applications: number;
  messages: number;
}
