"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { AchievementBadge } from "./achievement-badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Share2, TrendingUp, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import Link from "next/link"

interface LeaderboardCardProps {
  id: string
  rank: number
  name: string
  points: number
  badgeCount: number
  nftCount: number
  isCurrentUser?: boolean
  hasApplied?: boolean
  shareCount?: number
  likeCount?: number
  isRising?: boolean
  avatarUrl?: string
  badges?: Array<{
    id: string
    badge_type: string
    name: string
  }>
  completionPercentage?: number
}

export function Leaderboard3DCard({
  id,
  rank,
  name,
  points,
  badgeCount,
  nftCount,
  isCurrentUser = false,
  hasApplied = false,
  shareCount = 0,
  likeCount = 0,
  isRising = false,
  avatarUrl,
  badges = [],
  completionPercentage = 0,
}: LeaderboardCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(likeCount)
  const cardRef = useRef<HTMLDivElement>(null)
  const { currentUser } = useUser()

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  const handleLike = () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like this profile",
        variant: "destructive",
      })
      return
    }

    setLiked(!liked)
    setLocalLikeCount(liked ? localLikeCount - 1 : localLikeCount + 1)

    // API call would go here
    toast({
      title: liked ? "Like removed" : "Profile liked!",
      description: liked ? "You've removed your like" : `You've liked ${name}'s profile`,
    })
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s SF Sheriff Recruitment Profile`,
          text: `Check out ${name}'s profile on the San Francisco Sheriff's Office recruitment platform!`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "Profile link copied to clipboard",
      })
    }
  }

  // Get medal color based on rank
  const getMedalColor = () => {
    if (rank === 1) return "bg-[#FFD700]"
    if (rank === 2) return "bg-[#C0C0C0]"
    if (rank === 3) return "bg-[#CD7F32]"
    return "bg-gray-200 dark:bg-gray-700"
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isCurrentUser ? "ring-2 ring-[#0A3C1F] bg-[#0A3C1F]/5" : "bg-white dark:bg-gray-800"
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${
          isHovered ? 1.02 : 1
        })`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rank indicator */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className={`flex items-center justify-center rounded-full w-8 h-8 text-sm font-bold ${getMedalColor()} ${
            rank <= 3 ? "text-white" : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {rank}
        </div>
      </div>

      {/* Rising star indicator */}
      {isRising && (
        <div className="absolute top-3 right-3 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-orange-500 rounded-full p-1">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rising Star! Quickly climbing the ranks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center mb-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-[#0A3C1F]"
              style={{
                backgroundImage: `url(${avatarUrl || `/placeholder.svg?height=56&width=56&query=user-${id}`})`,
              }}
            ></div>
            {hasApplied && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Award className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* User info */}
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <h3 className="font-bold text-lg">{name}</h3>
              {isCurrentUser && (
                <Badge variant="outline" className="ml-2 bg-[#0A3C1F]/10 text-[#0A3C1F] border-[#0A3C1F]/20">
                  You
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center mr-3">
                <Award className="h-3 w-3 mr-1 text-[#FFD700]" />
                {points.toLocaleString()} pts
              </span>
              <span className="flex items-center">
                <Award className="h-3 w-3 mr-1 text-[#C0C0C0]" />
                {badgeCount} badges
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Application Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Badges showcase */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {badges.slice(0, 5).map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <AchievementBadge type={badge.badge_type as any} size="sm" earned={true} showTooltip={false} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{badge.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {badges.length > 5 && (
              <Badge variant="outline" className="ml-1">
                +{badges.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center ${liked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-red-500" : ""}`} />
              <span>{localLikeCount}</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              <span>{shareCount}</span>
            </Button>
          </div>
          <Link href={`/profile/${id}`} prefetch={false}>
            <Button size="sm" className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
