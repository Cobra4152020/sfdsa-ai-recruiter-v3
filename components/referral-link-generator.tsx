"use client";

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
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/context/user-context";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Share2,
  Link,
} from "lucide-react";

export function ReferralLinkGenerator() {
  const { currentUser } = useUser();
  const [shareTab, setShareTab] = useState("copy");
  const [customSlug, setCustomSlug] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate a base referral code using the user's ID or a random string if no user
  const baseReferralCode = currentUser?.id
    ? `SFSHERIFF-${currentUser.id.substring(0, 8)}`
    : `SFSHERIFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Combine with custom slug if provided
  const referralCode = customSlug
    ? `${baseReferralCode}-${customSlug.replace(/\s+/g, "-").toLowerCase()}`
    : baseReferralCode;

  // Base URL from environment or default
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://deputyrecruiter.sf.gov";
  const referralUrl = `${baseUrl}/register?ref=${encodeURIComponent(referralCode)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast({
      title: "Link copied!",
      description: "The referral link has been copied to your clipboard.",
      duration: 3000,
    });
  };

  const handleGenerateLink = () => {
    setIsGenerating(true);
    // Simulate API call to generate and save the link
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Link generated!",
        description: "Your custom referral link has been created and saved.",
        duration: 3000,
      });
    }, 1000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      "Join the San Francisco Sheriff's Department",
    );
    const body = encodeURIComponent(
      `I thought you might be interested in a career with the San Francisco Sheriff&apos;s Department. Check out this link to learn more: ${referralUrl}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      "_blank",
    );
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      "Join the San Francisco Sheriff's Department and start an exciting career in law enforcement! Check out this link:",
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralUrl)}`,
      "_blank",
    );
  };

  const shareViaLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
      "_blank",
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Referral Link</CardTitle>
          <CardDescription>
            Create a custom, trackable link that you can share with potential
            recruits. When they sign up using your link, you&apos;ll get credit
            for the referral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Add a custom identifier (optional)"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleGenerateLink}
                className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Link"}
              </Button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md flex items-center">
              <div className="flex-1 font-mono text-sm truncate">
                {referralUrl}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="ml-2 flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Share Your Link</h3>
            <Tabs value={shareTab} onValueChange={setShareTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="copy">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="facebook">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </TabsTrigger>
                <TabsTrigger value="twitter">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </TabsTrigger>
                <TabsTrigger value="linkedin">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="copy" className="mt-4">
                <Button
                  onClick={handleCopyLink}
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link to Clipboard
                </Button>
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                <Button
                  onClick={shareViaEmail}
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </Button>
              </TabsContent>

              <TabsContent value="facebook" className="mt-4">
                <Button
                  onClick={shareViaFacebook}
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Share on Facebook
                </Button>
              </TabsContent>

              <TabsContent value="twitter" className="mt-4">
                <Button
                  onClick={shareViaTwitter}
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Share on Twitter
                </Button>
              </TabsContent>

              <TabsContent value="linkedin" className="mt-4">
                <Button
                  onClick={shareViaLinkedIn}
                  className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Active Referral Links</CardTitle>
          <CardDescription>
            View and manage all your active referral links. You can see how many
            clicks each link has received and how many sign-ups it has
            generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Referral Link</th>
                  <th className="text-center py-3 px-4">Created</th>
                  <th className="text-center py-3 px-4">Clicks</th>
                  <th className="text-center py-3 px-4">Sign-ups</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {baseReferralCode}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    June 10, 2023
                  </td>
                  <td className="text-center py-3 px-4 text-sm">124</td>
                  <td className="text-center py-3 px-4 text-sm">9</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3.5 w-3.5 mr-1" />
                        Share
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2 text-[#0A3C1F]" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {baseReferralCode}-community-event
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-sm">
                    July 22, 2023
                  </td>
                  <td className="text-center py-3 px-4 text-sm">87</td>
                  <td className="text-center py-3 px-4 text-sm">5</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3.5 w-3.5 mr-1" />
                        Share
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
