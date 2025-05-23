"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ConversionRow {
  volunteer_id: string
  volunteer_name: string
  referrals: number
  conversions: number
  conversion_rate: number
}

interface ConversionTableProps {
  data: ConversionRow[]
  isLoading: boolean
}

export function ConversionTable({ data, isLoading }: ConversionTableProps) {
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
        <p className="text-lg font-medium text-gray-500">No data available</p>
        <p className="text-sm text-gray-400">Try selecting a different time period</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recruiter</TableHead>
            <TableHead className="text-right">Referrals</TableHead>
            <TableHead className="text-right">Conversions</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.volunteer_id}>
              <TableCell className="font-medium">{row.volunteer_name}</TableCell>
              <TableCell className="text-right">{row.referrals}</TableCell>
              <TableCell className="text-right">{row.conversions}</TableCell>
              <TableCell className="text-right">
                <Badge variant={getVariantForRate(row.conversion_rate)}>{row.conversion_rate.toFixed(1)}%</Badge>
              </TableCell>
              <TableCell>
                <Progress value={row.conversion_rate} className="h-2" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getVariantForRate(rate: number) {
  if (rate >= 75) return "success"
  if (rate >= 50) return "default"
  if (rate >= 25) return "secondary"
  return "destructive"
}
