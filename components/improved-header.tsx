"use client"

import { useEffect } from "react"

import { useState } from "react"

import Link from "next/link"
import { Menu, X, Shield, Facebook, Twitter, Youtube, Instagram, Linkedin, Moon, Sun, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { usePathname } from "next/navigation"
import { DropdownNav } from "@/components/ui/dropdown-nav"
import { cn } from "@/lib/utils"
import { AskSgtKenButton } from "@/components/ask-sgt-ken-button"

interface ImprovedHeaderProps {
  showOptInForm?: (isApplying?: boolean) => void
  isScrolled?: boolean
}

export function ImprovedHeader({ showOptInForm, isScrolled: propIsScrolled }: ImprovedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(propIsScrolled || false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileDropdowns, setMobileDropdowns] = useState({
    topRecruits: false,
    playTheGame: false,
    benefits: false,
  })

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
          >
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" aria-hidden="true" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </Link>

          {/* Social Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://facebook.com/sfdsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/sfdsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com/sfdsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to our YouTube channel"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/sfdsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-white hover:text-[#FFD700] transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/company/sfdsa"
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
                label="Benefits"
                items={[
                  { label: "Overview", href: "/#benefits" },
                  { label: "G.I. Bill", href: "/gi-bill" },
                  { label: "Discounted Housing", href: "/discounted-housing" },
                ]}
              />
              <DropdownNav
                label="Top Recruits"
                items={[
                  { label: "Top Recruits", href: "/awards" },
                  { label: "Leaderboard", href: "/awards#leaderboard" },
                  { label: "Badge Gallery", href: "/badges" },
                  { label: "NFT Awards", href: "/nft-awards/coming-soon" },
                ]}
              />
              <DropdownNav
                label="Play the Game"
                items={[
                  { label: "Explainer", href: "/gamification" },
                  { label: "Play Trivia w/ Sgt. Ken", href: "/trivia" },
                  { label: "Memory Match Deluxe", href: "/games/memory-match" },
                  { label: "Spin to Win", href: "/games/spin-to-win" },
                ]}
              />
              <Link href="/donate" className="text-white hover:text-[#FFD700] transition-colors">
                Donate
              </Link>
              <Link href="/volunteer-login" className="text-white hover:text-[#FFD700] transition-colors">
                Volunteer Recruiter
              </Link>
              <AskSgtKenButton
                variant="ghost"
                className="text-white hover:text-[#FFD700] transition-colors p-0 h-auto font-normal"
                position="static"
              />
            </nav>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
              <Button
                onClick={() => showOptInForm && showOptInForm(true)}
                className="bg-white hover:bg-white/90 text-[#0A3C1F] dark:text-[#121212] font-medium"
              >
                Apply Now
              </Button>
              <Link href="/login">
                <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-[#121212] font-medium">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0A3C1F] border-t border-white/10">
            {/* Mobile navigation items */}

            {/* Mobile Benefits dropdown */}
            <div className="block px-3 py-2">
              <button
                onClick={() => setMobileDropdowns((prev) => ({ ...prev, benefits: !prev.benefits }))}
                className="flex items-center w-full text-white hover:text-[#FFD700]"
              >
                Benefits
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
                    "transform rotate-180": mobileDropdowns.benefits,
                  })}
                />
              </button>

              {mobileDropdowns.benefits && (
                <div className="pl-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/#benefits" className="block text-white hover:text-[#FFD700]">
                    Overview
                  </Link>
                  <Link href="/gi-bill" className="block text-white hover:text-[#FFD700]">
                    G.I. Bill
                  </Link>
                  <Link href="/discounted-housing" className="block text-white hover:text-[#FFD700]">
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
                Top Recruits
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
                    "transform rotate-180": mobileDropdowns.topRecruits,
                  })}
                />
              </button>

              {mobileDropdowns.topRecruits && (
                <div className="pl-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/awards" className="block text-white hover:text-[#FFD700]">
                    Top Recruits
                  </Link>
                  <Link href="/awards#leaderboard" className="block text-white hover:text-[#FFD700]">
                    Leaderboard
                  </Link>
                  <Link href="/badges" className="block text-white hover:text-[#FFD700]">
                    Badge Gallery
                  </Link>
                  <Link href="/nft-awards/coming-soon" className="block text-white hover:text-[#FFD700]">
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
                Play the Game
                <ChevronDown
                  className={cn("ml-1 h-4 w-4 transition-transform duration-200", {
                    "transform rotate-180": mobileDropdowns.playTheGame,
                  })}
                />
              </button>

              {mobileDropdowns.playTheGame && (
                <div className="pl-4 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link href="/gamification" className="block text-white hover:text-[#FFD700]">
                    Explainer
                  </Link>
                  <Link href="/trivia" className="block text-white hover:text-[#FFD700]">
                    Play Trivia w/ Sgt. Ken
                  </Link>
                  <Link href="/games/memory-match" className="block text-white hover:text-[#FFD700]">
                    Memory Match Deluxe
                  </Link>
                  <Link href="/games/spin-to-win" className="block text-white hover:text-[#FFD700]">
                    Spin to Win
                  </Link>
                </div>
              )}
            </div>

            <Link href="/donate" className="block px-3 py-2 text-white hover:text-[#FFD700]">
              Donate
            </Link>
            <Link href="/volunteer-login" className="block px-3 py-2 text-white hover:text-[#FFD700]">
              Volunteer Recruiter
            </Link>
            <div className="block px-3 py-2 text-white hover:text-[#FFD700]">
              <AskSgtKenButton
                variant="ghost"
                className="text-white hover:text-[#FFD700] transition-colors p-0 h-auto font-normal"
                position="static"
              />
            </div>
            <Link href="/login" className="block px-3 py-2 text-white hover:text-[#FFD700]">
              Login
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="px-5 py-4 border-t border-white/10 flex space-x-3">
            <Button
              onClick={() => {
                showOptInForm && showOptInForm(true)
                setIsMobileMenuOpen(false)
              }}
              className="flex-1 bg-white hover:bg-white/90 text-[#0A3C1F] dark:text-[#121212] font-medium"
            >
              Apply Now
            </Button>
            <Link href="/login" className="flex-1">
              <Button
                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-[#121212] font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
