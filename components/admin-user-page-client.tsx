"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
import type {
  UserWithRole,
  UserRole,
  RecruitUser,
  VolunteerUser,
  AdminUser,
} from "@/lib/user-management-service"
import { ArrowLeft, Save, Trash, RefreshCw, Shield, UserCog, User } from "lucide-react"
import Link from "next/link"
import { getClientSideSupabase } from "@/lib/supabase"

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

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const supabase = getClientSideSupabase()
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      if (userData) {
        setUser(userData)
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
  }, [params.id, toast])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleSave = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const supabase = getClientSideSupabase()
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "The user has been successfully updated.",
      })
      fetchUser()
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
      const supabase = getClientSideSupabase()
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "The user has been successfully deleted.",
      })
      router.push("/admin/users")
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
      const supabase = getClientSideSupabase()
      const { error } = await supabase
        .from('users')
        .update({ user_type: selectedRole })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Role changed",
        description: `The user's role has been changed to ${selectedRole}.`,
      })
      fetchUser()
    } catch (error) {
      console.error("Error changing role:", error)
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
            <CardDescription>The requested user could not be found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button asChild variant="ghost">
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowRoleChangeConfirm(true)}
            disabled={isLoading}
          >
            <Shield className="mr-2 h-4 w-4" />
            Change Role
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading || isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>View and edit user information</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={user.user_type}>
            <TabsList>
              <TabsTrigger value="recruit">
                <User className="mr-2 h-4 w-4" />
                Recruit
              </TabsTrigger>
              <TabsTrigger value="volunteer">
                <UserCog className="mr-2 h-4 w-4" />
                Volunteer
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recruit">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={(formData as FormData["recruit"]).email || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={(formData as FormData["recruit"]).phone || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={(formData as FormData["recruit"]).first_name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={(formData as FormData["recruit"]).last_name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="volunteer">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={(formData as FormData["volunteer"]).email || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={(formData as FormData["volunteer"]).phone || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={(formData as FormData["volunteer"]).first_name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={(formData as FormData["volunteer"]).last_name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={(formData as FormData["volunteer"]).organization || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        organization: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={(formData as FormData["admin"]).email || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={(formData as FormData["admin"]).name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <UserActivity userId={user.id} />
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleChangeConfirm} onOpenChange={setShowRoleChangeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select the new role for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruit">Recruit</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleChangeConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Change Role
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 