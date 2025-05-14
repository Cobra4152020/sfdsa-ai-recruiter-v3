"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  getPendingVolunteerRecruiters,
  approveVolunteerRecruiter,
  rejectVolunteerRecruiter,
  type VolunteerUser,
} from "@/lib/user-management-service"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, XCircle, RefreshCw, UserCog } from "lucide-react"

interface PendingVolunteersProps {
  onApproved: () => void
}

export function PendingVolunteers({ onApproved }: PendingVolunteersProps) {
  const { toast } = useToast()
  const [volunteers, setVolunteers] = useState<VolunteerUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<string[]>([])

  useEffect(() => {
    loadPendingVolunteers()
  }, [])

  const loadPendingVolunteers = async () => {
    setLoading(true)
    try {
      const data = await getPendingVolunteerRecruiters()
      setVolunteers(data)
    } catch (error) {
      console.error("Error loading pending volunteers:", error)
      toast({
        title: "Error",
        description: "Failed to load pending volunteers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingIds((prev) => [...prev, id])
    try {
      const result = await approveVolunteerRecruiter(id)
      if (result.success) {
        toast({
          title: "Volunteer approved",
          description: "The volunteer recruiter has been approved.",
        })
        setVolunteers((prev) => prev.filter((v) => v.id !== id))
        onApproved()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve volunteer.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error approving volunteer:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const handleReject = async (id: string) => {
    setProcessingIds((prev) => [...prev, id])
    try {
      const result = await rejectVolunteerRecruiter(id)
      if (result.success) {
        toast({
          title: "Volunteer rejected",
          description: "The volunteer recruiter has been rejected.",
        })
        setVolunteers((prev) => prev.filter((v) => v.id !== id))
        onApproved()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject volunteer.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => prev.filter((i) => i !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A3C1F]"></div>
      </div>
    )
  }

  if (volunteers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="bg-gray-100 rounded-full p-3 mb-4">
          <UserCog className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No pending volunteers</h3>
        <p className="mt-1 text-sm text-gray-500">All volunteer recruiters have been processed.</p>
        <Button variant="outline" className="mt-4" onClick={loadPendingVolunteers}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {volunteers.map((volunteer) => (
        <Card key={volunteer.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {volunteer.first_name} {volunteer.last_name}
            </CardTitle>
            <CardDescription>{volunteer.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {volunteer.phone && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{volunteer.phone}</span>
                </div>
              )}
              {volunteer.organization && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Organization:</span>
                  <span className="text-sm">{volunteer.organization}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Registered:</span>
                <span className="text-sm">
                  {volunteer.created_at
                    ? formatDistanceToNow(new Date(volunteer.created_at), { addSuffix: true })
                    : "Unknown"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="w-[48%] text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleReject(volunteer.id)}
              disabled={processingIds.includes(volunteer.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="w-[48%] bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(volunteer.id)}
              disabled={processingIds.includes(volunteer.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
