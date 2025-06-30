"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { NFTAward } from "@/lib/nft-utils";

interface NFTCardOverlayProps {
  award: NFTAward;
  className?: string;
}

const tierColors = {
  bronze: {
    gradient: "from-amber-600 via-amber-500 to-yellow-600",
    text: "text-amber-900",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
  },
  silver: {
    gradient: "from-gray-400 via-gray-300 to-gray-500",
    text: "text-gray-900",
    badge: "bg-gray-100 text-gray-800 border-gray-300",
  },
  gold: {
    gradient: "from-yellow-400 via-yellow-300 to-yellow-600",
    text: "text-yellow-900",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  platinum: {
    gradient: "from-slate-300 via-slate-200 to-slate-400",
    text: "text-slate-900",
    badge: "bg-slate-100 text-slate-800 border-slate-300",
  },
};

export function NFTCardOverlay({ award, className = "" }: NFTCardOverlayProps) {
  const colors = tierColors[award.tier];

  return (
    <div className={`relative group cursor-pointer ${className}`}>
      {/* Base NFT Card Image */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <Image
          src={award.imageUrl}
          alt={award.name}
          width={300}
          height={400}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
          {/* Coming Soon Badge */}
          <Badge variant="outline" className={`mb-4 ${colors.badge} border-2`}>
            <Clock className="h-4 w-4 mr-2" />
            Coming Soon
          </Badge>
          
          {/* Tier Title */}
          <div className={`bg-gradient-to-r ${colors.gradient} text-transparent bg-clip-text text-center mb-3`}>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {award.tier.toUpperCase()}
            </h3>
            <p className="text-lg font-semibold text-white">
              RECRUIT NFT
            </p>
          </div>
          
          {/* Points Required */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 mb-3">
            <p className="text-sm font-medium text-gray-800 text-center">
              Points Required
            </p>
            <p className={`text-xl font-bold ${colors.text} text-center`}>
              {award.pointThreshold.toLocaleString()}
            </p>
          </div>
          
          {/* Web3 Integration Note */}
          <div className="bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <p className="text-xs text-white text-center">
              🚀 Blockchain Integration In Progress
            </p>
          </div>
        </div>
        
        {/* Tier Color Border */}
        <div className={`absolute inset-0 rounded-lg border-4 bg-gradient-to-r ${colors.gradient} opacity-50 pointer-events-none`}></div>
      </div>
      
      {/* Hover Effect Glow */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10`}></div>
    </div>
  );
} 