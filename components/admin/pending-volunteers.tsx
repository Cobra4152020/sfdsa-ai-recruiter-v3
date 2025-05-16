"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { UserWithRole } from "@/app/types/user"

// Static mock data
const mockPendingVolunteers: UserWithRole[] = [
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "volunteer",
    status: "pending",
    created_at: "2024-01-03T00:00:00Z",
    type: "volunteer",
    has_applied: true,
    has_completed_profile: true,
    has_verified_email: true,
    is_active: false
  },
  {
    id: "4",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "volunteer",
    status: "pending",
    created_at: "2024-01-04T00:00:00Z",
    type: "volunteer",
    has_applied: true,
    has_completed_profile: true,
    has_verified_email: true,
    is_active: false
  }
];

export function PendingVolunteers() {
  const [pendingVolunteers, setPendingVolunteers] = useState<UserWithRole[]>(mockPendingVolunteers)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleApprove = async (userId: string) => {
    try {
      setLoading(true)

      // In static export, just update the state
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        setPendingVolunteers(pendingVolunteers.filter(v => v.id !== userId))
        toast({
          title: "Success",
          description: "Volunteer approved successfully (Demo Mode)",
        })
        return
      }

      const response = await fetch(`/api/admin/volunteers/${userId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve volunteer")
      }

      setPendingVolunteers(pendingVolunteers.filter(v => v.id !== userId))
      toast({
        title: "Success",
        description: "Volunteer approved successfully",
      })
    } catch (error) {
      console.error("Error approving volunteer:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve volunteer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (userId: string) => {
    try {
      setLoading(true)

      // In static export, just update the state
      if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "true") {
        setPendingVolunteers(pendingVolunteers.filter(v => v.id !== userId))
        toast({
          title: "Success",
          description: "Volunteer rejected successfully (Demo Mode)",
        })
        return
      }

      const response = await fetch(`/api/admin/volunteers/${userId}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject volunteer")
      }

      setPendingVolunteers(pendingVolunteers.filter(v => v.id !== userId))
      toast({
        title: "Success",
        description: "Volunteer rejected successfully",
      })
    } catch (error) {
      console.error("Error rejecting volunteer:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject volunteer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {pendingVolunteers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No pending volunteer applications
          </CardContent>
        </Card>
      ) : (
        pendingVolunteers.map((volunteer) => (
          <Card key={volunteer.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{volunteer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <p className="text-gray-600">{volunteer.email}</p>
                  <p className="text-sm text-gray-500">Applied on {new Date(volunteer.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(volunteer.id)}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(volunteer.id)}
                    disabled={loading}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
