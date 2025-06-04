"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Instagram,
} from "lucide-react";

interface PlatformOption {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

interface BriefingShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  briefingTitle: string;
}

export function BriefingShareDialog({
  isOpen,
  onClose,
  briefingTitle,
}: BriefingShareDialogProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const platforms: PlatformOption[] = [
    { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-400" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
    { id: "email", name: "Email", icon: Mail, color: "bg-gray-600" },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-pink-600",
    },
  ];

  const handleShare = async (platform: PlatformOption) => {
    try {
      setIsSharing(true);
      setShareError(null);

      // Simulate sharing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create share message
      const shareMessage = `Check out today's San Francisco Deputy Sheriff's briefing: "${briefingTitle}"`;

      // Handle different platforms
      if (platform.id === "email") {
        window.open(
          `mailto:?subject=${encodeURIComponent("SF Deputy Sheriff Daily Briefing")}&body=${encodeURIComponent(shareMessage)}`,
        );
      } else {
        // For actual integration, you'd use the Web Share API or platform-specific APIs
        console.log(`Shared to ${platform.name}: ${shareMessage}`);
      }

      setShareSuccess(platform.id);
      setTimeout(() => setShareSuccess(null), 2000);
    } catch (error) {
      console.error("Error sharing:", error);
      setShareError("Failed to share. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  // Safe check for includes method
  const isPlatformShared = (platformId: string) => {
    return shareSuccess === platformId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Briefing</DialogTitle>
          <DialogDescription>
            Share today&apos;s briefing with your network to keep everyone
            informed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {platforms.map((platform) => {
            const isShared = isPlatformShared(platform.id);
            const isCurrentSuccess = shareSuccess === platform.id;

            return (
              <Button
                key={platform.id}
                variant="outline"
                className={`flex items-center justify-center h-20 ${isShared || isCurrentSuccess ? "border-green-500" : ""}`}
                onClick={() => handleShare(platform)}
                disabled={isSharing || isShared}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`rounded-full p-2 ${platform.color} text-white`}
                  >
                    {isShared || isCurrentSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <platform.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm">{platform.name}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {shareError && <div className="text-red-500 text-sm">{shareError}</div>}

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-gray-500">
            {shareSuccess && `Shared on ${shareSuccess}`}
          </div>

          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
