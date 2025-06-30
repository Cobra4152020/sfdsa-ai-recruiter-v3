"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/components/admin/user-table";
import { UserStats } from "@/components/admin/user-stats";
import { PendingVolunteers } from "@/components/admin/pending-volunteers";
import { Pagination } from "@/components/ui/pagination";
import { Search, Filter, X } from "lucide-react";

// Temporary fallback types if '@/types/user' is missing
type UserRole = "recruit" | "volunteer" | "admin";
type UserStatus = "active" | "pending" | "inactive";
interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  type: string;
  has_applied: boolean;
  has_completed_profile: boolean;
  has_verified_email: boolean;
  is_active?: boolean;
}
interface UserStatsType {
  total_users: number;
  active_users: number;
  recruits: number;
  volunteers: number;
  admins: number;
  pending_volunteers: number;
  recent_signups: number;
}

// Static mock data
const mockUsers: UserWithRole[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    role: "recruit",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    type: "recruit",
    has_applied: false,
    has_completed_profile: true,
    has_verified_email: true,
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "volunteer",
    status: "active",
    created_at: "2024-01-02T00:00:00Z",
    type: "volunteer",
    has_applied: true,
    has_completed_profile: true,
    has_verified_email: true,
    is_active: true,
  },
];

// Static mock stats
const mockStats: UserStatsType = {
  total_users: 100,
  active_users: 80,
  recruits: 60,
  volunteers: 30,
  admins: 10,
  pending_volunteers: 5,
  recent_signups: 15,
};

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters
  const pageParam = searchParams?.get("page");
  const searchParam = searchParams?.get("search");
  const roleParam = searchParams?.get("role") as UserRole | null;
  const statusParam = searchParams?.get("status") as UserStatus | null;
  const tabParam = searchParams?.get("tab") || "all";

  // State
  const [users, setUsers] = useState<UserWithRole[]>(mockUsers);
  const [stats] = useState<UserStatsType>(mockStats);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [role, setRole] = useState<UserRole | "">(roleParam || "");
  const [status, setStatus] = useState<UserStatus | "">(statusParam || "");
  const [page, setPage] = useState(pageParam ? Number.parseInt(pageParam) : 1);
  const [totalUsers] = useState(mockStats.total_users);
  const [activeTab, setActiveTab] = useState(tabParam);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    if (activeTab !== "all") params.set("tab", activeTab);

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/admin/users");
  }, [page, searchTerm, role, status, activeTab, router]);

  // Filter users based on search term, role, and status
  useEffect(() => {
    const filteredUsers = mockUsers.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });

    setUsers(filteredUsers);
  }, [searchTerm, role, status]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
      </div>

      {stats && <UserStats stats={stats} />}

      <Tabs
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="mt-8"
      >
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
                <form onSubmit={(e) => e.preventDefault()} className="flex-1">
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
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole | "")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="recruit">Recruits</SelectItem>
                      <SelectItem value="volunteer">Volunteers</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value as UserStatus | "")
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchTerm || role || status) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setRole("");
                        setStatus("");
                        setPage(1);
                      }}
                      className="flex items-center"
                    >
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
          <UserTable users={users} loading={loading} onRefresh={() => {}} />
          {totalUsers > 10 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalUsers / 10)}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </TabsContent>

        <TabsContent value="recruits">
          <UserTable
            users={users.filter((u) => u.role === "recruit")}
            loading={loading}
            onRefresh={() => {}}
          />
        </TabsContent>

        <TabsContent value="volunteers">
          <UserTable
            users={users.filter((u) => u.role === "volunteer")}
            loading={loading}
            onRefresh={() => {}}
          />
        </TabsContent>

        <TabsContent value="admins">
          <UserTable
            users={users.filter((u) => u.role === "admin")}
            loading={loading}
            onRefresh={() => {}}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingVolunteers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
