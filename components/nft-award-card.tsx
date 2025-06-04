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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, Share2 } from "lucide-react";
import Image from "next/image";
import { AchievementShareDialog } from "./achievement-share-dialog";

interface NFTAwardCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tokenId?: string;
  contractAddress?: string;
  awardedAt?: string;
  pointsAtAward?: number;
  blockchainExplorerUrl?: string;
  className?: string;
}

export function NFTAwardCard({
  id,
  name,
  description,
  imageUrl,
  tokenId,
  contractAddress,
  awardedAt,
  pointsAtAward,
  blockchainExplorerUrl,
  className,
}: NFTAwardCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const isAwarded = !!awardedAt;

  const formattedDate = awardedAt
    ? new Date(awardedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <Card
        className={`overflow-hidden ${className} ${!isAwarded ? "opacity-50" : ""}`}
      >
        <CardHeader className="p-4 bg-gradient-to-r from-[#0A3C1F] to-[#0A3C1F]/80 text-white">
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            {description}
          </p>
          {isAwarded && formattedDate && (
            <p className="text-xs text-center mt-2">
              Awarded on {formattedDate}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            disabled={!isAwarded}
          >
            View Details
          </Button>
          {isAwarded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-4">
            <div className="relative w-full max-w-[200px] aspect-square mb-4">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>

            {isAwarded && (
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Awarded:</span>
                  <span>{formattedDate}</span>
                </div>
                {pointsAtAward !== undefined && (
                  <div className="flex justify-between">
                    <span className="font-medium">Points at award:</span>
                    <span>{pointsAtAward.toLocaleString()}</span>
                  </div>
                )}
                {tokenId && (
                  <div className="flex justify-between">
                    <span className="font-medium">Token ID:</span>
                    <span className="font-mono text-xs">{tokenId}</span>
                  </div>
                )}
                {contractAddress && (
                  <div className="flex justify-between">
                    <span className="font-medium">Contract:</span>
                    <span className="font-mono text-xs truncate max-w-[180px]">
                      {contractAddress}
                    </span>
                  </div>
                )}
                {blockchainExplorerUrl && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(blockchainExplorerUrl, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Blockchain
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      {isAwarded && (
        <AchievementShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          achievement={{
            title: `${name} NFT Award`,
            description: `I earned the ${name} NFT Award in my journey to become a San Francisco Deputy Sheriff! ${description}`,
            imageUrl: imageUrl,
            shareUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/nft-awards/${id}`,
            type: "nft",
            id: id,
          }}
        />
      )}
    </>
  );
}
