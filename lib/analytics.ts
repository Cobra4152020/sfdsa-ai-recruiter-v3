// Track page views
export function trackPageView(page: string) {
  try {
    // Send to Supabase analytics table
    fetch("/api/analytics/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page }),
    }).catch((err) => console.error("Error tracking page view:", err))

    // You could also integrate with services like Google Analytics, Vercel Analytics, etc.
  } catch (error) {
    console.error("Error tracking page view:", error)
  }
}

// Track user engagement
export function trackEngagement(action: string, details?: Record<string, any>) {
  try {
    // Send to Supabase analytics table
    fetch("/api/analytics/engagement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, details }),
    }).catch((err) => console.error("Error tracking engagement:", err))
  } catch (error) {
    console.error("Error tracking engagement:", error)
  }
}

// Track badge earned
export function trackBadgeEarned(badgeId: string, badgeName: string) {
  try {
    // Send to Supabase analytics table
    fetch("/api/analytics/badge-earned", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ badgeId, badgeName }),
    }).catch((err) => console.error("Error tracking badge earned:", err))
  } catch (error) {
    console.error("Error tracking badge earned:", error)
  }
}
