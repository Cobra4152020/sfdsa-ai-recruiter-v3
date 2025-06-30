"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, User, Calendar, FileImage } from "lucide-react";

interface PhotoApproval {
  id: string;
  user_id: string;
  photo_url: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  user_name: string;
  user_email: string;
  days_pending: number;
}

export function PhotoApprovalManager() {
  const [pendingApprovals, setPendingApprovals] = useState<PhotoApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await fetch('/api/admin/photo-approvals');
      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(data.approvals || []);
      }
    } catch (error) {
      console.error('Error fetching photo approvals:', error);
      toast({
        title: "Error",
        description: "Failed to load pending photo approvals.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (approvalId: string) => {
    setProcessing(prev => ({ ...prev, [approvalId]: true }));

    try {
      const response = await fetch(`/api/admin/photo-approvals/${approvalId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to approve photo');
      }

      // Remove from pending list
      setPendingApprovals(prev => prev.filter(approval => approval.id !== approvalId));
      
      toast({
        title: "Photo approved",
        description: "The profile photo has been approved and is now visible.",
      });

    } catch (error) {
      console.error('Error approving photo:', error);
      toast({
        title: "Error",
        description: "Failed to approve photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(prev => ({ ...prev, [approvalId]: false }));
    }
  };

  const handleReject = async (approvalId: string) => {
    const reason = rejectionReasons[approvalId] || '';
    
    if (!reason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this photo.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(prev => ({ ...prev, [approvalId]: true }));

    try {
      const response = await fetch(`/api/admin/photo-approvals/${approvalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject photo');
      }

      // Remove from pending list
      setPendingApprovals(prev => prev.filter(approval => approval.id !== approvalId));
      
      toast({
        title: "Photo rejected",
        description: "The user has been notified of the rejection.",
      });

    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast({
        title: "Error",
        description: "Failed to reject photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(prev => ({ ...prev, [approvalId]: false }));
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileImage className="h-5 w-5 mr-2" />
            Profile Photo Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading pending approvals...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileImage className="h-5 w-5 mr-2" />
            Profile Photo Approvals
          </div>
          {pendingApprovals.length > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {pendingApprovals.length} pending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending photo approvals</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingApprovals.map((approval) => (
              <Card key={approval.id} className="border-l-4 border-l-yellow-400">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Photo Preview */}
                    <Avatar className="h-20 w-20 border">
                      <AvatarImage 
                        src={approval.photo_url} 
                        alt={`${approval.user_name}'s profile photo`}
                      />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info & Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{approval.user_name}</h3>
                          <p className="text-gray-600">{approval.user_email}</p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50">
                          <Clock className="h-3 w-3 mr-1" />
                          {approval.days_pending} days pending
                        </Badge>
                      </div>

                      {/* File Details */}
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Filename:</span><br />
                          {approval.original_filename}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span><br />
                          {formatFileSize(approval.file_size)}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span><br />
                          {new Date(approval.submitted_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Rejection Reason */}
                      <div className="space-y-2">
                        <Label htmlFor={`reason-${approval.id}`}>
                          Rejection Reason (if rejecting)
                        </Label>
                        <Textarea
                          id={`reason-${approval.id}`}
                          placeholder="Provide a clear reason if rejecting this photo..."
                          value={rejectionReasons[approval.id] || ''}
                          onChange={(e) => setRejectionReasons(prev => ({
                            ...prev,
                            [approval.id]: e.target.value
                          }))}
                          rows={2}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          onClick={() => handleApprove(approval.id)}
                          disabled={processing[approval.id]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(approval.id)}
                          disabled={processing[approval.id]}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 