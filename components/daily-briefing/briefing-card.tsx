"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Calendar, Clock } from "lucide-react";
import { BriefingShareDialog } from "./briefing-share-dialog";
import { useUser } from "@/context/user-context";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { getClientSideSupabase } from "@/lib/supabase";

interface BriefingCardProps {
  briefing?: {
    id: string;
    title: string;
    content: string;
    theme: string;
    date: string;
    created_at: string;
    cycle_day?: number;
    keyPoints?: string[];
  };
}

export function BriefingCard({ briefing }: BriefingCardProps) {
  const [isAttended, setIsAttended] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();

  // Ensure we have valid data to display
  const validBriefing =
    briefing && typeof briefing === "object" ? briefing : null;

  // Format date safely
  const formattedDate = validBriefing?.date
    ? new Date(validBriefing.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const handleAttend = async () => {
    if (isAttended || isLoading) return;

    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to mark attendance.",
        variant: "default",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Attempt to mark attendance
      if (validBriefing?.id) {
        // Get the access token from Supabase
        const supabase = getClientSideSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error("No valid session found");
        }

        const response = await fetch("/api/daily-briefing/attend", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ briefingId: validBriefing.id }),
        });

        if (response.ok) {
          setIsAttended(true);
          toast({
            title: "Attendance Recorded",
            description:
              "You&apos;ve been marked as present for today&apos;s briefing.",
            variant: "default",
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to mark attendance");
        }
      } else {
        // If we don't have a valid briefing ID, still mark as attended on the UI
        setIsAttended(true);
        toast({
          title: "Attendance Recorded",
          description:
            "You&apos;ve been marked as present for today&apos;s briefing.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "There was a problem recording your attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle share button click
  const handleShare = () => {
    if (currentUser) {
      setIsShareOpen(true);
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to share the daily briefing.",
        variant: "default",
      });
    }
  };

  // Fallback content when no briefing data is available
  if (!validBriefing) {
    return (
      <Card className="h-full shadow-lg border-t-4 border-t-[#0A3C1F] dark:border-t-[#FFD700]">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Daily Briefing</CardTitle>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 border border-[#0A3C1F]/10 dark:border-[#FFD700]/10 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
              Briefing Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Today&apos;s briefing focuses on community safety and departmental
              updates. Remember to check your equipment and follow all safety
              protocols.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-lg">Key Points:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-gray-700 dark:text-gray-300">
                Always be aware of your surroundings
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                Check your equipment before starting your shift
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                Report any safety concerns immediately
              </li>
              <li className="text-gray-700 dark:text-gray-300">
                Complete all required documentation promptly
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            onClick={handleAttend}
            disabled={isAttended || isLoading}
            variant={isAttended ? "outline" : "default"}
            className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
          >
            {isLoading
              ? "Processing..."
              : isAttended
                ? "Attended ✓"
                : "Mark as Attended"}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="border-[#0A3C1F] text-[#0A3C1F]"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Briefing
          </Button>
        </CardFooter>

        <BriefingShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          briefingId="default-briefing"
          briefingTitle="Daily Briefing"
        />
      </Card>
    );
  }

  // Display actual briefing content when available
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full shadow-lg border-t-4 border-t-[#0A3C1F] dark:border-t-[#FFD700]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">
              {validBriefing?.title || "Daily Briefing"}
            </CardTitle>
            <div className="flex items-center gap-2">
              {validBriefing?.cycle_day && (
                <Badge
                  variant="outline"
                  className="bg-[#0A3C1F]/5 text-[#0A3C1F] border-[#0A3C1F]/20"
                >
                  Day {validBriefing.cycle_day}/365
                </Badge>
              )}
              <Badge
                variant="outline"
                className="bg-[#0A3C1F]/10 text-[#0A3C1F] border-[#0A3C1F]/20"
              >
                {validBriefing?.theme || "General"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
            <Clock className="h-4 w-4 ml-4 mr-1" />
            <span>
              {validBriefing?.created_at
                ? new Date(validBriefing.created_at).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    },
                  )
                : ""}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div
            className="prose prose-green dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: validBriefing.content || "" }}
          />

          {validBriefing.keyPoints &&
            Array.isArray(validBriefing.keyPoints) &&
            validBriefing.keyPoints.length > 0 && (
              <div className="mt-6 bg-[#0A3C1F]/5 dark:bg-[#FFD700]/5 border border-[#0A3C1F]/10 dark:border-[#FFD700]/10 rounded-lg p-4">
                <h3 className="font-semibold text-[#0A3C1F] dark:text-[#FFD700] mb-2">
                  Key Points:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {validBriefing.keyPoints.map(
                    (point: string, index: number) => (
                      <li
                        key={index}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {point}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            onClick={handleAttend}
            disabled={isAttended || isLoading}
            variant={isAttended ? "outline" : "default"}
            className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white"
          >
            {isLoading
              ? "Processing..."
              : isAttended
                ? "Attended ✓"
                : "Mark as Attended"}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="border-[#0A3C1F] text-[#0A3C1F]"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Briefing
          </Button>
        </CardFooter>

        <BriefingShareDialog
          open={isShareOpen}
          onOpenChange={setIsShareOpen}
          briefingId={validBriefing.id || "default-briefing"}
          briefingTitle={validBriefing.title || "Daily Briefing"}
        />
      </Card>
    </motion.div>
  );
}
