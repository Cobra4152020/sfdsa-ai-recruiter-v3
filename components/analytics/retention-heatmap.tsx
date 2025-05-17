"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RetentionHeatmapProps {
  data: any[]
  isLoading: boolean
}

export function RetentionHeatmap({ data, isLoading }: RetentionHeatmapProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-gray-500">No retention data available</p>
        <p className="text-sm text-gray-400">Try selecting a different time period</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cohort</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Week 1</TableHead>
            <TableHead>Week 2</TableHead>
            <TableHead>Week 3</TableHead>
            <TableHead>Week 4</TableHead>
            <TableHead>Week 5</TableHead>
            <TableHead>Week 6</TableHead>
            <TableHead>Week 7</TableHead>
            <TableHead>Week 8</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.cohort}>
              <TableCell className="font-medium">{row.cohort}</TableCell>
              <TableCell>{row.users}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week1)}%`,
                      backgroundColor: getColorForRetention(row.week1),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week1.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week2)}%`,
                      backgroundColor: getColorForRetention(row.week2),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week2.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week3)}%`,
                      backgroundColor: getColorForRetention(row.week3),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week3.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week4)}%`,
                      backgroundColor: getColorForRetention(row.week4),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week4.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week5)}%`,
                      backgroundColor: getColorForRetention(row.week5),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week5.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week6)}%`,
                      backgroundColor: getColorForRetention(row.week6),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week6.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week7)}%`,
                      backgroundColor: getColorForRetention(row.week7),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week7.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div
                    className="h-8 rounded"
                    style={{
                      width: `${Math.min(100, row.week8)}%`,
                      backgroundColor: getColorForRetention(row.week8),
                      minWidth: "20px",
                    }}
                  >
                    <span className="px-2 text-xs text-white">{row.week8.toFixed(1)}%</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getColorForRetention(retention: number, isDark: boolean = false): string {
  if (isDark) {
    if (retention >= 75) return "#34D399" // emerald-400
    if (retention >= 50) return "#60A5FA" // blue-400
    if (retention >= 25) return "#FBBF24" // amber-400
    return "#F87171" // red-400
  } else {
    if (retention >= 75) return "#059669" // emerald-600
    if (retention >= 50) return "#2563EB" // blue-600
    if (retention >= 25) return "#D97706" // amber-600
    return "#DC2626" // red-600
  }
}
