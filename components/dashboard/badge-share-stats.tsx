import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ShareData {
  platform: string
  count: number
}

interface BadgeShareStatsProps {
  shares: ShareData[]
}

const COLORS = ["#0A3C1F", "#2E7D32", "#43A047", "#66BB6A", "#81C784"]

export function BadgeShareStats({ shares }: BadgeShareStatsProps) {
  if (shares.length === 0) {
    return <div className="text-center py-4">No badge shares found</div>
  }

  // Format data for the chart
  const data = shares.map((share, index) => ({
    name: share.platform,
    value: share.count,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
