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

export default function VolunteerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalApplicants: 0,
    newApplicants: 0,
    inProgress: 0,
    completed: 0,
  })
  const [applicants, setApplicants] = useState<any[]>([])
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [messages, setMessages] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

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

        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
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
            <CardTitle className="text-lg font-medium">In Progress</CardTitle>
            <CardDescription>Active applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.inProgress}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-sm text-gray-500">
              <Clock className="inline h-4 w-4 mr-1" />
              Needs follow-up
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Completed</CardTitle>
            <CardDescription>Finalized applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A3C1F]">{stats.completed}</div>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-sm text-gray-500">
              <CheckCircle className="inline h-4 w-4 mr-1" />
              Processed fully
            </span>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="applicants" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
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

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
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

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Communications from potential recruits</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`border-l-4 ${message.read ? "border-gray-200" : "border-[#0A3C1F]"} pl-4 py-2`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{message.sender}</h3>
                        <span className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Mark as {message.read ? "Unread" : "Read"}
                        </Button>
                        <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-500">No messages</h3>
                  <p className="text-sm text-gray-400">You're all caught up!</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Messages
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recruitment Tasks</CardTitle>
                  <CardDescription>Your upcoming and completed tasks</CardDescription>
                </div>
                <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <div
                        className={`mt-1 flex-shrink-0 ${task.completed ? "text-green-500" : task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-blue-500"}`}
                      >
                        {task.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                            {task.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge
                            variant="outline"
                            className={
                              task.priority === "high"
                                ? "bg-red-50 text-red-800 border-red-300"
                                : task.priority === "medium"
                                  ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                                  : "bg-blue-50 text-blue-800 border-blue-300"
                            }
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant={task.completed ? "outline" : "default"}
                              size="sm"
                              className={!task.completed ? "bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white" : ""}
                            >
                              {task.completed ? "Mark Incomplete" : "Mark Complete"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-500">No tasks</h3>
                  <p className="text-sm text-gray-400">Add a task to get started</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Tasks
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
