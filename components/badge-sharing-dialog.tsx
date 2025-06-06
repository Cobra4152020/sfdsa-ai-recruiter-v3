"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { RecruitmentBadge } from "@/components/recruitment-badge";
import { AchievementBadge } from "@/components/achievement-badge";
import { getWindowOrigin } from "@/lib/domain-utils";
import { useClientOnly } from "@/hooks/use-client-only";
import { isBrowser } from "@/lib/client-check";

type BadgeType =
  | "written"
  | "oral"
  | "physical"
  | "polygraph"
  | "psychological"
  | "full"
  | "chat-participation"
  | "application-started"
  | "application-completed"
  | "first-response"
  | "frequent-user"
  | "resource-downloader";

interface UserBadge {
  id: string;
  badge_type: BadgeType;
  name: string;
  description: string;
  earned_at: string;
}

interface BadgeSharingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  badges: UserBadge[];
  userName: string;
}

export function BadgeSharingDialog({
  isOpen,
  onClose,
  badges,
  userName,
}: BadgeSharingDialogProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const memoizedGetWindowOrigin = useCallback(() => getWindowOrigin(), []);
  const origin = useClientOnly(memoizedGetWindowOrigin, "");

  // Generate share URL when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Use user-badge route for sharing user badges
      const url = `${origin}/user-badge/${encodeURIComponent(userName)}`;
      setShareUrl(url);
    }

    if (!open) {
      onClose();
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Sharing link copied to clipboard.",
      });
    } catch (copyError) {
      console.error("Failed to copy link:", copyError);
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Handle social media sharing
  const shareOnFacebook = () => {
    if (!isBrowser()) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareOnTwitter = () => {
    if (!isBrowser()) return;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out my recruitment badges for the San Francisco Sheriff&apos;s Office! #LawEnforcement #Careers`,
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareOnLinkedIn = () => {
    if (!isBrowser()) return;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    // In a real implementation, you would use html2canvas or a similar library
    alert("In a production app, this would download the QR code as an image.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Recruitment Badges</DialogTitle>
          <DialogDescription>
            Share your progress with friends and family to show your interest in
            joining the SF Sheriff&apos;s Office.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="badge" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="badge">Badge</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent
            value="badge"
            className="flex flex-col items-center justify-center py-4"
          >
            <RecruitmentBadge
              userName={userName}
              showShareOptions={false}
              size="sm"
            />

            <div className="grid grid-cols-2 gap-4 mt-6 w-full">
              <Button
                onClick={shareOnFacebook}
                className="bg-[#1877F2] hover:bg-[#1877F2]/90"
              >
                Facebook
              </Button>
              <Button
                onClick={shareOnTwitter}
                className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              >
                Twitter
              </Button>
              <Button
                onClick={shareOnLinkedIn}
                className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
              >
                LinkedIn
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center gap-2 col-span-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="qrcode"
            className="flex flex-col items-center justify-center py-4"
          >
            <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Scan this QR code to view {userName}&apos;s recruitment badge
            </p>
            <Button
              onClick={downloadQRCode}
              variant="outline"
              className="mt-4 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium mb-2">Earned Badges ({badges.length})</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {badges.map((badge) => (
              <AchievementBadge
                key={badge.id}
                type={badge.badge_type}
                size="sm"
                earned={true}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
