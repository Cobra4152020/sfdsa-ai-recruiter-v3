"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { RecruiterPerformanceChart } from "@/components/recruiter-performance-chart"
import { RecruiterConversionFunnel } from "@/components/recruiter-conversion-funnel"
import { RecruiterReferralTable } from "@/components/recruiter-referral-table"
import { RecruiterComparisonChart } from "@/components/recruiter-comparison-chart"
import { RecruiterDemographicsChart } from "@/components/recruiter-demographics-chart"
import { RecruiterActivityTimeline } from "@/components/recruiter-activity-timeline"
import { RecruiterMetricsCards } from "@/components/recruiter-metrics-cards"
import { useUser } from "@/context/user-context"
import { Download, RefreshCw, Share2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RecruiterAnalyticsDashboard() {
  const { currentUser } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [filterSource, setFilterSource] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange, filterSource, filterStatus])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call with proper filters
      // For now, we'll simulate the data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for the dashboard
      const mockData = {
        metrics: {
          totalReferrals: 87,
          activeReferrals: 42,
          conversionRate: 18.4,
          averageTimeToHire: 24,
          totalHires: 16,
          pendingApplications: 26,
          totalClicks: 342,
          clickToReferralRate: 25.4,
        },
        performanceData: [
          { month: "Jan", referrals: 5, hires: 1, clicks: 22 },
          { month: "Feb", referrals: 8, hires: 2, clicks: 35 },
          { month: "Mar", referrals: 12, hires: 3, clicks: 48 },
          { month: "Apr", referrals: 10, hires: 2, clicks: 40 },
          { month: "May", referrals: 15, hires: 3, clicks: 62 },
          { month: "Jun", referrals: 18, hires: 2, clicks: 70 },
          { month: "Jul", referrals: 19, hires: 3, clicks: 65 },
        ],
        funnelData: {
          linkClicks: 342,
          pageViews: 298,
          formStarts: 124,
          formCompletions: 87,
          initialContacts: 65,
          interviews: 32,
          hires: 16,
        },
        referrals: [
          {
            id: "ref-001",
            name: "John Smith",
            email: "john.smith@example.com",
            source: "Email",
            status: "Hired",
            date: "2023-07-15",
            daysToHire: 18,
          },
          {
            id: "ref-002",
            name: "Maria Rodriguez",
            email: "maria.rodriguez@example.com",
            source: "Facebook",
            status: "Interview",
            date: "2023-07-22",
            daysInProcess: 11,
          },
          {
            id: "ref-003",
            name: "David Chen",
            email: "david.chen@example.com",
            source: "LinkedIn",
            status: "Application",
            date: "2023-07-28",
            daysInProcess: 5,
          },
          {
            id: "ref-004",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            source: "Twitter",
            status: "Initial Contact",
            date: "2023-08-02",
            daysInProcess: 2,
          },
          {
            id: "ref-005",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            source: "Email",
            status: "Hired",
            date: "2023-06-10",
            daysToHire: 22,
          },
        ],
        comparisonData: {
          you: {
            referrals: 87,
            hires: 16,
            conversionRate: 18.4,
            avgTimeToHire: 24,
          },
          topPerformer: {
            referrals: 112,
            hires: 24,
            conversionRate: 21.4,
            avgTimeToHire: 21,
          },
          average: {
            referrals: 62,
            hires: 9,
            conversionRate: 14.5,
            avgTimeToHire: 28,
          },
        },
        demographicsData: {
          gender: [
            { name: "Male", value: 52 },
            { name: "Female", value: 45 },
            { name: "Non-binary", value: 3 },
          ],
          age: [
            { name: "18-24", value: 15 },
            { name: "25-34", value: 42 },
            { name: "35-44", value: 28 },
            { name: "45+", value: 15 },
          ],
          source: [
            { name: "Email", value: 35 },
            { name: "Facebook", value: 25 },
            { name: "LinkedIn", value: 20 },
            { name: "Twitter", value: 10 },
            { name: "Other", value: 10 },
          ],
        },
        activityTimeline: [
          {
            id: "act-001",
            type: "referral",
            name: "John Smith",
            action: "signed up",
            date: "2023-08-02T14:30:00Z",
          },
          {
            id: "act-002",
            type: "interview",
            name: "Maria Rodriguez",
            action: "scheduled interview",
            date: "2023-08-01T10:15:00Z",
          },
          {
            id: "act-003",
            type: "hire",
            name: "Michael Brown",
            action: "was hired",
            date: "2023-07-28T16:45:00Z",
          },
          {
            id: "act-004",
            type: "application",
            name: "David Chen",
            action: "submitted application",
            date: "2023-07-25T09:20:00Z",
          },
          {
            id: "act-005",
            type: "click",
            count: 15,
            action: "link clicks",
            date: "2023-07-24T00:00:00Z",
          },
        ],
      }

      setDashboardData(mockData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
    toast({
      title: "Dashboard Refreshed",
      description: "The dashboard data has been updated.",
    })
  }

  const handleExport = () => {
    // In a real implementation, this would generate and download a CSV/Excel file
    toast({
      title: "Export Started",
      description: "Your data is being exported. The download will begin shortly.",
    })

    // Simulate download delay
    setTimeout(() => {
      // Create a simple CSV from the referrals data
      if (dashboardData && dashboardData.referrals) {
        const headers = ["ID", "Name", "Email", "Source", "Status", "Date"]
        const csvContent = [
          headers.join(","),
          ...dashboardData.referrals.map((ref: any) =>
            [ref.id, ref.name, ref.email, ref.source, ref.status, ref.date].join(","),
          ),
        ].join("\n")

        // Create a blob and download it
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.setAttribute("hidden", "")
        a.setAttribute("href", url)
        a.setAttribute("download", "recruiter_analytics.csv")
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }, 1000)
  }

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range)
  }

  const handleShare = () => {
    // In a real implementation, this would generate a shareable link or report
    toast({
      title: "Dashboard Shared",
      description: "A shareable link has been copied to your clipboard.",
    })

    // Simulate copying to clipboard
    navigator.clipboard.writeText(
      `${window.location.origin}/volunteer-dashboard/analytics?share=true&user=${currentUser?.id}`,
    )
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A3C1F]">Recruiter Analytics Dashboard</h2>
          <p className="text-gray-600">Track and optimize your recruitment performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <DateRangePicker date={dateRange} onDateChange={handleDateRangeChange} />

          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="initial">Initial Contact</SelectItem>
              <SelectItem value="application">Application</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {dashboardData && (
        <>
          <RecruiterMetricsCards metrics={dashboardData.metrics} />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecruiterPerformanceChart data={dashboardData.performanceData} />
                <RecruiterConversionFunnel data={dashboardData.funnelData} />
              </div>
              <RecruiterActivityTimeline activities={dashboardData.activityTimeline} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <RecruiterPerformanceChart data={dashboardData.performanceData} showDetailed={true} />
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                  <CardDescription>Key insights based on your recruitment performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-800">Strong Performance</h3>
                      <p className="text-green-700">
                        Your conversion rate of 18.4% is above the average of 14.5%. Keep up the good work!
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-800">Opportunity</h3>
                      <p className="text-blue-700">
                        Your LinkedIn referrals have a 22% conversion rate, which is your highest performing channel.
                        Consider focusing more efforts here.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h3 className="font-medium text-amber-800">Area for Improvement</h3>
                      <p className="text-amber-700">
                        Your Twitter referrals have only a 9% conversion rate. Consider revising your messaging or
                        targeting on this platform.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <RecruiterReferralTable referrals={dashboardData.referrals} />
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <RecruiterComparisonChart data={dashboardData.comparisonData} />
              <Card>
                <CardHeader>
                  <CardTitle>Benchmark Analysis</CardTitle>
                  <CardDescription>How you compare to other recruiters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 border rounded-lg">
                        <h3 className="font-medium text-gray-800">Your Performance</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Referrals:</span>
                            <span className="font-medium">{dashboardData.comparisonData.you.referrals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hires:</span>
                            <span className="font-medium">{dashboardData.comparisonData.you.hires}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conversion Rate:</span>
                            <span className="font-medium">{dashboardData.comparisonData.you.conversionRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Avg Time to Hire:</span>
                            <span className="font-medium">{dashboardData.comparisonData.you.avgTimeToHire} days</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h3 className="font-medium text-green-800">Top Performer</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-green-600">Referrals:</span>
                            <span className="font-medium">{dashboardData.comparisonData.topPerformer.referrals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Hires:</span>
                            <span className="font-medium">{dashboardData.comparisonData.topPerformer.hires}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Conversion Rate:</span>
                            <span className="font-medium">
                              {dashboardData.comparisonData.topPerformer.conversionRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Avg Time to Hire:</span>
                            <span className="font-medium">
                              {dashboardData.comparisonData.topPerformer.avgTimeToHire} days
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-medium text-blue-800">Average Recruiter</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-blue-600">Referrals:</span>
                            <span className="font-medium">{dashboardData.comparisonData.average.referrals}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Hires:</span>
                            <span className="font-medium">{dashboardData.comparisonData.average.hires}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Conversion Rate:</span>
                            <span className="font-medium">{dashboardData.comparisonData.average.conversionRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Avg Time to Hire:</span>
                            <span className="font-medium">
                              {dashboardData.comparisonData.average.avgTimeToHire} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h3 className="font-medium text-amber-800">Improvement Opportunities</h3>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-amber-700">
                        <li>Your average time to hire is 4 days faster than the average recruiter</li>
                        <li>Your conversion rate is 3.9% higher than the average</li>
                        <li>The top performer generates 28.7% more referrals than you</li>
                        <li>The top performer's conversion rate is 3% higher than yours</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              <RecruiterDemographicsChart data={dashboardData.demographicsData} />
              <Card>
                <CardHeader>
                  <CardTitle>Demographic Insights</CardTitle>
                  <CardDescription>Understanding your referral demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-800">Gender Distribution</h3>
                      <p className="text-blue-700">
                        Your referrals are well-balanced with 52% male and 45% female candidates, which is close to the
                        ideal 50/50 split.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-800">Age Distribution</h3>
                      <p className="text-green-700">
                        The majority (42%) of your referrals are in the 25-34 age range, which aligns well with the
                        department's recruitment goals.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h3 className="font-medium text-amber-800">Source Distribution</h3>
                      <p className="text-amber-700">
                        Email (35%) and Facebook (25%) are your top referral sources. Consider diversifying to reach
                        different demographic groups.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
