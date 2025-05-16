"use client"

import { useState, useEffect } from "react"
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

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center text-white hover:text-[#FFD700] py-2 transition-all duration-200 group"
      >
        <span className="flex items-center transform group-hover:scale-105 transition-transform duration-200">
          {icon}
          <span className="mx-1">{label}</span>
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <div
        className={`absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 transform transition-all duration-200 origin-top-right border border-gray-100 dark:border-gray-700
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
      >
        {items.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 group"
          >
            {item.icon && (
              <span className="mr-2 transform group-hover:scale-110 transition-transform duration-200 text-gray-500 dark:text-gray-400 group-hover:text-[#FFD700]">
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
      <div className={`bg-[#0A3C1F] text-white border-t border-[#1a4c2f] transition-all duration-200 ${scrolled ? 'bg-opacity-95 backdrop-blur-sm' : ''}`}>
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
              <svg className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!currentUser && (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-medium text-white hover:text-[#FFD700] transition-all duration-200 border border-transparent hover:border-[#FFD700] rounded-lg hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  >
                    Sign In
                  </button>
                  <a
                    href="https://www.sfdsa.org/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 text-sm font-semibold bg-[#FFD700] text-[#0A3C1F] hover:bg-[#F4C430] transition-all duration-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform"
                  >
                    Support SFDSA
                  </a>
                  <button
                    onClick={handleApplyNow}
                    className="px-6 py-2.5 text-sm font-semibold bg-[#FFD700] text-[#0A3C1F] hover:bg-[#F4C430] transition-all duration-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform"
                  >
                    Apply Now
                  </button>
                </>
              )}
              {currentUser && (
                <button
                  onClick={handleApplyNow}
                  className="px-6 py-2.5 text-sm font-semibold bg-[#FFD700] text-[#0A3C1F] hover:bg-[#F4C430] transition-all duration-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div 
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="mt-4 pb-4 space-y-2">
              {Object.values(mainNavItems).map((item, index) => (
                <div 
                  key={item.label} 
                  className={`py-2 transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center px-4 py-2 text-white font-medium rounded-lg hover:bg-[#0A3C1F]/30 transition-all duration-200">
                    <span className="transform transition-transform duration-200 text-[#FFD700]">
                      {item.icon}
                    </span>
                    <span className="ml-2">{item.label}</span>
                  </div>
                  <div className="pl-8 space-y-1 mt-1">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-4 py-2 text-sm text-white hover:text-[#FFD700] transition-all duration-200 hover:bg-[#0A3C1F]/50 rounded-lg transform ${
                          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                        }`}
                        style={{ transitionDelay: `${(index * 50) + (subIndex * 30)}ms` }}
                      >
                        <span className="flex items-center">
                          <span className="transform transition-transform duration-200 text-gray-400 group-hover:text-[#FFD700]">
                            {subItem.icon}
                          </span>
                          <span className="ml-2">{subItem.label}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {!currentUser && (
                <div className="mt-6 px-4 space-y-3">
                  <button
                    onClick={handleLogin}
                    className={`w-full px-4 py-2.5 text-sm font-medium text-white hover:text-[#FFD700] transition-all duration-200 border border-transparent hover:border-[#FFD700] rounded-lg transform ${
                      isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${Object.keys(mainNavItems).length * 50 + 100}ms` }}
                  >
                    Sign In
                  </button>
                  <a
                    href="https://www.sfdsa.org/donate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full px-4 py-2.5 text-sm font-semibold bg-[#FFD700] text-[#0A3C1F] hover:bg-[#F4C430] transition-all duration-200 rounded-lg text-center transform ${
                      isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${Object.keys(mainNavItems).length * 50 + 150}ms` }}
                  >
                    Support SFDSA
                  </a>
                  <button
                    onClick={handleApplyNow}
                    className={`w-full px-4 py-2.5 text-sm font-semibold bg-[#FFD700] text-[#0A3C1F] hover:bg-[#F4C430] transition-all duration-200 rounded-lg transform ${
                      isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${Object.keys(mainNavItems).length * 50 + 200}ms` }}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
