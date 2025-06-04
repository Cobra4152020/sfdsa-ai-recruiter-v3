"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Applicant } from "./applicant-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendApplicantStatusEmail } from "@/lib/email-service";

interface ApplicantDetailModalProps {
  applicant: Applicant;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export function ApplicantDetailModal({
  applicant,
  onClose,
  onUpdateStatus,
}: ApplicantDetailModalProps) {
  const [status, setStatus] = useState(applicant.application_status);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "contacted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Contacted
          </Badge>
        );
      case "interested":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Interested
          </Badge>
        );
      case "applied":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Applied
          </Badge>
        );
      case "hired":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Hired
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "started":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  async function handleUpdateStatus() {
    if (status !== applicant.application_status) {
      onUpdateStatus(applicant.id, status);
    }
  }

  async function handleSendStatusEmail() {
    setIsSendingEmail(true);
    try {
      await sendApplicantStatusEmail({
        email: applicant.email,
        firstName: applicant.first_name,
        lastName: applicant.last_name,
        status,
        trackingNumber: applicant.tracking_number,
      });
      // Show success message
    } catch (error) {
      console.error("Error sending status email:", error);
      // Show error message
    } finally {
      setIsSendingEmail(false);
    }
  }

  return (
    <Dialog open={!!applicant} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Applicant Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Personal Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {applicant.first_name} {applicant.last_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{applicant.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {applicant.phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">ZIP Code</p>
                    <p className="font-medium">
                      {applicant.zip_code || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Application Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-mono">{applicant.tracking_number}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Referral Source</p>
                    <p className="font-medium">
                      {applicant.referral_source || "Direct"}
                    </p>
                  </div>

                  {applicant.referral_code && (
                    <div>
                      <p className="text-sm text-gray-500">Referral Code</p>
                      <p className="font-medium">{applicant.referral_code}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p className="font-medium">
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <div className="mt-1">
                      {getStatusBadge(applicant.application_status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Update Status</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status-update">New Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status-update">
                      <SelectValue placeholder="Select status" />
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
                </div>

                <div className="flex items-end gap-2">
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={status === applicant.application_status}
                  >
                    Update Status
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSendStatusEmail}
                    disabled={isSendingEmail}
                  >
                    {isSendingEmail ? "Sending..." : "Send Status Email"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <div className="text-center py-8 text-gray-500">
              Activity log will be implemented in a future update.
            </div>
          </TabsContent>

          <TabsContent value="notes" className="pt-4">
            <div className="text-center py-8 text-gray-500">
              Notes feature will be implemented in a future update.
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
