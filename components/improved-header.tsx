"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Shield,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Moon,
  Sun,
  ChevronDown,
  Heart,
  Rocket,
  FileText,
  GamepadIcon,
  MessageSquare,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { DropdownNav } from "@/components/ui/dropdown-nav"
import { cn } from "@/lib/utils"
import { NotificationBell } from "@/components/notification-bell"
import { useUser } from "@/context/user-context"
import { UserAuthStatus } from "@/components/user-auth-status"
import { useAuthModal } from "@/context/auth-modal-context"

interface ImprovedHeaderProps {
  showOptInFormState?: boolean
  setShowOptInFormState?: (state: boolean) => void
  isScrolled?: boolean
}

export function ImprovedHeader({
  showOptInFormState,
  setShowOptInFormState,
  isScrolled: propIsScrolled,
}: ImprovedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(propIsScrolled || false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileDropdowns, setMobileDropdowns] = useState({
    topRecruits: false,
    playTheGame: false,
    missionBriefing: false,
  })
  const { currentUser } = useUser()
  const { openModal } = useAuthModal()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Create a safe handler function that checks if showOptInForm exists before calling it
  const handleOptInClick = () => {
    // Use the new auth modal instead of the old opt-in form
    openModal("register", "recruit")
  }

  // Handle link clicks to prevent default behavior if needed
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the link is not ready or has issues, prevent default behavior
    const href = e.currentTarget.getAttribute("href")
    if (href && (href.includes("#") || href === "/")) {
      // Allow these to work normally
      return
    }

    // For other links, check if they're ready
    try {
      // If we're in development or testing, let the links work
      if (process.env.NODE_ENV === "development") {
        return
      }

      // For production, check if the page exists
      // This is a simplified check - in reality you might want to check if the route exists
      const isReady = true // Set to false if you want to disable all links temporarily

      if (!isReady) {
        e.preventDefault()
        console.log("This feature is coming soon!")
        // Optionally show a toast or message to the user
      }
    } catch (error) {
      // If there's an error, prevent navigation
      e.preventDefault()
      console.warn("Navigation error:", error)
    }
  }

  return (
    <header
      className={`bg-[#0A3C1F] dark:bg-[#121212] text-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md py-2" : "py-4"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row with logo and social icons */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
            aria-label="SF Deputy Sheriff AI Recruitment - Home"
            onClick={handleLinkClick}
          >
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" aria-hidden="true" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </Link>

          {/* Donation Button - Desktop */}
          <Link
            href="/donate"
            className="hidden md:flex items-center bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold py-2 px-4 rounded-md transition-colors shadow-md"
            onClick={handleLinkClick}
          >
            <Heart className="h-5 w-5 mr-2" />
            Donate Now
          </Link>

          {/* Social Icons and Theme Toggle - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification Bell - Only show if user is logged in */}
            {currentUser && <NotificationBell userId={currentUser.id} />}

            <a
              href="https://www.facebook.com/SanFranciscoDeputySheriffsAssociation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/sanfranciscodsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCgyW7q86c-Mua4bS1a9wBWA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to our YouTube channel"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/sfdeputysheriffsassociation/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/san-francisco-deputy-sheriffs%E2%80%99-association/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with us on LinkedIn"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="text-white hover:text-[#FFD700] transition-colors p-1 rounded-full hover:bg-white/10"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom row with navigation and buttons */}
        <div className="border-t border-white/10 pt-4 mt-4 hidden md:block">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
              <DropdownNav
                label={
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Mission Briefing
                  </span>
                }
                items={[
                  { label: "Overview", href: "/mission-briefing", onClick: handleLinkClick },
                  { label: "G.I. Bill", href: "/gi-bill", onClick: handleLinkClick },
                  { label: "Discounted Housing", href: "/discounted-housing", onClick: handleLinkClick },
                ]}
              />
              <DropdownNav
                label={
                  <span className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Top Recruits
                  </span>
                }
                items={[
                  { label: "Top Recruits", href: "/awards", onClick: handleLinkClick },
                  { label: "Leaderboard", href: "/awards#leaderboard", onClick: handleLinkClick },
                  { label: "Badge Gallery", href: "/badges", onClick: handleLinkClick },
                  { label: "NFT Awards", href: "/nft-awards/coming-soon", onClick: handleLinkClick },
                ]}
              />
              <DropdownNav
                label={
                  <span className="flex items-center">
                    <GamepadIcon className="h-4 w-4 mr-1" />
                    Play the Game
                  </span>
                }
                items={[
                  {
                    label: (
                      <span className="flex items-center">
                        <Rocket className="h-4 w-4 mr-1" />
                        Deputy Launchpad
                      </span>
                    ),
                    href: "/deputy-launchpad",
                    onClick: handleLinkClick,
                  },
                  { label: "Play Trivia w/ Sgt. Ken", href: "/trivia", onClick: handleLinkClick },
                  { label: "Sgt. Ken's Daily Briefing", href: "/daily-briefing", onClick: handleLinkClick },
                ]}
              />
              <Link
                href="/chat-with-sgt-ken"
                className="text-white hover:text-[#FFD700] transition-colors"
                onClick={handleLinkClick}
              >
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Ask Sgt. Ken
                </span>
              </Link>
            </nav>

            {/* Right side buttons - Now using UserAuthStatus */}
            <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
              <UserAuthStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0A3C1F] border-t border-white/10">
            {/* Mobile notification bell */}
            {currentUser && (
              <div className="px-3 py-2">
                <NotificationBell userId={currentUser.id} />
              </div>
            )}

            {/* Donation Button - Mobile */}
            <Link
              href="/donate"
              className="flex items-center justify-center bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold py-3 px-4 rounded-md transition-colors shadow-md mb-4"
              onClick={handleLinkClick}
            >
              <Heart className="h-5 w-5 mr-2" />
              Donate Now
            </Link>

            {/* Mobile Mission Briefing dropdown */}
            <div className="block px-3 py-2">
              <button
                onClick={() => setMobileDropdowns((prev) => ({ ...prev, missionBriefing: !prev.missionBriefing }))}
                className="flex items-center w-full text-white hover:text-[#FFD700]"
              >
                <FileText className="h-4 w-4 mr-2" />
                Mission Briefing
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
                    "transform rotate-180": mobileDropdowns.missionBriefing,
                  })}
                />
              </button>

              {mobileDropdowns.missionBriefing && (
                <div className="pl-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/mission-briefing"
                    className="block text-white hover:text-[#FFD700]"
                    onClick={handleLinkClick}
                  >
                    Overview
                  </Link>
                  <Link href="/gi-bill" className="block text-white hover:text-[#FFD700]" onClick={handleLinkClick}>
                    G.I. Bill
                  </Link>
                  <Link
                    href="/discounted-housing"
                    className="block text-white hover:text-[#FFD700]"
                    onClick={handleLinkClick}
                  >
                    Discounted Housing
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Top Recruits dropdown */}
            <div className="block px-3 py-2">
              <button
                onClick={() => setMobileDropdowns((prev) => ({ ...prev, topRecruits: !prev.topRecruits }))}
                className="flex items-center w-full text-white hover:text-[#FFD700]"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Top Recruits
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
                    "transform rotate-180": mobileDropdowns.topRecruits,
                  })}
                />
              </button>

              {mobileDropdowns.topRecruits && (
                <div className="pl-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/awards" className="block text-white hover:text-[#FFD700]" onClick={handleLinkClick}>
                    Top Recruits
                  </Link>
                  <Link
                    href="/awards#leaderboard"
                    className="block text-white hover:text-[#FFD700]"
                    onClick={handleLinkClick}
                  >
                    Leaderboard
                  </Link>
                  <Link href="/badges" className="block text-white hover:text-[#FFD700]" onClick={handleLinkClick}>
                    Badge Gallery
                  </Link>
                  <Link
                    href="/nft-awards/coming-soon"
                    className="block text-white hover:text-[#FFD700]"
                    onClick={handleLinkClick}
                  >
                    NFT Awards{" "}
                    <span className="ml-1 px-1 py-0.5 text-xs bg-[#FFD700] text-[#0A3C1F] rounded-full">Soon</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Play the Game dropdown */}
            <div className="block px-3 py-2">
              <button
                onClick={() => setMobileDropdowns((prev) => ({ ...prev, playTheGame: !prev.playTheGame }))}
                className="flex items-center w-full text-white hover:text-[#FFD700]"
              >
                <GamepadIcon className="h-4 w-4 mr-2" />
                Play the Game
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
                    "transform rotate-180": mobileDropdowns.playTheGame,
                  })}
                />
              </button>

              {mobileDropdowns.playTheGame && (
                <div className="pl-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    href="/deputy-launchpad"
                    className="block text-white hover:text-[#FFD700] flex items-center"
                    onClick={handleLinkClick}
                  >
                    <Rocket className="h-4 w-4 mr-1" />
                    Deputy Launchpad
                  </Link>
                  <Link href="/trivia" className="block text-white hover:text-[#FFD700]" onClick={handleLinkClick}>
                    Play Trivia w/ Sgt. Ken
                  </Link>
                  <Link
                    href="/daily-briefing"
                    className="block text-white hover:text-[#FFD700]"
                    onClick={handleLinkClick}
                  >
                    Sgt. Ken's Daily Briefing
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/chat-with-sgt-ken"
              className="block px-3 py-2 text-white hover:text-[#FFD700] flex items-center"
              onClick={handleLinkClick}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask Sgt. Ken
            </Link>
            <Link href="/login" className="block px-3 py-2 text-white hover:text-[#FFD700]" onClick={handleLinkClick}>
              Login
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="px-5 py-4 border-t border-white/10 flex space-x-3">
            <Button
              onClick={handleOptInClick}
              className="flex-1 bg-white hover:bg-white/90 text-[#0A3C1F] dark:text-[#121212] font-medium"
            >
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
