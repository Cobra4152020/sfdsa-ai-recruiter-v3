"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";

export default function AwardPointsPage() {
  const { currentUser } = useUser();
  const [userId, setUserId] = useState(currentUser?.id || "");
  const [action, setAction] = useState("application_submission");
  const [customPoints, setCustomPoints] = useState("");
  const [isAwarding, setIsAwarding] = useState(false);

  const predefinedActions = [
    { action: 'application_submission', points: 500, label: 'Application Submission' },
    { action: 'chat_participation', points: 5, label: 'Chat Participation' },
    { action: 'contact_form_submission', points: 10, label: 'Contact Form' },
    { action: 'resource_download', points: 10, label: 'Resource Download' },
    { action: 'practice_test', points: 20, label: 'Practice Test' },
    { action: 'referral', points: 50, label: 'Referral' },
    { action: 'custom', points: 0, label: 'Custom Points' }
  ];

  const selectedAction = predefinedActions.find(a => a.action === action);

  const awardPoints = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required",
        variant: "destructive"
      });
      return;
    }

    const pointsToAward = action === 'custom' ? parseInt(customPoints) : selectedAction?.points || 0;

    if (pointsToAward <= 0) {
      toast({
        title: "Error", 
        description: "Points must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    setIsAwarding(true);

    try {
      // Use the direct API for reliable points awarding
      const response = await fetch('/api/points/direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          points: pointsToAward,
          action,
          description: `Admin award: ${pointsToAward} points for ${selectedAction?.label || action}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "🎉 Points Awarded!",
          description: `Successfully awarded ${pointsToAward} points for ${selectedAction?.label || action}. New total: ${result.user?.new_total || 'Unknown'}`,
        });
        
        // Clear the form
        if (action === 'custom') {
          setCustomPoints('');
        }
      } else {
        throw new Error(result.message || 'Failed to award points');
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to award points",
        variant: "destructive"
      });
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🎯 Production Points System</CardTitle>
          <p className="text-gray-600">
            Award points to users for various actions in the live SFDSA recruitment platform. This directly updates user points in the production database.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
            />
            {currentUser && (
              <p className="text-sm text-gray-500">
                Your current user ID: {currentUser.id}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action Type</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                {predefinedActions.map((actionItem) => (
                  <SelectItem key={actionItem.action} value={actionItem.action}>
                    {actionItem.label} {actionItem.points > 0 && `(${actionItem.points} points)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {action === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customPoints">Custom Points</Label>
              <Input
                id="customPoints"
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
                placeholder="Enter points amount"
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Award Summary</h4>
            <p className="text-blue-800">
              <strong>User:</strong> {userId || 'Not specified'}<br/>
              <strong>Action:</strong> {selectedAction?.label || action}<br/>
              <strong>Points:</strong> {action === 'custom' ? customPoints || '0' : selectedAction?.points || '0'}
            </p>
          </div>

          <Button 
            onClick={awardPoints} 
            disabled={isAwarding || !userId}
            className="w-full"
          >
            {isAwarding ? 'Awarding Points...' : 'Award Points'}
          </Button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">💡 Quick Fix for Missing Application Points</h4>
            <p className="text-yellow-800 text-sm">
              If you submitted an application but didn't receive your 500 points, use this tool to award them manually. 
              Select "Application Submission" and click "Award Points".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 