import { ShieldCheck, Sword, UserCheck, Heart, Star, Mountain } from "lucide-react"

interface ThemeIconProps {
  theme: "duty" | "courage" | "respect" | "service" | "leadership" | "resilience"
  size?: number
  className?: string
}

export function ThemeIcon({ theme, size = 24, className = "" }: ThemeIconProps) {
  switch (theme) {
    case "duty":
      return <ShieldCheck size={size} className={className} />
    case "courage":
      return <Sword size={size} className={className} />
    case "respect":
      return <UserCheck size={size} className={className} />
    case "service":
      return <Heart size={size} className={className} />
    case "leadership":
      return <Star size={size} className={className} />
    case "resilience":
      return <Mountain size={size} className={className} />
    default:
      return <ShieldCheck size={size} className={className} />
  }
}

export function getThemeColor(theme: string): { bg: string; text: string; border: string } {
  switch (theme) {
    case "duty":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-800",
      }
    case "courage":
      return {
        bg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-800 dark:text-red-300",
        border: "border-red-300 dark:border-red-800",
      }
    case "respect":
      return {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-800 dark:text-purple-300",
        border: "border-purple-300 dark:border-purple-800",
      }
    case "service":
      return {
        bg: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-800 dark:text-green-300",
        border: "border-green-300 dark:border-green-800",
      }
    case "leadership":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/20",
        text: "text-amber-800 dark:text-amber-300",
        border: "border-amber-300 dark:border-amber-800",
      }
    case "resilience":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-900/20",
        text: "text-emerald-800 dark:text-emerald-300",
        border: "border-emerald-300 dark:border-emerald-800",
      }
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-800 dark:text-gray-200",
        border: "border-gray-300 dark:border-gray-700",
      }
  }
}

export function getThemeTitle(theme: string): string {
  switch (theme) {
    case "duty":
      return "Duty & Responsibility"
    case "courage":
      return "Courage in Action"
    case "respect":
      return "Respect & Dignity"
    case "service":
      return "Service to Community"
    case "leadership":
      return "Leadership & Example"
    case "resilience":
      return "Resilience & Perseverance"
    default:
      return "Daily Theme"
  }
}
