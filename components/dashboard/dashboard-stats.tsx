import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Users, Share2, FileText } from "lucide-react"

interface DashboardStatsProps {
  challengesCount: number
  applicantsCount: number
  badgeSharesCount: number
  briefingsCount: number
}

export function DashboardStats({
  challengesCount,
  applicantsCount,
  badgeSharesCount,
  briefingsCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
          <Award className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{challengesCount}</div>
          <p className="text-xs text-muted-foreground">Active TikTok challenges</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          <Users className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{applicantsCount}</div>
          <p className="text-xs text-muted-foreground">Registered applicants</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Badge Shares</CardTitle>
          <Share2 className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{badgeSharesCount}</div>
          <p className="text-xs text-muted-foreground">Total social shares</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daily Briefings</CardTitle>
          <FileText className="h-4 w-4 text-[#0A3C1F]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{briefingsCount}</div>
          <p className="text-xs text-muted-foreground">Published briefings</p>
        </CardContent>
      </Card>
    </div>
  )
}
