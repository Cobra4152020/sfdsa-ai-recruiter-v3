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
  type RecruitUser,
  type VolunteerUser,
  type AdminUser,
} from "@/lib/user-management-service"
import { ArrowLeft, Save, Trash, RefreshCw, Shield, UserCog, User } from "lucide-react"
import Link from "next/link"

type FormData = {
  recruit: Partial<RecruitUser>;
  volunteer: Partial<VolunteerUser>;
  admin: Partial<AdminUser>;
}

interface AdminUserPageClientProps {
  params: {
    id: string;
  };
}

export function AdminUserPageClient({ params }: AdminUserPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>("recruit")
  const [formData, setFormData] = useState<FormData["recruit"] | FormData["volunteer"] | FormData["admin"]>({})

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const userData = await getUserById(params.id)
      setUser(userData)
      if (userData) {
        switch (userData.user_type) {
          case "recruit": {
            const recruitUser = userData as RecruitUser
            const recruitFormData: FormData["recruit"] = {
              email: recruitUser.email,
              first_name: recruitUser.first_name,
              last_name: recruitUser.last_name,
              phone: recruitUser.phone,
              user_type: "recruit",
            }
            setFormData(recruitFormData)
            break
          }
          case "volunteer": {
            const volunteerUser = userData as VolunteerUser
            const volunteerFormData: FormData["volunteer"] = {
              email: volunteerUser.email,
              first_name: volunteerUser.first_name,
              last_name: volunteerUser.last_name,
              phone: volunteerUser.phone,
              organization: volunteerUser.organization,
              user_type: "volunteer",
            }
            setFormData(volunteerFormData)
            break
          }
          case "admin": {
            const adminUser = userData as AdminUser
            const adminFormData: FormData["admin"] = {
              email: adminUser.email,
              name: adminUser.name,
              user_type: "admin",
            }
            setFormData(adminFormData)
            break
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await updateUser(user.id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "The user has been successfully updated.",
        })
        fetchUser() // Reload user data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      const result = await deleteUser(user.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "The user has been successfully deleted.",
        })
        router.push("/admin/users")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleChangeRole = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await changeUserRole(user.id, selectedRole)

      if (result.success) {
        toast({
          title: "Role changed",
          description: `The user's role has been changed to ${selectedRole}.`,
        })
        fetchUser() // Reload user data
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change user role",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error changing user role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowRoleChangeConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">The requested user could not be found.</p>
          <Button asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Edit User</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete User
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRole(user.user_type as UserRole)
                setShowRoleChangeConfirm(true)
              }}
            >
              <Shield className="h-4 w-4 mr-2" />
              Change Role
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update the user's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {user.user_type === "recruit" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={(formData as FormData["recruit"]).first_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value } as FormData["recruit"])
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={(formData as FormData["recruit"]).last_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value } as FormData["recruit"])
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={(formData as FormData["recruit"]).phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value } as FormData["recruit"])}
                    />
                  </div>
                </>
              )}

              {user.user_type === "volunteer" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={(formData as FormData["volunteer"]).first_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value } as FormData["volunteer"])
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={(formData as FormData["volunteer"]).last_name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value } as FormData["volunteer"])
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={(formData as FormData["volunteer"]).phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value } as FormData["volunteer"])
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={(formData as FormData["volunteer"]).organization || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value } as FormData["volunteer"])
                      }
                    />
                  </div>
                </>
              )}

              {user.user_type === "admin" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={(formData as FormData["admin"]).name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value } as FormData["admin"])}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={fetchUser}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
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

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>View user's recent activity and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivity userId={user.id} />
            </CardContent>
          </Card>
        </div>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Role Dialog */}
        <Dialog open={showRoleChangeConfirm} onOpenChange={setShowRoleChangeConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Select a new role for this user. This will affect their permissions and access level.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="role">New Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
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
              <Button variant="outline" onClick={() => setShowRoleChangeConfirm(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleChangeRole} disabled={isLoading || selectedRole === user.user_type}>
                {isLoading ? "Changing..." : "Change Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 