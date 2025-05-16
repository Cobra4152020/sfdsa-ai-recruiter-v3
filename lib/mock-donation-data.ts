// Mock data for donation analytics
export const mockDonationData = {
  stats: {
    totalDonations: 25000,
    totalDonors: 850,
    averageDonation: 250,
    recurringDonors: 120,
    monthlyGrowth: 15.5,
    conversionRate: 8.2,
    totalPoints: 75000,
    activePrograms: 12
  },
  trends: Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toISOString().split('T')[0],
    amount: 15000 + Math.floor(Math.random() * 20000),
    donors: 100 + Math.floor(Math.random() * 200),
    recurring: 50 + Math.floor(Math.random() * 100)
  })),
  conversions: Array.from({ length: 6 }, (_, i) => ({
    source: ["Email", "Social Media", "Website", "Events", "Referral", "Direct"][i],
    rate: 5 + Math.random() * 15,
    total: 1000 + Math.floor(Math.random() * 5000),
    change: -10 + Math.random() * 20
  })),
  points: Array.from({ length: 5 }, (_, i) => ({
    range: `${i * 1000}-${(i + 1) * 1000}`,
    count: 100 + Math.floor(Math.random() * 500),
    percentage: (100 / 5) + (Math.random() * 10 - 5)
  })),
  campaigns: Array.from({ length: 10 }, (_, i) => ({
    id: `camp-${i + 1}`,
    name: `Campaign ${i + 1}`,
    startDate: new Date(2024, i, 1).toISOString().split('T')[0],
    endDate: new Date(2024, i + 1, 0).toISOString().split('T')[0],
    goal: 10000 + Math.floor(Math.random() * 40000),
    raised: 5000 + Math.floor(Math.random() * 45000),
    donors: 50 + Math.floor(Math.random() * 200),
    averageDonation: 100 + Math.floor(Math.random() * 400),
    status: Math.random() > 0.3 ? "active" : "completed"
  }))
}; 