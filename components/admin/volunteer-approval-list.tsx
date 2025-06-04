"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { adminActions } from "@/lib/actions/admin-actions";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface Volunteer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: string;
  position: string;
  location: string;
  created_at: string;
}

export function VolunteerApprovalList({
  volunteers,
}: {
  volunteers: Volunteer[];
}) {
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleApprove = async (userId: string) => {
    setProcessing((prev) => ({ ...prev, [userId]: true }));

    try {
      const result = await adminActions({
        action: "approveVolunteerRecruiter",
        userId,
      });

      if (result.success) {
        toast({
          title: "Volunteer approved",
          description:
            "The volunteer recruiter has been approved successfully.",
        });

        // Remove from list
        const volunteerElement = document.getElementById(`volunteer-${userId}`);
        if (volunteerElement) {
          volunteerElement.classList.add("hidden");
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve volunteer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleReject = async (userId: string) => {
    setProcessing((prev) => ({ ...prev, [userId]: true }));

    try {
      const result = await adminActions({
        action: "rejectVolunteerRecruiter",
        userId,
      });

      if (result.success) {
        toast({
          title: "Volunteer rejected",
          description: "The volunteer recruiter has been rejected.",
        });

        // Remove from list
        const volunteerElement = document.getElementById(`volunteer-${userId}`);
        if (volunteerElement) {
          volunteerElement.classList.add("hidden");
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject volunteer",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {volunteers.map((volunteer) => (
        <div
          key={volunteer.id}
          id={`volunteer-${volunteer.id}`}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">
                {volunteer.first_name} {volunteer.last_name}
              </h3>
              <p className="text-gray-600">{volunteer.email}</p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="font-medium">Organization:</span>{" "}
                  {volunteer.organization}
                </div>
                <div>
                  <span className="font-medium">Position:</span>{" "}
                  {volunteer.position}
                </div>
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {volunteer.location}
                </div>
                <div>
                  <span className="font-medium">Applied:</span>{" "}
                  {new Date(volunteer.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleApprove(volunteer.id)}
                disabled={processing[volunteer.id]}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(volunteer.id)}
                disabled={processing[volunteer.id]}
                variant="destructive"
                size="sm"
              >
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
