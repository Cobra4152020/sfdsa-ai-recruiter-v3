import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "NFT Awards Coming Soon | SF Deputy Sheriff Recruitment",
  description:
    "NFT Awards for top recruits are coming soon to the San Francisco Deputy Sheriff recruitment platform.",
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-[#072613] text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-xl border border-white/10 max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-20 w-20 text-[#FFD700]" />
              <Clock className="h-10 w-10 text-white absolute bottom-0 right-0" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#FFD700]">
            NFT Awards Coming Soon
          </h1>

          <p className="text-xl mb-8">
            We&apos;re working on something special! Soon, top recruits will be
            able to earn exclusive NFT awards that recognize their achievements
            in the recruitment process.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                What are NFT Awards?
              </h3>
              <p>
                NFT Awards are unique digital tokens that verify your
                achievements. They can be displayed on your profile and shared
                on social media as proof of your accomplishments.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                How will I earn them?
              </h3>
              <p>
                By participating in recruitment activities, completing
                challenges, and demonstrating exceptional skills during the
                application process.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="border-white/20 hover:bg-white/10"
            >
              <Link href="/awards">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Awards
              </Link>
            </Button>

            <Button
              asChild
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-primary"
            >
              <Link href="/badges">Explore Badge Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
