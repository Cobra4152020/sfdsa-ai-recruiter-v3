"use client";

import { PageWrapper } from "@/components/page-wrapper";
import { AuthRequiredWrapper } from "@/components/auth-required-wrapper";
import { SgtKenSaysGame } from "@/components/sgt-ken-says-game";

export default function SgtKenSaysPage() {
  return (
    <PageWrapper>
      <AuthRequiredWrapper
        requiredFeature="games"
        title="Sgt. Ken Says Game"
        description="Test your law enforcement knowledge with this daily word challenge"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#0A3C1F] mb-4">
                🎯 Sgt. Ken Says...
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Daily law enforcement word challenge! Crack the code, earn points, and share your victory with the squad.
              </p>
            </div>
            
            <SgtKenSaysGame />
          </div>
        </div>
      </AuthRequiredWrapper>
    </PageWrapper>
  );
} 