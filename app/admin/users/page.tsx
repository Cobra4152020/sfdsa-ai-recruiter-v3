"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { UserTable } from "@/components/admin/user-table"
import { UserStats } from "@/components/admin/user-stats"
import { PendingVolunteers } from "@/components/admin/pending-volunteers"
import { Pagination } from "@/components/ui/pagination"
import {
  getAllUsers,
  getUserStats,
  type UserWithRole,
  type UserRole,
  type UserStatus,
} from "@/lib/user-management-service"
import { Search, RefreshCw, Filter, X } from "lucide-react"

export default function AdminUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get query parameters
  const pageParam = searchParams.get("page")
  const searchParam = searchParams.get("search")
  const roleParam = searchParams.get("role") as UserRole | null
  const statusParam = searchParams.get("status") as UserStatus | null
  const tabParam = searchParams.get("tab") || "all"

  // State
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParam || "")
  const [role, setRole] = useState<UserRole | "">(roleParam || "")
  const [status, setStatus] = useState<UserStatus | "">(statusParam || "")
  const [page, setPage] = useState(pageParam ? Number.parseInt(pageParam) : 1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeTab, setActiveTab] = useState(tabParam)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const limit = 10

  // Load users and stats
  useEffect(() => {
    loadUsers()
    loadStats()
  }, [page, role, status, searchTerm, activeTab])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set("page", page.toString())
    if (searchTerm) params.set("search", searchTerm)
    if (role) params.set("role", role)
    if (status) params.set("status", status)
    if (activeTab !== "all") params.set("tab", activeTab)

    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : "/admin/users")
  }, [page, searchTerm, role, status, activeTab, router])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // Set role based on active tab
      let tabRole: UserRole | undefined
      if (activeTab === "recruits") tabRole = "recruit"
      else if (activeTab === "volunteers") tabRole = "volunteer"
      else if (activeTab === "admins") tabRole = "admin"

      const { users, total } = await getAllUsers({
        page,
        limit,
        search: searchTerm,
        role: tabRole || (role as UserRole) || undefined,
        status: status as UserStatus,
      })

      setUsers(users)
      setTotalUsers(total)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const stats = await getUserStats()
      setStats(stats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([loadUsers(), loadStats()])
    setIsRefreshing(false)
    toast({
      title: "Refreshed",
      description: "User data has been refreshed.",
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setRole("")
    setStatus("")
    setPage(1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setPage(1) // Reset to first page on tab change
  }

  const totalPages = Math.ceil(totalUsers / limit)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A3C1F]">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="mt-4 md:mt-0" disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {stats && <UserStats stats={stats} />}

      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="recruits">Recruits</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search by email or name..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </form>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole | "")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="recruit">Recruits</SelectItem>
                      <SelectItem value="volunteer">Volunteers</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={status} onValueChange={(value) => setStatus(value as UserStatus | "")}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchTerm || role || status) && (
                    <Button variant="outline" onClick={handleClearFilters} className="flex items-center">
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="all">
          <UserTable users={users} loading={loading} onRefresh={loadUsers} />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </TabsContent>

        <TabsContent value="recruits">
          <UserTable users={users} loading={loading} onRefresh={loadUsers} />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </TabsContent>

        <TabsContent value="volunteers">
          <UserTable users={users} loading={loading} onRefresh={loadUsers} />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </TabsContent>

        <TabsContent value="admins">
          <UserTable users={users} loading={loading} onRefresh={loadUsers} />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </TabsContent>

        <TabsContent value="pending">
          <PendingVolunteers onApproved={loadUsers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
