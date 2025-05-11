"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { UserActivity } from "@/components/admin/user-activity"
import {
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  type UserWithRole,
  type UserRole,
} from "@/lib/user-management-service"
import { ArrowLeft, Save, Trash, RefreshCw, Shield, UserCog, User } from "lucide-react"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<UserWithRole>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState<UserRole>("recruit")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isChangingRole, setIsChangingRole] = useState(false)

  useEffect(() => {
    loadUser()
  }, [params.id])

  const loadUser = async () => {
    setLoading(true)
    try {
      const userData = await getUserById(params.id)
      if (userData) {
        setUser(userData)
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          organization: userData.organization || "",
          status: userData.status || "active",
        })
      } else {
        toast({
          title: "User not found",
          description: "The requested user could not be found.",
          variant: "destructive",
        })
        router.push("/admin/users")
      }
    } catch (error) {
      console.error("Error loading user:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const result = await updateUser(user.id, formData)
      if (result.success) {
        toast({
          title: "User updated",
          description: "The user has been successfully updated.",
        })
        loadUser() // Reload user data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        })
        router.push("/admin/users")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete user.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleChangeRole = async () => {
    if (!user) return

    setIsChangingRole(true)
    try {
      const result = await changeUserRole(user.id, newRole)
      if (result.success) {
        toast({
          title: "Role changed",
          description: `The user's role has been changed to ${newRole}.`,
        })
        loadUser() // Reload user data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change user role.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error changing user role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsChangingRole(false)
      setChangeRoleDialogOpen(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-5 w-5 text-red-500" />
      case "volunteer":
        return <UserCog className="h-5 w-5 text-blue-500" />
      default:
        return <User className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <h3 className="text-lg font-medium text-gray-900">User not found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested user could not be found.</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#0A3C1F]">User Details</h1>
            <div className="flex items-center mt-1">
              {getRoleIcon(user.user_type || "recruit")}
              <span className="ml-2 text-gray-600 capitalize">{user.user_type || "recruit"}</span>
            </div>
          </div>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete User
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setNewRole(user.user_type as UserRole)
              setChangeRoleDialogOpen(true)
            }}
          >
            <UserCog className="h-4 w-4 mr-2" />
            Change Role
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>View and edit user information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={formData.email || ""} onChange={handleInputChange} disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || "active"}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleInputChange} />
                </div>

                {user.user_type === "volunteer" && (
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={loadUser}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <UserActivity userId={user.id} />
        </TabsContent>
      </Tabs>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={changeRoleDialogOpen} onOpenChange={setChangeRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for this user. This will change their permissions and access level.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">New Role</Label>
            <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruit">Recruit</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleDialogOpen(false)} disabled={isChangingRole}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={isChangingRole || newRole === user.user_type}>
              {isChangingRole ? "Changing..." : "Change Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
