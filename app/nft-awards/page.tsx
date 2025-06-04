import { PageWrapper } from "@/components/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Award, Zap } from "lucide-react";

export default function NFTAwardsPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
              NFT Awards
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Earn exclusive NFT awards for your achievements in the recruitment
              process. These digital collectibles represent your journey and
              dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-[#0A3C1F]/20">
              <CardHeader className="bg-[#0A3C1F] text-white">
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#FFD700]" />
                  Bronze Recruit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">
                  Bronze Recruit NFT
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Awarded for reaching 1,000 points in the recruitment process.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Required Points:</span>
                    <span className="font-medium">1,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#0A3C1F]/20">
              <CardHeader className="bg-[#0A3C1F] text-white">
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#FFD700]" />
                  Silver Recruit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">
                  Silver Recruit NFT
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Awarded for reaching 2,500 points in the recruitment process.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Required Points:</span>
                    <span className="font-medium">2,500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#0A3C1F]/20">
              <CardHeader className="bg-[#0A3C1F] text-white">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-[#FFD700]" />
                  Gold Recruit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Gold Recruit NFT</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Awarded for reaching 5,000 points in the recruitment process.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Required Points:</span>
                    <span className="font-medium">5,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 border-[#0A3C1F]/20">
            <CardHeader className="bg-[#0A3C1F] text-white">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                How to Earn NFT Awards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Earn Points</h3>
                  <p className="text-gray-600">
                    Participate in daily briefings, complete challenges, and
                    engage with the community to earn points.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-600">
                    Monitor your points and achievements in your profile
                    dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
