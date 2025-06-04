"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TikTokIcon } from "@/components/tiktok-icon";
import { Upload, Video, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TikTokChallengeModalProps {
  challenge: {
    id: number;
    title: string;
    description: string;
    instructions: string;
    hashtags: string[];
    pointsReward: number;
    requirements?: {
      minDuration?: number;
      maxDuration?: number;
      requiredElements?: string[];
    };
  };
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TikTokChallengeModal({
  challenge,
  userId,
  isOpen,
  onClose,
}: TikTokChallengeModalProps) {
  const [step, setStep] = useState<
    "instructions" | "upload" | "submit" | "success"
  >("instructions");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Check if it's a video file
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file.",
          variant: "destructive",
        });
        return;
      }

      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!videoFile && !videoUrl) {
      toast({
        title: "Video required",
        description: "Please upload a video for your challenge submission.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, we would upload the video to storage
      // For this example, we'll just simulate the upload process

      // First, simulate video upload if we have a file
      let finalVideoUrl = videoUrl;

      if (videoFile) {
        setIsUploading(true);

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // In a real implementation, this would be the URL from your storage service
        finalVideoUrl = URL.createObjectURL(videoFile);

        setIsUploading(false);
      }

      // Now submit the challenge
      const response = await fetch("/api/tiktok-challenges/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          userId,
          videoUrl: finalVideoUrl,
          tiktokUrl: tiktokUrl || undefined,
          metadata: {
            originalFilename: videoFile?.name,
            fileSize: videoFile?.size,
            fileType: videoFile?.type,
            submittedFrom: "web-interface",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit challenge");
      }

      // Show success state
      setStep("success");

      // Notify user
      toast({
        title: "Challenge submitted!",
        description:
          "Your submission is being reviewed. We'll notify you when it's approved.",
      });
    } catch (error) {
      console.error("Error submitting challenge:", error);
      toast({
        title: "Submission failed",
        description:
          "There was an error submitting your challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case "instructions":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <TikTokIcon className="h-5 w-5 mr-2" />
                {challenge.title}
              </DialogTitle>
              <DialogDescription>
                Complete this TikTok challenge to earn {challenge.pointsReward}{" "}
                points!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div>
                <h3 className="text-lg font-medium">Challenge Description</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {challenge.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Instructions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {challenge.instructions}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Hashtags to Include</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {challenge.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {challenge.requirements && (
                <div>
                  <h3 className="text-lg font-medium">Requirements</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {challenge.requirements.minDuration && (
                      <li>
                        Minimum Duration: {challenge.requirements.minDuration}{" "}
                        seconds
                      </li>
                    )}
                    {challenge.requirements.maxDuration && (
                      <li>
                        Maximum Duration: {challenge.requirements.maxDuration}{" "}
                        seconds
                      </li>
                    )}
                    {challenge.requirements.requiredElements?.map(
                      (element, index) => <li key={index}>{element}</li>,
                    )}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep("upload")}>
                <TikTokIcon className="h-4 w-4 mr-2" />
                Start Challenge
              </Button>
            </DialogFooter>
          </>
        );

      case "upload":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Upload Your TikTok Challenge Video</DialogTitle>
              <DialogDescription>
                Create and upload your video for the &quot;{challenge.title}
                &quot; challenge
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />

                {videoUrl ? (
                  <div className="space-y-4">
                    <video
                      src={videoUrl}
                      className="max-h-[200px] mx-auto rounded-lg"
                      controls
                    />
                    <p className="text-sm text-gray-600">
                      Video selected. Click to change.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload your video</p>
                      <p className="text-xs text-gray-500">
                        Drag and drop or click to select
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="tiktok-url">TikTok URL (Optional)</Label>
                <div className="mt-1">
                  <Input
                    id="tiktok-url"
                    placeholder="https://www.tiktok.com/@username/video/1234567890"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  If you already posted this challenge on TikTok, paste the URL
                  here so we can track your performance!
                </p>
              </div>

              <Alert>
                <Video className="h-4 w-4" />
                <AlertDescription>
                  Make sure your video includes all required elements and
                  hashtags mentioned in the challenge instructions.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("instructions")}>
                Back
              </Button>
              <Button
                onClick={() => setStep("submit")}
                disabled={!videoUrl && !tiktokUrl}
              >
                Next
              </Button>
            </DialogFooter>
          </>
        );

      case "submit":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Submit Your Challenge</DialogTitle>
              <DialogDescription>
                Review your submission for the &quot;{challenge.title}&quot;
                challenge
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              {videoUrl && (
                <div>
                  <Label>Preview</Label>
                  <div className="mt-1 border rounded-lg overflow-hidden">
                    <video
                      src={videoUrl}
                      className="max-h-[200px] w-full"
                      controls
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Hashtags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {challenge.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about your submission..."
                  className="mt-1"
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  By submitting this video, you confirm that you created this
                  content and grant permission for it to be reviewed.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isUploading}
                className="relative"
              >
                {isUploading || isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploading ? "Uploading..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <TikTokIcon className="h-4 w-4 mr-2" />
                    Submit Challenge
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        );

      case "success":
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                Submission Successful!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your TikTok challenge has been submitted for review
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center space-y-4 my-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-medium text-lg">Thank You!</h3>
                <p className="text-gray-600 text-sm">
                  We will review your submission shortly. You&apos;ll receive a
                  notification once it&apos;s approved.
                </p>
              </div>

              <div className="flex flex-col w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Challenge</span>
                  <span className="font-medium">{challenge.title}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Potential Reward</span>
                  <span className="font-medium">
                    {challenge.pointsReward} points
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">{renderContent()}</DialogContent>
    </Dialog>
  );
}
