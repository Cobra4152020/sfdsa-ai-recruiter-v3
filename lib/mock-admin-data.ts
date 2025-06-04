// Mock data for admin dashboard
export const mockAdminData = {
  systemStatus: {
    database: {
      status: "ok" as const,
      message: "Database connection successful",
    },
    email: { status: "ok" as const, message: "Email service is operational" },
    auth: {
      status: "ok" as const,
      message: "Authentication service is operational",
    },
    storage: {
      status: "ok" as const,
      message: "Storage service is operational",
    },
  },
  stats: {
    totalApplicants: 1250,
    activeVolunteers: 85,
    pendingApplications: 45,
    completedInterviews: 120,
    totalDonations: 25000,
    averageDonation: 250,
    emailsSent: 5000,
    emailOpenRate: 68.5,
    databaseSize: "2.5 GB",
    databaseConnections: 150,
    storageUsed: "15.2 GB",
    storageLimit: "50 GB",
  },
  healthChecks: {
    database: {
      status: "healthy",
      latency: "45ms",
      connections: 150,
      uptime: "99.99%",
    },
    email: {
      status: "healthy",
      deliveryRate: "99.5%",
      bounceRate: "0.5%",
      queueSize: 0,
    },
    auth: {
      status: "healthy",
      activeUsers: 250,
      failedLogins: 5,
      tokenExpiry: "1h",
    },
    storage: {
      status: "healthy",
      availability: "99.99%",
      errorRate: "0.01%",
      bandwidth: "50 Mbps",
    },
  },
  performance: {
    cpu: {
      usage: 35,
      temperature: 45,
      processes: 120,
    },
    memory: {
      used: 4.2,
      total: 8,
      swap: 0.5,
    },
    disk: {
      used: 45,
      total: 100,
      readSpeed: "150 MB/s",
      writeSpeed: "120 MB/s",
    },
    network: {
      incoming: "25 Mbps",
      outgoing: "15 Mbps",
      latency: "25ms",
      errors: 0,
    },
  },
  recentActivity: Array.from({ length: 10 }, (_, i) => ({
    id: `act-${i + 1}`,
    type: ["login", "application", "interview", "donation", "email"][
      Math.floor(Math.random() * 5)
    ],
    user: `user-${i + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    details: "Activity details here",
  })),
};
