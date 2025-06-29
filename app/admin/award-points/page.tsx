"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AwardPointsPage() {
  const [email, setEmail] = useState("");
  const [points, setPoints] = useState("50");
  const [action, setAction] = useState("Initial signup bonus");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAwardPoints = async () => {
    if (!email || !points || !action) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/award-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          points: parseInt(points),
          action,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully awarded ${points} points to ${email}`,
        });
        // Reset form
        setEmail("");
        setPoints("50");
        setAction("Initial signup bonus");
        setDescription("");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to award points",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error awarding points:", error);
      toast({
        title: "Error",
        description: "An error occurred while awarding points",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Award Points to User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="refundpolice50@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Points to Award *</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="1"
              max="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action *</Label>
            <Input
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Initial signup bonus"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details about this point award..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleAwardPoints}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Awarding Points..." : "Award Points"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 