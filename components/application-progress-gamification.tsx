"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/context/user-context';
import { FaCheckCircle, FaHourglassHalf, FaLock, FaShare, FaTrophy } from 'react-icons/fa';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthModal } from "@/context/auth-modal-context";

interface ApplicationStep {
  step_id: number;
  step_name: string;
  description: string;
  is_completed: boolean;
  completed_at: string | null;
}

export default function ApplicationProgressGamification() {
  const [applicationSteps, setApplicationSteps] = useState<ApplicationStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  
  const { currentUser } = useUser();
  const { toast } = useToast();
  const { openModal } = useAuthModal();

  useEffect(() => {
    const fetchApplicationProgress = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(`/api/users/${currentUser.id}/application-progress`);
        if (!response.ok) {
          throw new Error('Failed to fetch application progress');
        }
        const data = await response.json();
        setApplicationSteps(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationProgress();
  }, [currentUser]);

  const getStepStatus = (step: ApplicationStep, index: number) => {
    if (step.is_completed) {
      return {
        Icon: FaCheckCircle,
        iconColor: 'text-white',
        iconBg: 'bg-green-500',
        label: 'Completed',
        date: step.completed_at ? new Date(step.completed_at).toLocaleDateString() : '',
        points: getStepPoints(index),
      };
    }
    
    // Find the first incomplete step
    const firstIncompleteIndex = applicationSteps.findIndex(s => !s.is_completed);
    
    if (firstIncompleteIndex === index) {
      return { 
        Icon: FaHourglassHalf, 
        iconColor: 'text-white',
        iconBg: 'bg-yellow-500',
        label: 'In Progress',
        points: getStepPoints(index),
      };
    }
    
    return { 
      Icon: FaLock, 
      iconColor: 'text-white',
      iconBg: 'bg-gray-400',
      label: 'Not Started',
      points: getStepPoints(index),
    };
  };

  const getStepPoints = (index: number) => {
    const pointsMap = [50, 100, 150, 200, 250, 300, 500];
    return pointsMap[index] || 50;
  };

  const calculateProgress = () => {
    if (applicationSteps.length === 0) return 0;
    const completedSteps = applicationSteps.filter(step => step.is_completed).length;
    return Math.round((completedSteps / applicationSteps.length) * 100);
  };

  const calculatePointsEarned = () => {
    return applicationSteps.reduce((total, step, index) => {
      return step.is_completed ? total + getStepPoints(index) : total;
    }, 0);
  };

  const calculateBadgesEarned = () => {
    return applicationSteps.filter(step => step.is_completed).length;
  };

  const getShareContent = () => {
    const progress = calculateProgress();
    const pointsEarned = calculatePointsEarned();
    const badgesEarned = calculateBadgesEarned();
    
    return {
      title: `${progress}% Through My Deputy Sheriff Application Journey!`,
      text: `🏆 My Deputy Sheriff Application Progress: ${progress}% complete! 
📊 ${pointsEarned} points earned | 🎖️ ${badgesEarned} badges unlocked
Join me on the journey to become a San Francisco Deputy Sheriff! 
#SFDSA #DeputySheriff #LawEnforcement`,
      url: typeof window !== 'undefined' ? `${window.location.origin}/apply` : '/apply'
    };
  };

  const socialPlatforms = {
    facebook: {
      name: "Facebook",
      Icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#1877F2]/90",
      getUrl: (content: ReturnType<typeof getShareContent>) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}&quote=${encodeURIComponent(content.text)}`
    },
    twitter: {
      name: "Twitter", 
      Icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90",
      getUrl: (content: ReturnType<typeof getShareContent>) =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.text)}&url=${encodeURIComponent(content.url)}`
    },
    linkedin: {
      name: "LinkedIn",
      Icon: Linkedin, 
      color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90",
      getUrl: (content: ReturnType<typeof getShareContent>) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}&summary=${encodeURIComponent(content.text)}`
    }
  };

  const handleSocialShare = async (platform: keyof typeof socialPlatforms) => {
    if (!currentUser) {
      openModal("signin", "recruit");
      return;
    }

    setIsSharing(true);
    try {
      const content = getShareContent();
      const shareUrl = socialPlatforms[platform].getUrl(content);
      
      // Open share window
      const popup = window.open(shareUrl, '_blank', 'width=600,height=400');
      
      if (!popup) {
        // Fallback: copy to clipboard if popup blocked
        await navigator.clipboard.writeText(`${content.text}\n\n${content.url}`);
        toast({
          title: "Popup Blocked",
          description: "Share content copied to clipboard. Please paste it manually.",
        });
      } else {
        toast({
          title: "Share Window Opened",
          description: `Share your progress on ${socialPlatforms[platform].name}!`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share Failed",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const content = getShareContent();
      await navigator.clipboard.writeText(`${content.text}\n\n${content.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Progress share content copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy failed",
        description: "Could not copy content.",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openModal("signin", "recruit");
      return;
    }

    setIsSharing(true);
    try {
      const content = getShareContent();
      const subject = emailSubject || content.title;
      const body = customMessage || content.text;
      const emailUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\n${content.url}`)}`;
      
      window.location.href = emailUrl;
      
      toast({
        title: "Email Opened",
        description: "Your email client should open with the share content.",
      });
      
      // Reset form
      setEmailTo("");
      setEmailSubject("");
      setCustomMessage("");
      setShowShareDialog(false);
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast({
        title: "Email Failed",
        description: "Could not open email client.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#0A3C1F] text-white p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
        <div className="bg-[#0A3C1F] text-white p-6">
          <h3 className="text-xl font-semibold flex items-center gap-3">
            <FaTrophy className="h-6 w-6" />
            Your Application Journey
          </h3>
        </div>
        <div className="p-6">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const pointsEarned = calculatePointsEarned();
  const badgesEarned = calculateBadgesEarned();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Sheriff Green Header */}
        <div className="bg-[#0A3C1F] text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <FaTrophy className="h-6 w-6" />
              Your Application Journey
            </h3>
            <button 
              onClick={() => setShowShareDialog(true)}
              className="flex items-center gap-2 text-white/80 hover:text-white px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <FaShare className="h-4 w-4" />
              <span className="text-sm">Share Progress</span>
            </button>
          </div>
          <p className="text-white/80">Complete each step to earn points and badges</p>
        </div>

        {/* White Content Area */}
        <div className="p-6">
          {/* Progress Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Application Progress</span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{pointsEarned}</div>
              <div className="text-sm text-gray-500">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{badgesEarned}</div>
              <div className="text-sm text-gray-500">Badges Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{applicationSteps.length - badgesEarned}</div>
              <div className="text-sm text-gray-500">Steps Remaining</div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {applicationSteps.map((step, index) => {
              const status = getStepStatus(step, index);
              
              return (
                <div key={step.step_id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  {/* Step Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 ${status.iconBg} rounded-full flex items-center justify-center`}>
                    <status.Icon className={`h-5 w-5 ${status.iconColor}`} />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {step.step_name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            step.is_completed 
                              ? 'bg-green-100 text-green-800' 
                              : status.label === 'In Progress' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {status.label} {status.date && `on ${status.date}`}
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            +{status.points} pts
                          </span>
                        </div>
                      </div>

                      {/* Step Number */}
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center ml-4">
                        <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion Message */}
          {progress === 100 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-800">
                <FaCheckCircle className="h-6 w-6 mx-auto mb-2" />
                <h4 className="font-medium text-lg">🎉 Congratulations!</h4>
                <p className="text-sm">You've completed your Deputy Sheriff Application Journey!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Progress</DialogTitle>
            <DialogDescription>
              Share your Deputy Sheriff application journey with friends and family!
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="social">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="social" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your {progress}% progress on your favorite social media platforms.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {(Object.keys(socialPlatforms) as Array<keyof typeof socialPlatforms>).map((key) => {
                  const platform = socialPlatforms[key];
                  return (
                    <Button
                      key={key}
                      className={`flex-1 min-w-[120px] ${platform.color}`}
                      onClick={() => handleSocialShare(key)}
                      disabled={isSharing}
                    >
                      <platform.Icon className="mr-2 h-4 w-4" />
                      {platform.name}
                    </Button>
                  );
                })}
              </div>
              
              <div className="relative">
                <Input
                  value={getShareContent().url}
                  readOnly
                  placeholder="Share link..."
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                  onClick={handleCopyLink}
                  disabled={isSharing}
                >
                  {copied ? (
                    <Check className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-1 h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Email your progress to a friend or colleague.
              </p>
              
              <form onSubmit={handleEmailShare}>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="emailTo">Recipient's Email</Label>
                    <Input
                      id="emailTo"
                      type="email"
                      placeholder="friend@example.com"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      disabled={isSharing}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailSubject">Subject</Label>
                    <Input
                      id="emailSubject"
                      placeholder={getShareContent().title}
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      disabled={isSharing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customMessage">Message (optional)</Label>
                    <Textarea
                      id="customMessage"
                      placeholder={getShareContent().text}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      disabled={isSharing}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={isSharing || !emailTo}>
                    {isSharing ? "Opening..." : "Send Email"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setShowShareDialog(false)} disabled={isSharing}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
