"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { UserWithRole } from "@/lib/user-management-service"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Edit, Trash, CheckCircle, XCircle, UserCog, Shield, User } from "lucide-react"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface UserTableProps {
  users: UserWithRole[]
  loading: boolean
  onRefresh: () => void
}

export function UserTable({ users, loading, onRefresh }: UserTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserWithRole | null>(null)

  const handleEdit = (user: UserWithRole) => {
    router.push(`/admin/users/${user.id}`)
  }

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch('/api/user-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      toast({
        title: "Success",
        description: "User has been deleted successfully.",
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch('/api/user-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve volunteer')
      }

      toast({
        title: "Success",
        description: "Volunteer has been approved successfully.",
      })
      onRefresh()
    } catch (error) {
      console.error("Error approving volunteer:", error)
      toast({
        title: "Error",
        description: "Failed to approve volunteer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch('/api/user-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject volunteer')
      }

      toast({
        title: "Success",
        description: "Volunteer has been rejected successfully.",
      })
      onRefresh()
    } catch (error) {
      console.error("Error rejecting volunteer:", error)
      toast({
        title: "Error",
        description: "Failed to reject volunteer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "volunteer":
        return <UserCog className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (user: UserWithRole) => {
    if (user.user_type === "volunteer") {
      const volunteerUser = user as any
      if (volunteerUser.is_verified) {
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      }
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-gray-100 rounded-full p-3 mb-4">
          <Users className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No users found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{user.email}</span>
                    {user.first_name && user.last_name && (
                      <span className="text-sm text-gray-500">
                        {user.first_name} {user.last_name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.user_type || "recruit")}
                    <span className="capitalize">{user.user_type || "recruit"}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user)}</TableCell>
                <TableCell>
                  {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : "Unknown"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>

                      {user.user_type === "volunteer" && !(user as any).is_verified && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(user.id)}>
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setUserToDelete(user)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(userToDelete?.id || "")}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
