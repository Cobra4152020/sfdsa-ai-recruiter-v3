"use client";

import { useState, useEffect } from "react";
import type { ComponentType, ReactNode } from "react";
import { NFTCardOverlay } from "@/components/nft-card-overlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { PageWrapper } from "@/components/page-wrapper";
import type { NFTAward } from "@/lib/nft-utils";

interface NFTAwardPageClientProps {
  award: NFTAward | undefined;
}

export function NFTAwardPageClient({ award }: NFTAwardPageClientProps) {
  const [UserProvider, setUserProvider] = useState<ComponentType<{
    children: ReactNode;
  }> | null>(null);

  useEffect(() => {
    const loadClientModules = async () => {
      const { UserProvider } = await import("@/context/user-context");
      setUserProvider(() => UserProvider);
    };
    loadClientModules();
  }, []);

  if (!UserProvider) {
    return null;
  }

  if (!award) {
    return (
      <UserProvider>
        <PageWrapper>
          <main className="flex-1 bg-background pt-8 pb-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl font-bold mb-4">NFT Award Not Found</h1>
              <p className="mb-8 text-muted-foreground">
                The NFT award you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link href="/nft-awards" prefetch={false}>
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to NFT Awards
                </Button>
              </Link>
            </div>
          </main>
        </PageWrapper>
      </UserProvider>
    );
  }

  // Meta tags for social sharing
  const title = `${award.name} - SF Sheriff Recruitment NFT Award`;
  const description = award.description;

  return (
    <UserProvider>
      <PageWrapper>
        <head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content={`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}${award.imageUrl}`}
          />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
          <meta
            property="twitter:image"
            content={`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}${award.imageUrl}`}
          />
        </head>

        <main className="flex-1 bg-background pt-8 pb-12">
          <div className="container mx-auto px-4">
            <Link href="/nft-awards" prefetch={false}>
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to NFT Awards
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  Coming Soon - Web3 Integration In Progress
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                  {award.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {award.description}
                </p>
              </div>

              {/* NFT Card Display */}
              <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                <div className="flex-shrink-0">
                  <NFTCardOverlay
                    award={award}
                    className="w-full max-w-sm"
                  />
                </div>

                <div className="flex-1 space-y-6">
                  {/* Award Details */}
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Award Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tier:</span>
                        <span className="font-semibold capitalize">{award.tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Points Required:</span>
                        <span className="font-bold text-primary">{award.pointThreshold.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* How to Earn */}
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">How to Earn This NFT</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Participate in daily briefings and challenges</li>
                      <li>• Engage with the SFDSA community</li>
                      <li>• Complete recruitment milestones</li>
                      <li>• Share your progress on social media</li>
                      <li>• Reach {award.pointThreshold.toLocaleString()} total points</li>
                    </ul>
                  </div>

                  {/* Blockchain Info */}
                  <div className="bg-primary/5 border-primary/20 border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 text-primary">Blockchain Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      🚀 This NFT will be minted on the blockchain once our Web3 integration is complete. 
                      Start earning points now to secure your position for when these exclusive NFTs become available!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Future Features:</strong> Blockchain verification, marketplace trading, 
                      social media integration, and exclusive holder benefits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 text-center">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  Join the San Francisco Sheriff&apos;s Office
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Earn exclusive NFT awards like this one by participating in our recruitment process. 
                  Discover a rewarding career with competitive pay, excellent benefits, and opportunities for advancement.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/" prefetch={false}>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3">
                      Start Your Journey
                    </Button>
                  </Link>
                  <Link href="/nft-awards" prefetch={false}>
                    <Button variant="outline" className="px-8 py-3">
                      View All NFT Awards
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </PageWrapper>
    </UserProvider>
  );
}
