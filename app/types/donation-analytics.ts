export interface DonationStats {
  totalDonations: number
  totalDonors: number
  averageDonation: number
  recurringDonors: number
  monthlyGrowth: number
  conversionRate: number
  totalPoints: number
  activePrograms: number
}

export interface DonationTrend {
  month: string
  amount: number
  donors: number
  recurring: number
}

export interface ConversionRate {
  source: string
  rate: number
  total: number
  change: number
}

export interface PointDistribution {
  range: string
  count: number
  percentage: number
}

export interface Campaign {
  id: string
  name: string
  startDate: string
  endDate: string
  goal: number
  raised: number
  donors: number
  averageDonation: number
  status: "active" | "completed"
}

export interface DonationAnalyticsData {
  stats: DonationStats
  trends: DonationTrend[]
  conversions: ConversionRate[]
  points: PointDistribution[]
  campaigns: Campaign[]
} 