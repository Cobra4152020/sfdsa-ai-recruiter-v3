"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Award, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/user-context";
import { AuthForm } from "./auth-form";

interface ReferRecruiterProps {
  className?: string;
}

export function ReferRecruiter({ className }: ReferRecruiterProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, currentUser } = useUser();

  const generateReferralLink = () => {
    // Generate a unique referral link
    const uniqueCode = Math.random().toString(36).substring(2, 8);
    const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002';
    const refLink = `${currentDomain}/join?ref=${currentUser?.id || "demo"}-${uniqueCode}`;
    setReferralLink(refLink);
    return refLink;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setShowAuthDialog(true);
      return;
    }

    // Generate referral link
    generateReferralLink();

    // Simulate sending invite
    toast({
      title: "Invitation Sent!",
      description: `A referral invite has been sent to ${email}`,
      duration: 5000,
    });

    // Clear form
    setEmail("");
    setName("");

    // Show success dialog
    setShowSuccessDialog(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
      duration: 3000,
    });
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  return (
    <>
      <Card className={className}>
        <CardHeader className="bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 text-white">
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Refer a Recruit
          </CardTitle>
          <CardDescription className="text-gray-200">
            Earn points and badges by referring potential recruits
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Friend&apos;s Name</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Friend&apos;s Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="mt-2 bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                Send Referral
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-2 flex items-center">
              <Award className="mr-2 h-4 w-4 text-[#FFD700]" />
              Referral Bonuses
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>1 Recruit Referred</span>
                <span className="text-[#0A3C1F] font-medium">+100 Points</span>
              </li>
              <li className="flex justify-between">
                <span>3 Recruits Referred</span>
                <span className="text-[#0A3C1F] font-medium">
                  &quot;Connector&quot; Badge
                </span>
              </li>
              <li className="flex justify-between">
                <span>5 Recruits Referred</span>
                <span className="text-[#0A3C1F] font-medium">+500 Points</span>
              </li>
              <li className="flex justify-between">
                <span>10 Recruits Referred</span>
                <span className="text-[#0A3C1F] font-medium">
                  &quot;Recruitment Champion&quot; NFT
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Sign in to refer friends and earn rewards
          </DialogDescription>
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>

      {/* Success Dialog with Referral Link */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Referral Sent!</DialogTitle>
            <DialogDescription>
              Share this custom referral link to earn even more points and
              rewards.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="referral-link">Your Referral Link</Label>
            <div className="flex mt-1">
              <Input
                id="referral-link"
                value={referralLink}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyLink} className="ml-2 bg-[#0A3C1F]">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Your friend will receive an email with this link and you&apos;ll
              be credited when they sign up.
            </p>
          </div>

          <div className="bg-[#0A3C1F]/10 border border-[#0A3C1F]/20 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-[#0A3C1F] flex items-center">
              <Award className="mr-2 h-4 w-4 text-[#0A3C1F]" />
              Referral Tip
            </h4>
            <p className="text-sm mt-1">
              Personalize your message when sharing your link to increase the
              chances of your friends signing up!
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
