import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Zap, Clock } from "lucide-react";
import { NFT_AWARD_TIERS } from "@/lib/nft-utils";
import { NFTCardOverlay } from "@/components/nft-card-overlay";
import Link from "next/link";

const iconMap = {
  bronze: Trophy,
  silver: Star,
  gold: Award,
  platinum: Zap,
};

export default function NFTAwardsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">
            NFT Awards Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            🚀 <strong>Coming Soon!</strong> Earn exclusive blockchain-verified NFT awards for your achievements in the recruitment process. These digital collectibles will represent your journey and dedication.
          </p>
          <Badge variant="secondary" className="mt-4">
            <Clock className="h-4 w-4 mr-1" />
            Web3 Integration In Progress
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {NFT_AWARD_TIERS.map((award) => {
            return (
              <div key={award.id} className="flex flex-col items-center">
                {/* NFT Card with Overlay */}
                <NFTCardOverlay 
                  award={award} 
                  className="w-full max-w-sm mb-4" 
                />
                
                {/* Card Information */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary mb-2">
                    {award.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reach {award.pointThreshold.toLocaleString()} points to unlock this exclusive NFT
                  </p>
                  
                  {award.comingSoon && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Blockchain integration in progress
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Card className="mt-12 border-primary/20">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              How NFT Awards Will Work
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Earn Points</h3>
                <p className="text-muted-foreground text-sm">
                  Participate in daily briefings, complete challenges, and engage with the community to earn points.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Unlock NFTs</h3>
                <p className="text-muted-foreground text-sm">
                  Once blockchain integration is complete, your achievements will be minted as exclusive NFTs.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Show & Share</h3>
                <p className="text-muted-foreground text-sm">
                  Display your verified achievements on your profile and share them on social media.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Web3 features coming soon - start earning points now!
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
