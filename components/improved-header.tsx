"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
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
  href: string
  icon?: ReactNode
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { currentUser } = useUser()
  const { openModal } = useAuthModal()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const { scrollY } = useClientOnly(() => getWindowDimensions(), { scrollY: 0, width: 0, height: 0, innerWidth: 0, innerHeight: 0 })

  useEffect(() => {
    setScrolled(scrollY > 10)
  }, [scrollY])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

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
            <a href="https://www.facebook.com/SFDeputySheriff" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Facebook size={16} />
            </a>
            <a href="https://twitter.com/SFDeputySheriff" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Twitter size={16} />
            </a>
            <a href="https://www.youtube.com/@SFDeputySheriff" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Youtube size={16} />
            </a>
            <a href="https://www.instagram.com/sfdeputysheriff" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Instagram size={16} />
            </a>
            <a href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs-association" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white hover:text-[#FFD700] dark:text-[#FFD700] dark:hover:text-white transition-colors duration-200">
              <Linkedin size={16} />
            </a>
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
            <a href="/" className="flex items-center space-x-2 group transition-transform duration-200 hover:scale-105">
              <ShieldLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-[#0A3C1F] dark:text-[#FFD700]">SFDSA</span>
            </a>

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
              {!currentUser && (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={handleLogin}
                    className="text-[#0A3C1F] dark:text-[#FFD700] hover:text-[#FFD700] dark:hover:text-white"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleApplyNow}
                    className="bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90 dark:bg-[#FFD700] dark:text-black dark:hover:bg-[#FFD700]/90"
                  >
                    Apply Now
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-[#0A3C1F] dark:text-[#FFD700]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 top-[calc(4rem+2.5rem)] bottom-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="container mx-auto px-4 py-4 h-full overflow-y-auto">
            {Object.values(mainNavItems).map((section) => (
              <div key={section.label} className="mb-6">
                <h3 className="text-[#0A3C1F] dark:text-[#FFD700] font-semibold mb-3 flex items-center text-lg">
                  {section.icon && <span className="mr-2">{section.icon}</span>}
                  {section.label}
                </h3>
                <div className="space-y-3 pl-6">
                  {section.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block w-full text-left text-gray-600 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-[#FFD700] py-2 flex items-center text-base transition-all duration-200 hover:translate-x-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                      tabIndex={isMobileMenuOpen ? 0 : -1}
                    >
                      {item.icon && <span className="mr-3 opacity-75">{item.icon}</span>}
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            {!currentUser && (
              <div className="mt-8 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogin()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-[#0A3C1F] dark:text-[#FFD700] text-lg font-medium"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    handleApplyNow()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-[#0A3C1F] text-white hover:bg-[#0A3C1F]/90 dark:bg-[#FFD700] dark:text-black dark:hover:bg-[#FFD700]/90 text-lg font-medium"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  Apply Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
