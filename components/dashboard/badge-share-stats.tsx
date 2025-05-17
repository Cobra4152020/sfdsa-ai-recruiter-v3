interface ShareData {
  platform: string
  count: number
}

interface BadgeShareStatsProps {
  shares: ShareData[]
}

export function BadgeShareStats({ shares }: BadgeShareStatsProps) {
  if (shares.length === 0) {
    return <div className="text-center py-4">No badge shares found</div>
  }

  // Calculate total for percentages
  const total = shares.reduce((sum, share) => sum + share.count, 0)

  return (
    <div className="space-y-4">
      {shares.map((share, index) => {
        const percentage = total > 0 ? Math.round((share.count / total) * 100) : 0

        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getColorForIndex(index) }}></div>
              <span>{share.platform}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium">{share.count}</span>
              <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
            </div>
          </div>
        )
      })}

      <div className="pt-4 mt-4 border-t">
        <div className="flex justify-between text-sm font-medium">
          <span>Total Shares</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  )
}

// Helper function to get colors
function getColorForIndex(index: number, isDark: boolean = false): string {
  const colors = isDark ? [
    "#FFD700", // Gold
    "#60A5FA", // Blue-400
    "#FBBF24", // Amber-400
    "#F87171", // Red-400
    "#A78BFA"  // Purple-400
  ] : [
    "#0A3C1F", // Primary green
    "#2563EB", // Blue-600
    "#D97706", // Amber-600
    "#DC2626", // Red-600
    "#7C3AED"  // Purple-600
  ]
  return colors[index % colors.length]
}
