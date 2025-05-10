"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  FileText,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Target,
  FileUp,
  MapPin,
  UserPlus,
  Share2,
  TrendingUp,
  Briefcase,
  BookOpen,
  Settings,
  HelpCircle,
  Bell,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function VolunteerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalApplicants: 0,
    newApplicants: 0,
    inProgress: 0,
    completed: 0,
    conversionRate: 0,
    averageTimeToHire: 0,
  })
  const [applicants, setApplicants] = useState<any[]>([])
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [messages, setMessages] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("month")

  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState({
    applicantsBySource: [
      { name: "Social Media", value: 35 },
      { name: "Events", value: 25 },
      { name: "Referrals", value: 20 },
      { name: "Website", value: 15 },
      { name: "Other", value: 5 },
    ],
    applicantsByStatus: [
      { name: "Pending", value: 30 },
      { name: "Contacted", value: 25 },
      { name: "Interested", value: 20 },
      { name: "Applied", value: 15 },
      { name: "Hired", value: 10 },
    ],
    applicantsTrend: [
      { name: "Jan", applicants: 12 },
      { name: "Feb", applicants: 19 },
      { name: "Mar", applicants: 15 },
      { name: "Apr", applicants: 22 },
      { name: "May", applicants: 30 },
      { name: "Jun", applicants: 28 },
    ],
    conversionRates: [
      { name: "Contact → Interest", rate: 65 },
      { name: "Interest → Application", rate: 45 },
      { name: "Application → Hire", rate: 25 },
    ],
  })

  const COLORS = ["#0A3C1F", "#2E7D32", "#66BB6A", "#A5D6A7", "#E8F5E9"]

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/volunteer-login")
        return
      }

      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      // Fetch applicants
      const { data: applicantData } = await supabase
        .from("applicants")
        .select("*")
        .order("created_at", { ascending: false })

      if (applicantData) {
        setApplicants(applicantData)

        // Calculate stats
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const hiredCount = applicantData.filter((a) => a.application_status === "hired").length

        setStats({
          totalApplicants: applicantData.length,
          newApplicants: applicantData.filter((a) => new Date(a.created_at) > oneWeekAgo).length,
          inProgress: applicantData.filter(
            (a) =>
              a.application_status === "pending" ||
              a.application_status === "contacted" ||
              a.application_status === "interested",
          ).length,
          completed: applicantData.filter(
            (a) =>
              a.application_status === "applied" ||
              a.application_status === "hired" ||
              a.application_status === "rejected",
          ).length,
          conversionRate: applicantData.length > 0 ? Math.round((hiredCount / applicantData.length) * 100) : 0,
          averageTimeToHire: 21, // Mock data - average days to hire
        })
      }

      // Fetch messages (mock data for now)
      setMessages([
        {
          id: 1,
          sender: "John Smith",
          message: "I'm interested in learning more about the physical requirements.",
          date: "2023-05-01T10:30:00Z",
          read: true,
        },
        {
          id: 2,
          sender: "Maria Rodriguez",
          message: "When is the next recruitment event?",
          date: "2023-05-02T14:15:00Z",
          read: false,
        },
        {
          id: 3,
          sender: "David Johnson",
          message: "I submitted my application yesterday. Can you confirm receipt?",
          date: "2023-05-03T09:45:00Z",
          read: false,
        },
      ])

      // Fetch tasks (mock data for now)
      setTasks([
        {
          id: 1,
          title: "Follow up with Michael Chen",
          dueDate: "2023-05-10T00:00:00Z",
          completed: false,
          priority: "high",
        },
        {
          id: 2,
          title: "Review Sarah Williams' application",
          dueDate: "2023-05-08T00:00:00Z",
          completed: false,
          priority: "medium",
        },
        {
          id: 3,
          title: "Send information packet to James Brown",
          dueDate: "2023-05-05T00:00:00Z",
          completed: true,
          priority: "low",
        },
      ])

      // Fetch events (mock data)
      setEvents([
        {
          id: 1,
          title: "Community Job Fair",
          date: "2023-06-15T10:00:00Z",
          location: "Mission District Community Center",
          description: "Annual job fair targeting diverse communities",
          attendees: 12,
          status: "upcoming",
        },
        {
          id: 2,
          title: "College Campus Recruitment",
          date: "2023-06-22T13:00:00Z",
          location: "City College of San Francisco",
          description: "Presentation to criminal justice students",
          attendees: 8,
          status: "upcoming",
        },
        {
          id: 3,
          title: "Veterans Outreach",
          date: "2023-07-05T09:00:00Z",
          location: "Veterans Resource Center",
          description: "Special recruitment session for veterans",
          attendees: 5,
          status: "upcoming",
        },
        {
          id: 4,
          title: "Virtual Info Session",
          date: "2023-05-20T18:00:00Z",
          location: "Online (Zoom)",
          description: "General information session about careers in law enforcement",
          attendees: 25,
          status: "completed",
        },
      ])

      // Fetch resources (mock data)
      setResources([
        {
          id: 1,
          title: "Recruitment Brochure",
          type: "PDF",
          description: "Official brochure highlighting benefits and requirements",
          url: "#",
          downloads: 45,
        },
        {
          id: 2,
          title: "Application Process Guide",
          type: "PDF",
          description: "Step-by-step guide to the application process",
          url: "#",
          downloads: 32,
        },
        {
          id: 3,
          title: "Physical Fitness Standards",
          type: "PDF",
          description: "Detailed information about physical requirements",
          url: "#",
          downloads: 28,
        },
        {
          id: 4,
          title: "Recruitment Presentation",
          type: "PPTX",
          description: "Slides for recruitment presentations",
          url: "#",
          downloads: 15,
        },
        {
          id: 5,
          title: "Frequently Asked Questions",
          type: "PDF",
          description: "Answers to common questions from applicants",
          url: "#",
          downloads: 37,
        },
      ])

      // Fetch team members (mock data)
      setTeamMembers([
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Lead Recruiter",
          avatar: "/female-law-enforcement-headshot.png",
          applicants: 28,
          hires: 12,
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Community Outreach",
          avatar: "/asian-male-officer-headshot.png",
          applicants: 22,
          hires: 8,
        },
        {
          id: 3,
          name: "Robert Davis",
          role: "Veterans Liaison",
          avatar: "/male-law-enforcement-headshot.png",
          applicants: 15,
          hires: 6,
        },
      ])

      // Fetch goals (mock data)
      setGoals([
        {
          id: 1,
          title: "Q2 Recruitment Target",
          target: 50,
          current: 32,
          deadline: "2023-06-30T00:00:00Z",
          category: "general",
        },
        {
          id: 2,
          title: "Veteran Recruitment",
          target: 15,
          current: 7,
          deadline: "2023-06-30T00:00:00Z",
          category: "diversity",
        },
        {
          id: 3,
          title: "Female Applicants",
          target: 25,
          current: 18,
          deadline: "2023-06-30T00:00:00Z",
          category: "diversity",
        },
        {
          id: 4,
          title: "Community Events",
          target: 8,
          current: 5,
          deadline: "2023-06-30T00:00:00Z",
          category: "outreach",
        },
      ])

      // Fetch notifications (mock data)
      setNotifications([
        {
          id: 1,
          type: "application",
          message: "New application from James Wilson",
          time: "10 minutes ago",
          read: false,
        },
        {
          id: 2,
          type: "message",
          message: "Maria Rodriguez replied to your message",
          time: "1 hour ago",
          read: false,
        },
        {
          id: 3,
          type: "event",
          message: "Community Job Fair is tomorrow",
          time: "3 hours ago",
          read: true,
        },
        {
          id: 4,
          type: "goal",
          message: "You're 75% to your Q2 recruitment goal!",
          time: "1 day ago",
          read: true,
        },
      ])

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/volunteer-login")
  }

  const toggleApplicantDetails = (id: string) => {
    if (expandedApplicant === id) {
      setExpandedApplicant(null)
    } else {
      setExpandedApplicant(id)
    }
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.phone?.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || applicant.application_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "contacted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
            Contacted
          </Badge>
        )
      case "interested":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300">
            Interested
          </Badge>
        )
      case "applied":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-300">
            Applied
          </Badge>
        )
      case "hired":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
            Hired
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>

        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-32 mr-4" />
          <Skeleton className="h-10 w-32 mr-4" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">Volunteer Recruiter Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-sm text-[#0A3C1F]">
                    Mark all as read
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${notification.read ? "" : "bg-gray-50"}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {notification.type === "application" && <FileText className="h-5 w-5 text-blue-500" />}
                          {notification.type === "message" && <MessageSquare className="h-5 w-5 text-purple-500" />}
                          {notification.type === "event" && <Calendar className="h-5 w-5 text-orange-500" />}
                          {notification.type === "goal" && <Target className="h-5 w-5 text-green-500" />}
                        </div>
                        <div>
                          <p className={`text-sm ${notification.read ? "text-gray-600" : "font-medium text-gray-900"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
              <div className="p-2 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full text-sm text-[#0A3C1F]">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Applicants</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.totalApplicants}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-sm text-gray-500">
              <Users className="inline h-4 w-4 mr-1" />
              Potential recruits
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">New Applicants</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.newApplicants}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-sm text-gray-500">
              <FileText className="inline h-4 w-4 mr-1" />
              Recent submissions
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Conversion Rate</CardTitle>
            <CardDescription>Applications to hires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.conversionRate}%</div>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-sm text-gray-500">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              Effectiveness metric
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Avg. Time to Hire</CardTitle>
            <CardDescription>From first contact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.averageTimeToHire} days</div>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-sm text-gray-500">
              <Clock className="inline h-4 w-4 mr-1" />
              Process duration
            </span>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="applicants" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="applicants" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search applicants..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Applicant
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((applicant) => (
                    <>
                      <TableRow key={applicant.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {applicant.first_name} {applicant.last_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {applicant.email}
                            </span>
                            {applicant.phone && (
                              <span className="text-sm flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {applicant.phone}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(applicant.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(applicant.application_status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toggleApplicantDetails(applicant.id)}>
                              {expandedApplicant === applicant.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                              <span className="sr-only">Message</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedApplicant === applicant.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-gray-50 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-[#0A3C1F] mb-2">Applicant Details</h4>
                                <dl className="grid grid-cols-3 gap-2 text-sm">
                                  <dt className="font-medium">Age:</dt>
                                  <dd className="col-span-2">{applicant.age || "Not provided"}</dd>

                                  <dt className="font-medium">Location:</dt>
                                  <dd className="col-span-2">{applicant.city || "Not provided"}</dd>

                                  <dt className="font-medium">Experience:</dt>
                                  <dd className="col-span-2">{applicant.experience || "Not provided"}</dd>

                                  <dt className="font-medium">Education:</dt>
                                  <dd className="col-span-2">{applicant.education || "Not provided"}</dd>

                                  <dt className="font-medium">Veteran:</dt>
                                  <dd className="col-span-2">{applicant.is_veteran ? "Yes" : "No"}</dd>
                                </dl>
                              </div>

                              <div>
                                <h4 className="font-medium text-[#0A3C1F] mb-2">Application Progress</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Initial Contact</span>
                                    {["contacted", "interested", "applied", "hired"].includes(
                                      applicant.application_status,
                                    ) ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-yellow-600" />
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Information Provided</span>
                                    {["interested", "applied", "hired"].includes(applicant.application_status) ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-yellow-600" />
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Application Submitted</span>
                                    {["applied", "hired"].includes(applicant.application_status) ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-yellow-600" />
                                    )}
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">Hiring Process</span>
                                    {["hired"].includes(applicant.application_status) ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : applicant.application_status === "rejected" ? (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-yellow-600" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="font-medium text-[#0A3C1F] mb-2">Communication History</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                                <div className="flex gap-3 p-2 border-b">
                                  <div className="flex-shrink-0">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-[#0A3C1F] text-white">
                                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div>
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium">Initial outreach email</p>
                                      <span className="text-xs text-gray-500">May 2, 2023</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Sent welcome email with information packet and next steps.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-3 p-2 border-b">
                                  <div className="flex-shrink-0">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-gray-200 text-gray-700">
                                        {applicant.first_name?.charAt(0) || "A"}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div>
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium">Response received</p>
                                      <span className="text-xs text-gray-500">May 3, 2023</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Expressed interest and asked about physical requirements.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-3 p-2">
                                  <div className="flex-shrink-0">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-[#0A3C1F] text-white">
                                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div>
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium">Follow-up call</p>
                                      <span className="text-xs text-gray-500">May 5, 2023</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Discussed physical requirements and scheduled an in-person meeting.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                              <Select defaultValue={applicant.application_status}>
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Update status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="interested">Interested</SelectItem>
                                  <SelectItem value="applied">Applied</SelectItem>
                                  <SelectItem value="hired">Hired</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>

                              <Button variant="outline" size="sm">
                                Add Note
                              </Button>

                              <Button variant="outline" size="sm">
                                Send Email
                              </Button>

                              <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                                Save Changes
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-500">No applicants found</h3>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0A3C1F]">Recruitment Analytics</h2>
            <div className="flex gap-2">
              <Select value={analyticsTimeframe} onValueChange={setAnalyticsTimeframe}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applicants by Source</CardTitle>
                <CardDescription>Where your applicants are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analyticsData.applicantsBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.applicantsBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applicants by Status</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.applicantsByStatus}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0A3C1F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applicant Trend</CardTitle>
                <CardDescription>Monthly applicant volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.applicantsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="applicants" stroke="#0A3C1F" fill="#0A3C1F" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>Effectiveness at each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.conversionRates} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#0A3C1F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recruitment Funnel</CardTitle>
              <CardDescription>Applicant journey through the recruitment process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-[#0A3C1F]/10 flex items-center justify-center mb-2">
                    <Users className="h-12 w-12 text-[#0A3C1F]" />
                  </div>
                  <h3 className="font-medium text-center">Initial Interest</h3>
                  <p className="text-2xl font-bold text-[#0A3C1F]">100</p>
                  <p className="text-sm text-gray-500">100%</p>
                </div>
                <div className="hidden md:block">
                  <ChevronDown className="h-8 w-8 text-gray-300 rotate-90 md:rotate-0" />
                </div>
                <div className="block md:hidden">
                  <ChevronDown className="h-8 w-8 text-gray-300" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-[#0A3C1F]/20 flex items-center justify-center mb-2">
                    <MessageSquare className="h-10 w-10 text-[#0A3C1F]" />
                  </div>
                  <h3 className="font-medium text-center">Initial Contact</h3>
                  <p className="text-2xl font-bold text-[#0A3C1F]">75</p>
                  <p className="text-sm text-gray-500">75%</p>
                </div>
                <div className="hidden md:block">
                  <ChevronDown className="h-8 w-8 text-gray-300 rotate-90 md:rotate-0" />
                </div>
                <div className="block md:hidden">
                  <ChevronDown className="h-8 w-8 text-gray-300" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-[#0A3C1F]/30 flex items-center justify-center mb-2">
                    <FileText className="h-8 w-8 text-[#0A3C1F]" />
                  </div>
                  <h3 className="font-medium text-center">Application</h3>
                  <p className="text-2xl font-bold text-[#0A3C1F]">45</p>
                  <p className="text-sm text-gray-500">45%</p>
                </div>
                <div className="hidden md:block">
                  <ChevronDown className="h-8 w-8 text-gray-300 rotate-90 md:rotate-0" />
                </div>
                <div className="block md:hidden">
                  <ChevronDown className="h-8 w-8 text-gray-300" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-[#0A3C1F]/40 flex items-center justify-center mb-2">
                    <Briefcase className="h-6 w-6 text-[#0A3C1F]" />
                  </div>
                  <h3 className="font-medium text-center">Hired</h3>
                  <p className="text-2xl font-bold text-[#0A3C1F]">15</p>
                  <p className="text-sm text-gray-500">15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0A3C1F]">Recruitment Events</h2>
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events scheduled in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .filter((e) => e.status === "upcoming")
                    .map((event) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-[#0A3C1F]">{event.title}</h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                              {new Date(event.date).toLocaleDateString()} at{" "}
                              {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{event.attendees} confirmed attendees</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
                <CardDescription>Recently completed events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .filter((e) => e.status === "completed")
                    .map((event) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-[#0A3C1F]">{event.title}</h3>
                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                            Completed
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                              {new Date(event.date).toLocaleDateString()} at{" "}
                              {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Results
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Planning</CardTitle>
              <CardDescription>Create and manage recruitment events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-[#0A3C1F] mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input id="event-title" placeholder="Enter event title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea id="event-description" placeholder="Enter event description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input id="event-location" placeholder="Enter event location" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select>
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job-fair">Job Fair</SelectItem>
                          <SelectItem value="info-session">Information Session</SelectItem>
                          <SelectItem value="campus-visit">Campus Visit</SelectItem>
                          <SelectItem value="community-outreach">Community Outreach</SelectItem>
                          <SelectItem value="virtual">Virtual Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#0A3C1F] mb-4">Event Resources</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Required Materials</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="materials-brochures" />
                          <label htmlFor="materials-brochures" className="text-sm">
                            Recruitment Brochures
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="materials-banners" />
                          <label htmlFor="materials-banners" className="text-sm">
                            Banners and Signage
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="materials-applications" />
                          <label htmlFor="materials-applications" className="text-sm">
                            Application Forms
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="materials-presentation" />
                          <label htmlFor="materials-presentation" className="text-sm">
                            Presentation Materials
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="materials-giveaways" />
                          <label htmlFor="materials-giveaways" className="text-sm">
                            Promotional Items
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Team Members Assigned</Label>
                      <div className="space-y-2">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <Checkbox id={`team-${member.id}`} />
                            <label htmlFor={`team-${member.id}`} className="text-sm flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {member.name} ({member.role})
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-notes">Additional Notes</Label>
                      <Textarea id="event-notes" placeholder="Any special requirements or notes" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">Save Event</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0A3C1F]">Recruitment Resources</h2>
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <FileUp className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Materials</CardTitle>
                <CardDescription>Recruitment documents and forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources
                    .filter((r) => r.type === "PDF")
                    .map((resource) => (
                      <div key={resource.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="bg-red-100 rounded-lg p-2">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{resource.downloads} downloads</span>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Presentations</CardTitle>
                <CardDescription>Slides and presentation materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources
                    .filter((r) => r.type === "PPTX")
                    .map((resource) => (
                      <div key={resource.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{resource.downloads} downloads</span>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Templates</CardTitle>
                <CardDescription>Pre-written emails and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="bg-purple-100 rounded-lg p-2">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Initial Contact Template</h4>
                      <p className="text-sm text-gray-600">First outreach to potential recruits</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Used 32 times</span>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="bg-green-100 rounded-lg p-2">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Follow-up Template</h4>
                      <p className="text-sm text-gray-600">For applicants who haven't responded</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Used 18 times</span>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="bg-orange-100 rounded-lg p-2">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Application Confirmation</h4>
                      <p className="text-sm text-gray-600">Confirmation of application receipt</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Used 45 times</span>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Library</CardTitle>
              <CardDescription>Search and manage all recruitment resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="search" placeholder="Search resources..." className="pl-9" />
                  </div>

                  <Select defaultValue="all">
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">Documents (PDF)</SelectItem>
                      <SelectItem value="pptx">Presentations</SelectItem>
                      <SelectItem value="docx">Word Documents</SelectItem>
                      <SelectItem value="xlsx">Spreadsheets</SelectItem>
                      <SelectItem value="template">Email Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Resource Guide
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Manage
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {resource.type}
                        </Badge>
                      </TableCell>
                      <TableCell>May 10, 2023</TableCell>
                      <TableCell>{resource.downloads}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0A3C1F]">Recruitment Team</h2>
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="bg-[#0A3C1F]/10 text-[#0A3C1F]">
                      {member.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium text-lg">{member.name}</h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Applicants Referred</span>
                        <span className="font-medium">{member.applicants}</span>
                      </div>
                      <Progress value={(member.applicants / 30) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Successful Hires</span>
                        <span className="font-medium">{member.hires}</span>
                      </div>
                      <Progress value={(member.hires / 15) * 100} className="h-2" />
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span className="font-medium">{Math.round((member.hires / member.applicants) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Recruitment metrics by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Hires</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Avg. Time to Hire</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.applicants}</TableCell>
                      <TableCell>{member.hires}</TableCell>
                      <TableCell>{Math.round((member.hires / member.applicants) * 100)}%</TableCell>
                      <TableCell>{Math.round(15 + Math.random() * 10)} days</TableCell>
                      <TableCell>Today at 2:30 PM</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Communication</CardTitle>
                <CardDescription>Recent messages and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  <div className="flex gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/female-law-enforcement-headshot.png" alt="Sarah Johnson" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium">Sarah Johnson</h4>
                        <span className="text-xs text-gray-500">Today at 9:30 AM</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Just confirmed our booth at the community job fair next week. We'll need extra brochures and at
                        least 3 team members.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/asian-male-officer-headshot.png" alt="Michael Chen" />
                      <AvatarFallback>MC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium">Michael Chen</h4>
                        <span className="text-xs text-gray-500">Yesterday at 4:15 PM</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        I've updated the presentation for college visits. Added more information about benefits and
                        career progression.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/male-law-enforcement-headshot.png" alt="Robert Davis" />
                      <AvatarFallback>RD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium">Robert Davis</h4>
                        <span className="text-xs text-gray-500">May 5, 2023</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Great news! Two of our veteran applicants have passed the background check and will be starting
                        next month.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">Send</Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Resources</CardTitle>
                <CardDescription>Training and support materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                      Recruiter Training Guide
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Comprehensive guide for volunteer recruiters with best practices and procedures.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-1" />
                      Download Guide
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                      Frequently Asked Questions
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Common questions from applicants and suggested responses.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-1" />
                      Download FAQ
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                      Event Planning Checklist
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Step-by-step checklist for planning and executing successful recruitment events.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-1" />
                      Download Checklist
                    </Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-[#0A3C1F]" />
                      Need Help?
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Contact the recruitment coordinator for assistance or questions.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Get Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0A3C1F]">Recruitment Goals</h2>
            <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              <Target className="h-4 w-4 mr-2" />
              Set New Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Goals</CardTitle>
                <CardDescription>Track progress towards recruitment targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge
                          variant="outline"
                          className={
                            goal.category === "diversity"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : goal.category === "outreach"
                                ? "bg-blue-50 text-blue-800 border-blue-300"
                                : "bg-green-50 text-green-800 border-green-300"
                          }
                        >
                          {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>
                          {goal.current} of {goal.target} ({Math.round((goal.current / goal.target) * 100)}%)
                        </span>
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Setting</CardTitle>
                <CardDescription>Create and manage recruitment goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input id="goal-title" placeholder="Enter goal title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea id="goal-description" placeholder="Enter goal description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal-target">Target Number</Label>
                      <Input id="goal-target" type="number" placeholder="Enter target" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-deadline">Deadline</Label>
                      <Input id="goal-deadline" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-category">Category</Label>
                    <Select>
                      <SelectTrigger id="goal-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Recruitment</SelectItem>
                        <SelectItem value="diversity">Diversity Initiative</SelectItem>
                        <SelectItem value="outreach">Community Outreach</SelectItem>
                        <SelectItem value="veterans">Veteran Recruitment</SelectItem>
                        <SelectItem value="retention">Retention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-team">Assign to Team Members</Label>
                    <Select>
                      <SelectTrigger id="goal-team">
                        <SelectValue placeholder="Select team members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Team Members</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">Save Goal</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Goal Analytics</CardTitle>
              <CardDescription>Performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#0A3C1F]/5 rounded-lg p-4 text-center">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Overall Completion Rate</h3>
                  <div className="text-3xl font-bold text-[#0A3C1F]">68%</div>
                  <p className="text-sm text-gray-500 mt-1">Across all goals</p>
                </div>
                <div className="bg-[#0A3C1F]/5 rounded-lg p-4 text-center">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Goals Achieved</h3>
                  <div className="text-3xl font-bold text-[#0A3C1F]">12</div>
                  <p className="text-sm text-gray-500 mt-1">Last 12 months</p>
                </div>
                <div className="bg-[#0A3C1F]/5 rounded-lg p-4 text-center">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Current Progress</h3>
                  <div className="text-3xl font-bold text-[#0A3C1F]">62%</div>
                  <p className="text-sm text-gray-500 mt-1">Q2 goals</p>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Q1", target: 40, achieved: 35 },
                      { name: "Q2", target: 50, achieved: 31 },
                      { name: "Q3", target: 60, achieved: 0 },
                      { name: "Q4", target: 70, achieved: 0 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" name="Target" fill="#0A3C1F" />
                    <Bar dataKey="achieved" name="Achieved" fill="#66BB6A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
