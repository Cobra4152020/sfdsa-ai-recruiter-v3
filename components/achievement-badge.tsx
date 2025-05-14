"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { BadgeType } from "@/app/api/leaderboard/route"

interface AchievementBadgeProps {
  type: BadgeType
  size?: "sm" | "md" | "lg"
  earned?: boolean
  showTooltip?: boolean
  className?: string
}

export function AchievementBadge({
  type,
  size = "md",
  earned = false,
  showTooltip = true,
  className,
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Badge configuration based on type
  const badgeConfig = {
    written: {
      color: "bg-blue-500",
      icon: "/document-icon.png",
      name: "Written Test",
      description: "Completed written test preparation",
    },
    oral: {
      color: "bg-green-700",
      icon: "/placeholder.svg?key=0tkxe",
      name: "Oral Board",
      description: "Prepared for oral board interviews",
    },
    physical: {
      color: "bg-blue-700",
      icon: "/fitness-icon.png",
      name: "Physical Test",
      description: "Completed physical test preparation",
    },
    polygraph: {
      color: "bg-teal-500",
      icon: "/placeholder.svg?key=znlj8",
      name: "Polygraph",
      description: "Learned about the polygraph process",
    },
    psychological: {
      color: "bg-purple-600",
      icon: "/psychology-icon.png",
      name: "Psychological",
      description: "Prepared for psychological evaluation",
    },
    full: {
      color: "bg-gray-300",
      icon: "/placeholder.svg?key=clz7i",
      name: "Full Process",
      description: "Completed all preparation areas",
    },
    "chat-participation": {
      color: "bg-blue-500",
      icon: "/chat-icon.png",
      name: "Chat Participation",
      description: "Engaged with Sgt. Ken",
    },
    "first-response": {
      color: "bg-green-700",
      icon: "/placeholder.svg?key=brhow",
      name: "First Response",
      description: "Received first response from Sgt. Ken",
    },
    "application-started": {
      color: "bg-blue-700",
      icon: "/placeholder.svg?key=vxmkb",
      name: "Application Started",
      description: "Started the application process",
    },
    "application-completed": {
      color: "bg-teal-500",
      icon: "/placeholder.svg?height=64&width=64&query=application completed icon",
      name: "Application Completed",
      description: "Completed the application process",
    },
    "hard-charger": {
      color: "bg-orange-500",
      icon: "/placeholder.svg?height=64&width=64&query=lightning bolt icon",
      name: "Hard Charger",
      description: "Consistently asks questions and has applied",
    },
    connector: {
      color: "bg-cyan-500",
      icon: "/placeholder.svg?height=64&width=64&query=connection icon",
      name: "Connector",
      description: "Connects with other participants",
    },
    "deep-diver": {
      color: "bg-blue-500",
      icon: "/placeholder.svg?height=64&width=64&query=deep dive icon",
      name: "Deep Diver",
      description: "Explores topics in great detail",
    },
    "quick-learner": {
      color: "bg-purple-500",
      icon: "/placeholder.svg?height=64&width=64&query=quick learning icon",
      name: "Quick Learner",
      description: "Rapidly progresses through recruitment information",
    },
    "persistent-explorer": {
      color: "bg-green-500",
      icon: "/placeholder.svg?height=64&width=64&query=compass icon",
      name: "Persistent Explorer",
      description: "Returns regularly to learn more",
    },
    "dedicated-applicant": {
      color: "bg-red-500",
      icon: "/placeholder.svg?height=64&width=64&query=dedication icon",
      name: "Dedicated Applicant",
      description: "Applied and continues to engage",
    },
  }

  const config = badgeConfig[type] || {
    color: "bg-gray-400",
    icon: "/placeholder.svg?height=64&width=64&query=badge icon",
    name: "Unknown Badge",
    description: "Badge description not available",
  }

  // Size configuration
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const badge = (
    <div
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300",
        config.color,
        sizeClasses[size],
        !earned && "opacity-50 grayscale",
        isHovered && earned && "scale-110",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === "full" ? (
        <span className="text-sm font-medium text-gray-800">Full</span>
      ) : (
        <img src={config.icon || "/placeholder.svg"} alt={config.name} className="w-3/4 h-3/4 object-contain" />
      )}
    </div>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-bold">{config.name}</p>
            <p className="text-xs">{config.description}</p>
            {!earned && <p className="text-xs italic mt-1">Not yet earned</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
