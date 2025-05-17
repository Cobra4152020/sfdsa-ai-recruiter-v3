"use client"

import { useState, useEffect, useRef } from "react"
import type { ReactNode, JSX } from "react"
import Link from "next/link"
import type { Route } from "next"
import { 
  ChevronDown, 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Moon,
  Shield,
  BookOpen,
  Trophy,
  Gamepad2,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  LucideIcon,
  Menu,
  X
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuthModal } from "@/context/auth-modal-context"
import { useUser } from "@/context/user-context"
import { ShieldLogo } from "@/components/shield-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-provider"
import { UserNav } from "@/components/user-nav"
import { cn } from "@/lib/utils"

interface ImprovedHeaderProps {
  showOptInForm?: (isApplying?: boolean) => void
}

interface NavItem {
  label: string
  href: Route
  icon?: ReactNode
}

interface DropdownNavProps {
  label: string
  icon: ReactNode
  items: NavItem[]
}

function DropdownNav({ label, icon, items }: DropdownNavProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="flex items-center text-white hover:text-[#FFD700] py-2 transition-all duration-200 group"
      >
        <span className="flex items-center transform group-hover:scale-105 transition-transform duration-200">
          <span className="text-[#FFD700]">{icon}</span>
          <span className="mx-1">{label}</span>
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      
      <div
        className={`absolute left-0 mt-2 w-64 bg-[#0A3C1F] dark:bg-[#0A3C1F] rounded-lg shadow-lg overflow-hidden z-50 border border-[#FFD700]/20 ${
          isOpen ? 'block' : 'hidden'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {items.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex items-center px-4 py-3 text-sm text-white hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-150 group"
          >
            {item.icon && (
              <span className="mr-2 transform group-hover:scale-110 transition-transform duration-200 text-[#FFD700]">
                {item.icon}
              </span>
            )}
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { currentUser } = useUser()
  const { openModal } = useAuthModal()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogin = () => {
    if (typeof openModal === "function") {
      openModal("signin", "recruit")
    } else if (showOptInForm) {
      showOptInForm(false)
    }
  }

  const handleApplyNow = () => {
    if (typeof openModal === "function") {
      openModal("optin", "recruit")
    } else if (showOptInForm) {
      showOptInForm(true)
    }
  }

  const mainNavItems = {
    mission: {
      label: "Mission Briefing",
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        { label: "Overview", href: "/mission-briefing" as Route, icon: <Shield className="w-4 h-4" /> },
        { label: "Daily Briefing", href: "/daily-briefing" as Route, icon: <BookOpen className="w-4 h-4" /> },
        { label: "Requirements", href: "/mission-briefing/requirements" as Route, icon: <Shield className="w-4 h-4" /> },
        { label: "Application Process", href: "/mission-briefing/process" as Route, icon: <Shield className="w-4 h-4" /> }
      ]
    },
    gamification: {
      label: "Achievements",
      icon: <Trophy className="w-4 h-4" />,
      items: [
        { label: "Badges Gallery", href: "/badges" as Route, icon: <Shield className="w-4 h-4" /> },
        { label: "NFT Awards", href: "/nft-awards" as Route, icon: <Trophy className="w-4 h-4" /> },
        { label: "Leaderboard", href: "/gamification" as Route, icon: <Trophy className="w-4 h-4" /> }
      ]
    },
    games: {
      label: "Challenges",
      icon: <Gamepad2 className="w-4 h-4" />,
      items: [
        { label: "Daily Trivia", href: "/trivia" as Route, icon: <Gamepad2 className="w-4 h-4" /> },
        { label: "TikTok Challenges", href: "/tiktok-challenges" as Route, icon: <Gamepad2 className="w-4 h-4" /> },
        { label: "Special Missions", href: "/games" as Route, icon: <Gamepad2 className="w-4 h-4" /> }
      ]
    },
    support: {
      label: "Support",
      icon: <HelpCircle className="w-4 h-4" />,
      items: [
        { label: "Chat with Sgt. Ken", href: "/chat-with-sgt-ken" as Route, icon: <MessageSquare className="w-4 h-4" /> },
        { label: "Contact Support", href: "/contact" as Route, icon: <HelpCircle className="w-4 h-4" /> },
        { label: "Accessibility", href: "/accessibility" as Route, icon: <HelpCircle className="w-4 h-4" /> }
      ]
    }
  }

  const userNavItems = currentUser ? {
    label: "Account",
    icon: <User className="w-4 h-4" />,
    items: [
      { label: "Dashboard", href: "/dashboard" as Route, icon: <User className="w-4 h-4" /> },
      { label: "Profile", href: "/profile" as Route, icon: <User className="w-4 h-4" /> },
      { label: "Settings", href: "/profile/settings" as Route, icon: <Settings className="w-4 h-4" /> }
    ]
  } : null

  return (
    <header className={cn(
      "fixed w-full z-50 transition-all duration-200",
      scrolled ? "bg-white/95 dark:bg-[#121212]/95 shadow-md backdrop-blur-sm" : "bg-transparent"
    )}>
      {/* Top bar */}
      <div className="bg-[#0A3C1F] dark:bg-black text-white dark:text-[#FFD700] py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Join the San Francisco Deputy Sheriff's Department
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <Link href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                  <Facebook size={16} />
                </Link>
                <Link href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                  <Twitter size={16} />
                </Link>
                <Link href="https://youtube.com" aria-label="YouTube" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                  <Youtube size={16} />
                </Link>
                <Link href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                  <Instagram size={16} />
                </Link>
                <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                  <Linkedin size={16} />
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className={cn(
        "py-4 transition-colors duration-200",
        scrolled ? "bg-white dark:bg-[#121212]" : "bg-white/0 dark:bg-transparent"
      )}>
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">SFDSA</span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                About
              </Link>
              <Link href="/benefits" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                Benefits
              </Link>
              <Link href="/requirements" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                Requirements
              </Link>
              <Link href="/training" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                Training
              </Link>
              <Link href="/faq" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                FAQ
              </Link>
              <Link href="/contact" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </div>

            {/* Action buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!currentUser ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleLogin}
                    className="text-[#0A3C1F] dark:text-[#FFD700] hover:bg-[#0A3C1F]/10 dark:hover:bg-[#FFD700]/10"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleApplyNow}
                    className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:hover:bg-[#FFD700]/90 dark:text-black"
                  >
                    Apply Now
                  </Button>
                </>
              ) : (
                <UserNav />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-[#0A3C1F] dark:text-[#FFD700] hover:bg-[#0A3C1F]/10 dark:hover:bg-[#FFD700]/10"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[calc(4rem+2.5rem)] bottom-0 z-50 bg-white dark:bg-[#121212] transition-transform duration-300 ease-in-out transform",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/about"
              className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/benefits"
              className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Benefits
            </Link>
            <Link
              href="/requirements"
              className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Requirements
            </Link>
            <Link
              href="/training"
              className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Training
            </Link>
            <Link
              href="/faq"
              className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile social links */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="https://facebook.com" aria-label="Facebook" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Facebook size={20} />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Twitter size={20} />
              </Link>
              <Link href="https://youtube.com" aria-label="YouTube" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Youtube size={20} />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Instagram size={20} />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Linkedin size={20} />
              </Link>
            </div>

            {/* Mobile action buttons */}
            {!currentUser && (
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="text-[#0A3C1F] dark:text-[#FFD700] hover:bg-[#0A3C1F]/10 dark:hover:bg-[#FFD700]/10"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleApplyNow}
                  className="bg-[#0A3C1F] hover:bg-[#0A3C1F]/90 text-white dark:bg-[#FFD700] dark:hover:bg-[#FFD700]/90 dark:text-black"
                >
                  Apply Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
