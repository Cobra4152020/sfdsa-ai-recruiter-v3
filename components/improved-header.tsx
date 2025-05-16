"use client"

import { useState, useEffect } from "react"
import type { ReactNode, JSX } from "react"
import Link from "next/link"
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
  LucideIcon
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuthModal } from "@/context/auth-modal-context"
import { useUser } from "@/context/user-context"
import { ShieldLogo } from "@/components/shield-logo"

interface ImprovedHeaderProps {
  showOptInForm?: (isApplying?: boolean) => void
}

interface NavItem {
  label: string
  href: string
  icon?: ReactNode
}

interface DropdownNavProps {
  label: string
  icon: ReactNode
  items: NavItem[]
}

function DropdownNav({ label, icon, items }: DropdownNavProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <button 
        className="flex items-center text-white hover:text-[#FFD700] py-2 transition-colors duration-200" 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {icon}
        <span className="mx-1">{label}</span>
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 transform transition-all duration-200 origin-top-right
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {items.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
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
        { label: "Overview", href: "/mission-briefing", icon: <Shield className="w-4 h-4" /> },
        { label: "Daily Briefing", href: "/daily-briefing", icon: <BookOpen className="w-4 h-4" /> },
        { label: "Requirements", href: "/mission-briefing/requirements", icon: <Shield className="w-4 h-4" /> },
        { label: "Application Process", href: "/mission-briefing/process", icon: <Shield className="w-4 h-4" /> }
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
        { label: "Special Missions", href: "/games", icon: <Gamepad2 className="w-4 h-4" /> }
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
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'shadow-lg' : ''}`}>
      {/* Top bar */}
      <div className="bg-[#0A3C1F] text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="mr-2 text-[#FFD700]">
              <ShieldLogo className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-sm md:text-base">SF Deputy Sheriff</div>
              <div className="text-[#FFD700] text-xs -mt-1">AI Recruitment</div>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-3">
              <Link href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-[#FFD700] transition-colors duration-200">
                <Facebook size={16} />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-[#FFD700] transition-colors duration-200">
                <Twitter size={16} />
              </Link>
              <Link href="https://youtube.com" aria-label="YouTube" className="text-white hover:text-[#FFD700] transition-colors duration-200">
                <Youtube size={16} />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-[#FFD700] transition-colors duration-200">
                <Instagram size={16} />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-[#FFD700] transition-colors duration-200">
                <Linkedin size={16} />
              </Link>
              <button 
                onClick={toggleTheme} 
                className="text-white hover:text-[#FFD700] transition-colors duration-200" 
                aria-label="Toggle dark mode"
              >
                <Moon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className={`bg-[#0A3C1F] text-white border-t border-[#1a4c2f] transition-all duration-200 ${scrolled ? 'bg-opacity-95' : ''}`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <DropdownNav {...mainNavItems.mission} />
              <DropdownNav {...mainNavItems.gamification} />
              <DropdownNav {...mainNavItems.games} />
              <DropdownNav {...mainNavItems.support} />
              {userNavItems && <DropdownNav {...userNavItems} />}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:text-[#FFD700] transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!currentUser && (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-medium text-white hover:text-[#FFD700] transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleApplyNow}
                    className="px-4 py-2 text-sm font-medium bg-[#FFD700] text-[#0A3C1F] rounded-md hover:bg-[#FFE55C] transition-colors duration-200"
                  >
                    Apply Now
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              {Object.values(mainNavItems).map((item) => (
                <div key={item.label} className="py-2">
                  <div className="flex items-center px-4 py-2 text-white font-medium">
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </div>
                  <div className="pl-8">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-white hover:text-[#FFD700] transition-colors duration-200"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {!currentUser && (
                <div className="mt-4 px-4 space-y-2">
                  <button
                    onClick={handleLogin}
                    className="w-full px-4 py-2 text-sm font-medium text-white hover:text-[#FFD700] transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleApplyNow}
                    className="w-full px-4 py-2 text-sm font-medium bg-[#FFD700] text-[#0A3C1F] rounded-md hover:bg-[#FFE55C] transition-colors duration-200"
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
