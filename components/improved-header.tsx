"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import type { Route } from "next"
import { 
  ChevronDown, 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram, 
  Linkedin,
  Shield,
  BookOpen,
  Trophy,
  Gamepad2,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
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
import { useClientOnly } from "@/hooks/use-client-only"
import { getWindowDimensions } from "@/lib/utils"
import { DropdownNav } from "@/components/ui/dropdown-nav"

interface ImprovedHeaderProps {
  showOptInForm?: (isApplying?: boolean) => void
}

interface NavItem {
  label: string
  href: Route
  icon?: ReactNode
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { currentUser } = useUser()
  const { openModal } = useAuthModal()
  const [scrolled, setScrolled] = useState(false)

  const { scrollY } = useClientOnly(() => getWindowDimensions(), { scrollY: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 })

  useEffect(() => {
    setScrolled(scrollY > 10)
  }, [scrollY])

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
        { label: "Overview", href: "/mission-briefing", icon: <Shield className="w-4 h-4" /> },
        { label: "Daily Briefing", href: "/daily-briefing", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Requirements", href: "/requirements", icon: <Shield className="w-4 h-4" /> },
        { label: "Application Process", href: "/application-process", icon: <Shield className="w-4 h-4" /> }
      ]
    },
    gamification: {
      label: "Achievements",
      icon: <Trophy className="w-4 h-4" />,
      items: [
        { label: "Badges Gallery", href: "/badges", icon: <Shield className="w-4 h-4" /> },
        { label: "NFT Awards", href: "/nft-awards", icon: <Trophy className="w-4 h-4" /> },
        { label: "Leaderboard", href: "/gamification", icon: <Trophy className="w-4 h-4" /> }
      ]
    },
    games: {
      label: "Challenges",
      icon: <Gamepad2 className="w-4 h-4" />,
      items: [
        { label: "Daily Trivia", href: "/trivia", icon: <Gamepad2 className="w-4 h-4" /> },
        { label: "TikTok Challenges", href: "/tiktok-challenges", icon: <Gamepad2 className="w-4 h-4" /> },
        { label: "Special Missions", href: "/play-the-game", icon: <Gamepad2 className="w-4 h-4" /> }
      ]
    },
    support: {
      label: "Support",
      icon: <HelpCircle className="w-4 h-4" />,
      items: [
        { label: "Chat with Sgt. Ken", href: "/chat-with-sgt-ken", icon: <MessageSquare className="w-4 h-4" /> },
        { label: "Contact Support", href: "/contact", icon: <HelpCircle className="w-4 h-4" /> },
        { label: "Accessibility", href: "/accessibility", icon: <HelpCircle className="w-4 h-4" /> }
      ]
    }
  }

  const userNavItems = currentUser ? {
    label: "Account",
    icon: <User className="w-4 h-4" />,
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <User className="w-4 h-4" /> },
      { label: "Profile", href: "/profile", icon: <User className="w-4 h-4" /> },
      { label: "Settings", href: "/profile/settings", icon: <Settings className="w-4 h-4" /> }
    ]
  } : null

  return (
    <header className={cn(
      "fixed w-full z-50 transition-all duration-200",
      scrolled ? "bg-white/95 dark:bg-[#121212]/95 shadow-md backdrop-blur-sm" : "bg-transparent"
    )}>
      {/* Top bar */}
      <div className="bg-[#0A3C1F] dark:bg-black text-white dark:text-[#FFD700] py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Join the San Francisco Deputy Sheriff's Department
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="https://www.facebook.com/SFDeputySheriff" aria-label="Facebook" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Facebook size={16} />
            </Link>
            <Link href="https://twitter.com/SFDeputySheriff" aria-label="Twitter" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Twitter size={16} />
            </Link>
            <Link href="https://www.youtube.com/@SFDeputySheriff" aria-label="YouTube" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Youtube size={16} />
            </Link>
            <Link href="https://www.instagram.com/sfdeputysheriff" aria-label="Instagram" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Instagram size={16} />
            </Link>
            <Link href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs-association" aria-label="LinkedIn" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Linkedin size={16} />
            </Link>
            <ThemeToggle />
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
            <div className="hidden md:flex items-center space-x-6">
              {Object.values(mainNavItems).map((item) => (
                <DropdownNav
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  items={item.items.map(navItem => ({
                    label: (
                      <div className="flex items-center">
                        {navItem.icon && <span className="mr-2">{navItem.icon}</span>}
                        <span>{navItem.label}</span>
                      </div>
                    ),
                    href: navItem.href
                  }))}
                />
              ))}
              {userNavItems && (
                <DropdownNav
                  label={userNavItems.label}
                  icon={userNavItems.icon}
                  items={userNavItems.items.map(navItem => ({
                    label: (
                      <div className="flex items-center">
                        {navItem.icon && <span className="mr-2">{navItem.icon}</span>}
                        <span>{navItem.label}</span>
                      </div>
                    ),
                    href: navItem.href
                  }))}
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="hidden md:flex items-center space-x-2">
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
            {Object.values(mainNavItems).map((section) => (
              <div key={section.label} className="space-y-2">
                <div className="flex items-center text-[#0A3C1F] dark:text-[#FFD700]">
                  {section.icon}
                  <span className="ml-2 font-medium">{section.label}</span>
                </div>
                <div className="ml-6 space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center text-sm text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile social links */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="https://www.facebook.com/SFDeputySheriff" aria-label="Facebook" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Facebook size={20} />
              </Link>
              <Link href="https://twitter.com/SFDeputySheriff" aria-label="Twitter" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Twitter size={20} />
              </Link>
              <Link href="https://www.youtube.com/@SFDeputySheriff" aria-label="YouTube" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Youtube size={20} />
              </Link>
              <Link href="https://www.instagram.com/sfdeputysheriff" aria-label="Instagram" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
                <Instagram size={20} />
              </Link>
              <Link href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs-association" aria-label="LinkedIn" className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white">
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
