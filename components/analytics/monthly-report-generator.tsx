"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { generateMonthlyReport, getAvailableMonths } from "@/lib/analytics-service"
import { FileText, Download, Loader2 } from "lucide-react"

export function MonthlyReportGenerator() {
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const availableMonths = getAvailableMonths()

  const handleGenerateReport = async () => {
    if (!selectedMonth) {
      toast({
        title: "Error",
        description: "Please select a month to generate a report",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const data = await generateMonthlyReport(new Date(selectedMonth))
      setReportData(data)
      toast({
        title: "Report Generated",
        description: "Monthly report has been generated successfully",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = () => {
    if (!reportData) {
      toast({
        title: "Error",
        description: "No report data available to download",
        variant: "destructive",
      })
      return
    }

    // Format the report data as a pretty-printed JSON string
    const jsonString = JSON.stringify(reportData, null, 2)

    // Create a blob and download it
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `monthly-report-${selectedMonth.split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: "Your report is being downloaded",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {availableMonths.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleGenerateReport} disabled={isGenerating || !selectedMonth}>
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>

        {reportData && (
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        )}
      </div>

      {reportData && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Report Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">User Growth</h4>
                <p className="text-2xl font-bold">{reportData.user_growth.new_users} new users</p>
                <div className="text-sm text-gray-500">
                  <div>{reportData.user_growth.new_recruits} new recruits</div>
                  <div>{reportData.user_growth.new_volunteers} new volunteers</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Engagement</h4>
                <p className="text-2xl font-bold">{reportData.engagement.active_users} active users</p>
                <div className="text-sm text-gray-500">
                  <div>{reportData.engagement.total_activities} total activities</div>
                  <div>{reportData.engagement.avg_points_per_activity.toFixed(1)} avg points per activity</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Badges</h4>
                <p className="text-2xl font-bold">{reportData.badges.badges_awarded} badges awarded</p>
                <div className="text-sm text-gray-500">
                  <div>{reportData.badges.users_with_badges} users received badges</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Referrals</h4>
                <p className="text-2xl font-bold">{reportData.referrals.total_referrals} referrals</p>
                <div className="text-sm text-gray-500">
                  <div>{reportData.referrals.active_recruiters} active recruiters</div>
                  <div>{reportData.referrals.conversion_rate.toFixed(1)}% conversion rate</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Top Recruiters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {reportData.top_recruiters &&
                  reportData.top_recruiters.map((recruiter: any) => (
                    <div key={recruiter.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{recruiter.name}</span>
                      <span className="font-medium">{recruiter.referrals} referrals</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Top Badges</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {reportData.top_badges &&
                  reportData.top_badges.map((badge: any) => (
                    <div key={badge.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{badge.name}</span>
                      <span className="font-medium">{badge.awards} awards</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
