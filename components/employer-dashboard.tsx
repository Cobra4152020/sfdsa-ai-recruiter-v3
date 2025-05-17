"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  User,
  Users,
  CalendarIcon,
  FileText,
  CheckCircle,
  Search,
  Star,
  Download,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react"

interface EmployerDashboardProps {
  className?: string
}

export function EmployerDashboard({ className }: EmployerDashboardProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [feedbackText, setFeedbackText] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockApplicants = [
          {
            id: "app1",
            name: "John Smith",
            email: "john.smith@example.com",
            phone: "(415) 555-1234",
            status: "new",
            applicationDate: "2023-05-10T14:30:00",
            progress: 25,
            documents: 3,
            interviews: 0,
            background: "pending",
            rating: 4,
            notes: "Strong candidate with military background.",
            avatar: "/user-app1.png",
          },
          {
            id: "app2",
            name: "Maria Rodriguez",
            email: "maria.rodriguez@example.com",
            phone: "(415) 555-5678",
            status: "in-progress",
            applicationDate: "2023-05-08T10:15:00",
            progress: 60,
            documents: 5,
            interviews: 1,
            background: "in-progress",
            rating: 5,
            notes: "Excellent communication skills, previous law enforcement experience.",
            avatar: "/user-app2.png",
          },
          {
            id: "app3",
            name: "David Chen",
            email: "david.chen@example.com",
            phone: "(415) 555-9012",
            status: "in-progress",
            applicationDate: "2023-05-05T09:45:00",
            progress: 75,
            documents: 6,
            interviews: 2,
            background: "cleared",
            rating: 4,
            notes: "Strong academic background, needs more physical training.",
            avatar: "/abstract-user-interface.png",
          },
          {
            id: "app4",
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            phone: "(415) 555-3456",
            status: "on-hold",
            applicationDate: "2023-05-03T16:20:00",
            progress: 40,
            documents: 4,
            interviews: 1,
            background: "pending",
            rating: 3,
            notes: "Missing some required documents, follow up needed.",
            avatar: "/user-app4.png",
          },
          {
            id: "app5",
            name: "Michael Brown",
            email: "michael.brown@example.com",
            phone: "(415) 555-7890",
            status: "approved",
            applicationDate: "2023-04-28T11:10:00",
            progress: 100,
            documents: 7,
            interviews: 3,
            background: "cleared",
            rating: 5,
            notes: "Excellent candidate, ready for academy.",
            avatar: "/user-app5.png",
          },
          {
            id: "app6",
            name: "Jennifer Lee",
            email: "jennifer.lee@example.com",
            phone: "(415) 555-2345",
            status: "rejected",
            applicationDate: "2023-04-25T13:40:00",
            progress: 30,
            documents: 2,
            interviews: 1,
            background: "failed",
            rating: 2,
            notes: "Did not meet minimum requirements for physical fitness.",
            avatar: "/placeholder.svg?height=64&width=64&query=user-app6",
          },
        ]

        const mockInterviews = [
          {
            id: "int1",
            applicantId: "app2",
            applicantName: "Maria Rodriguez",
            date: "2023-05-20T10:00:00",
            type: "Oral Board",
            location: "SF Sheriff's Office - 1 Dr Carlton B Goodlett Pl",
            status: "scheduled",
            interviewers: ["Sgt. Williams", "Lt. Johnson", "Capt. Davis"],
          },
          {
            id: "int2",
            applicantId: "app3",
            applicantName: "David Chen",
            date: "2023-05-22T14:30:00",
            type: "Psychological",
            location: "SF Sheriff's Office - 1 Dr Carlton B Goodlett Pl",
            status: "scheduled",
            interviewers: ["Dr. Martinez", "Dr. Thompson"],
          },
          {
            id: "int3",
            applicantId: "app5",
            applicantName: "Michael Brown",
            date: "2023-05-25T09:00:00",
            type: "Final Interview",
            location: "SF Sheriff's Office - 1 Dr Carlton B Goodlett Pl",
            status: "scheduled",
            interviewers: ["Sheriff Smith", "Undersheriff Jones"],
          },
        ]

        const mockAnalytics = {
          applicationsByStatus: [
            { name: "New", value: 12 },
            { name: "In Progress", value: 25 },
            { name: "On Hold", value: 8 },
            { name: "Approved", value: 15 },
            { name: "Rejected", value: 10 },
          ],
          applicationsByMonth: [
            { name: "Jan", applications: 15, approved: 8 },
            { name: "Feb", applications: 20, approved: 10 },
            { name: "Mar", applications: 25, approved: 12 },
            { name: "Apr", applications: 30, approved: 15 },
            { name: "May", applications: 35, approved: 18 },
          ],
          conversionRates: [
            { name: "Application to Interview", rate: 75 },
            { name: "Interview to Background", rate: 60 },
            { name: "Background to Approval", rate: 80 },
            { name: "Overall Conversion", rate: 40 },
          ],
          topRecruitmentSources: [
            { name: "Website", value: 35 },
            { name: "Job Fairs", value: 25 },
            { name: "Referrals", value: 20 },
            { name: "Social Media", value: 15 },
            { name: "Other", value: 5 },
          ],
        }

        setDashboardData({
          applicants: mockApplicants,
          interviews: mockInterviews,
          analytics: mockAnalytics,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleScheduleInterview = () => {
    if (!selectedApplicant || !selectedDate) {
      toast({
        title: "Missing information",
        description: "Please select an applicant and a date",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Interview Scheduled",
      description: `Interview with ${selectedApplicant.name} has been scheduled for ${selectedDate.toLocaleDateString()}.`,
    })

    setSelectedDate(undefined)
  }

  const handleSendFeedback = () => {
    if (!selectedApplicant || !feedbackText.trim()) {
      toast({
        title: "Missing information",
        description: "Please select an applicant and enter feedback",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Feedback Sent",
      description: `Feedback has been sent to ${selectedApplicant.name}.`,
    })

    setFeedbackText("")
  }

  const filteredApplicants =
    dashboardData?.applicants.filter((applicant: any) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === "all" || applicant.status === selectedStatus
      return matchesSearch && matchesStatus
    }) || []

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const COLORS = ["primary", "secondary", "accent", "muted", "background"]

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary dark:text-accent">Employer Dashboard</h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.applicants.length}</div>
                <div className="text-xs text-muted-foreground mt-1">+3 this week</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.applicants.filter((a: any) => a.status === "in-progress").length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">+2 this week</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.applicants.filter((a: any) => a.status === "approved").length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">+1 this week</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.interviews.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Next: May 20</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Current distribution of applicant statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.analytics.applicationsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.analytics.applicationsByStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Monthly application and approval rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.analytics.applicationsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="applications" fill="var(--primary)" name="Total Applications" />
                      <Bar dataKey="approved" fill="var(--accent)" name="Approved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-full p-2">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">New Application</h4>
                      <p className="text-sm text-muted-foreground">John Smith submitted a new application</p>
                      <p className="text-xs text-muted-foreground mt-1">Today at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Application Approved</h4>
                      <p className="text-sm text-muted-foreground">Michael Brown's application was approved</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday at 11:10 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <CalendarIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Interview Scheduled</h4>
                      <p className="text-sm text-muted-foreground">
                        Oral Board interview scheduled with Maria Rodriguez
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday at 9:45 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 rounded-full p-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Document Verified</h4>
                      <p className="text-sm text-muted-foreground">David Chen's background check completed</p>
                      <p className="text-xs text-muted-foreground mt-1">May 15, 2023 at 3:20 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.applicants
                    .filter((a: any) => a.rating >= 4)
                    .sort((a: any, b: any) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((applicant: any) => (
                      <div key={applicant.id} className="flex items-start space-x-4">
                        <div className="relative">
                          <div
                            className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary"
                            style={{ backgroundImage: `url(${applicant.avatar})` }}
                          ></div>
                          <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-1">
                            <Star className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{applicant.name}</h4>
                          <div className="flex items-center">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < applicant.rating ? "text-accent fill-accent" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge
                              variant="outline"
                              className="ml-2 bg-green-50 text-green-600 border-green-200 text-xs"
                            >
                              {applicant.progress}% Complete
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{applicant.notes}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applicants" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Applicant Management</CardTitle>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applicants..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApplicants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No applicants found matching your criteria.</p>
                  </div>
                ) : (
                  filteredApplicants.map((applicant: any) => (
                    <div
                      key={applicant.id}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-primary"
                            style={{ backgroundImage: `url(${applicant.avatar})` }}
                          ></div>
                          <div>
                            <h4 className="font-medium">{applicant.name}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" />
                              <span className="mr-3">{applicant.email}</span>
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{applicant.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={`${
                              applicant.status === "new"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : applicant.status === "in-progress"
                                  ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  : applicant.status === "on-hold"
                                    ? "bg-orange-50 text-orange-600 border-orange-200"
                                    : applicant.status === "approved"
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {applicant.status
                              .split("-")
                              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApplicant(applicant)
                              toast({
                                title: "Applicant Selected",
                                description: `${applicant.name} has been selected for review.`,
                              })
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Application Progress</span>
                          <span>{applicant.progress}%</span>
                        </div>
                        <Progress value={applicant.progress} className="h-2" />
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{applicant.documents} Documents</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{applicant.interviews} Interviews</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Background:{" "}
                            <span
                              className={
                                applicant.background === "cleared"
                                  ? "text-green-600"
                                  : applicant.background === "failed"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                              }
                            >
                              {applicant.background.charAt(0).toUpperCase() + applicant.background.slice(1)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {selectedApplicant && (
            <Card>
              <CardHeader>
                <CardTitle>Applicant Details: {selectedApplicant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Name:</span>
                        <span>{selectedApplicant.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Email:</span>
                        <span>{selectedApplicant.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Phone:</span>
                        <span>{selectedApplicant.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Applied:</span>
                        <span>{new Date(selectedApplicant.applicationDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mt-6 mb-4">Application Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Current Status:</span>
                        <Badge
                          variant="outline"
                          className={`${
                            selectedApplicant.status === "new"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : selectedApplicant.status === "in-progress"
                                ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                : selectedApplicant.status === "on-hold"
                                  ? "bg-orange-50 text-orange-600 border-orange-200"
                                  : selectedApplicant.status === "approved"
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {selectedApplicant.status
                            .split("-")
                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Progress:</span>
                        <span>{selectedApplicant.progress}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Background Check:</span>
                        <span
                          className={
                            selectedApplicant.background === "cleared"
                              ? "text-green-600"
                              : selectedApplicant.background === "failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }
                        >
                          {selectedApplicant.background.charAt(0).toUpperCase() + selectedApplicant.background.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Rating:</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < selectedApplicant.rating ? "text-accent fill-accent" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mt-6 mb-4">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedApplicant.notes}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Actions</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status-update">Update Status</Label>
                        <select
                          id="status-update"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select new status</option>
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="on-hold">On Hold</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <Button className="mt-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          Update Status
                        </Button>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="feedback">Send Feedback</Label>
                        <Textarea
                          id="feedback"
                          placeholder="Enter feedback for the applicant"
                          className="min-h-[100px]"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                        />
                        <Button
                          className="mt-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={handleSendFeedback}
                        >
                          Send Feedback
                        </Button>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            toast({
                              title: "Documents Downloaded",
                              description: `${selectedApplicant.name}'s documents have been downloaded.`,
                            })
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Documents
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            toast({
                              title: "Email Sent",
                              description: `An email has been sent to ${selectedApplicant.name}.`,
                            })
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email Applicant
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="interviews" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Scheduled interviews with applicants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.interviews.map((interview: any) => (
                    <div
                      key={interview.id}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{interview.type}</h4>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            >
                              Scheduled
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">Applicant: {interview.applicantName}</p>
                          <p className="text-sm text-muted-foreground">{interview.location}</p>
                          <p className="text-sm font-medium mt-1">
                            {new Date(interview.date).toLocaleString(undefined, {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </p>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Interviewers:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {interview.interviewers.map((interviewer: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {interviewer}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Calendar Added",
                              description: `"${interview.type}" has been added to your calendar.`,
                            })
                          }}
                        >
                          Add to Calendar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Interview Details",
                              description: `Viewing details for "${interview.type}" with ${interview.applicantName}`,
                            })
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule New Interview</CardTitle>
                <CardDescription>Set up an interview with an applicant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="applicant-select">Select Applicant</Label>
                    <select
                      id="applicant-select"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        const applicant = dashboardData.applicants.find((a: any) => a.id === e.target.value)
                        setSelectedApplicant(applicant || null)
                      }}
                    >
                      <option value="">Select an applicant</option>
                      {dashboardData.applicants
                        .filter((a: any) => a.status !== "rejected")
                        .map((applicant: any) => (
                          <option key={applicant.id} value={applicant.id}>
                            {applicant.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="interview-type">Interview Type</Label>
                    <select
                      id="interview-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select interview type</option>
                      <option value="initial">Initial Screening</option>
                      <option value="oral-board">Oral Board</option>
                      <option value="psychological">Psychological</option>
                      <option value="final">Final Interview</option>
                    </select>
                  </div>

                  <div>
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="border rounded-md p-3"
                      disabled={(date) => {
                        // Disable weekends and past dates
                        const day = date.getDay()
                        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0))
                        return day === 0 || day === 6 || isPastDate
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="interview-time">Time</Label>
                    <select
                      id="interview-time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select time</option>
                      <option value="9:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="interviewers">Interviewers</Label>
                    <Input id="interviewers" placeholder="Enter interviewer names (comma separated)" />
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleScheduleInterview}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
                <CardDescription>Current distribution of applicant statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.analytics.applicationsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.analytics.applicationsByStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Monthly application and approval rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.analytics.applicationsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="applications" fill="var(--primary)" name="Total Applications" />
                      <Bar dataKey="approved" fill="var(--accent)" name="Approved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>Application process conversion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.analytics.conversionRates.map((item: any) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span>{item.rate}%</span>
                      </div>
                      <Progress value={item.rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Recruitment Sources</CardTitle>
                <CardDescription>Where applicants are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.analytics.topRecruitmentSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.analytics.topRecruitmentSources.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Download Reports</CardTitle>
              <CardDescription>Export recruitment analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => {
                    toast({
                      title: "Report Downloaded",
                      description: "Applicant Status Report has been downloaded.",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Applicant Status Report
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => {
                    toast({
                      title: "Report Downloaded",
                      description: "Conversion Metrics Report has been downloaded.",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Conversion Metrics Report
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => {
                    toast({
                      title: "Report Downloaded",
                      description: "Recruitment Sources Report has been downloaded.",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Recruitment Sources Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
