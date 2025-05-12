"use client"

import { Shield, Heart, Users, HandHeart, Crown, Mountain } from "lucide-react"

type ThemeIconProps = {
  theme: string
  size?: number
  className?: string
}

export function ThemeIcon({ theme, size = 24, className = "" }: ThemeIconProps) {
  switch (theme.toLowerCase()) {
    case "duty":
      return <Shield size={size} className={className} />
    case "courage":
      return <Heart size={size} className={className} />
    case "respect":
      return <Users size={size} className={className} />
    case "service":
      return <HandHeart size={size} className={className} />
    case "leadership":
      return <Crown size={size} className={className} />
    case "resilience":
      return <Mountain size={size} className={className} />
    default:
      return <Shield size={size} className={className} />
  }
}
