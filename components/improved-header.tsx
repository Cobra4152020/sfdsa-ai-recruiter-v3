"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Facebook, Twitter, Youtube, Instagram, Linkedin, Moon } from "lucide-react"
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
}

interface DropdownNavProps {
  label: string
  icon: React.ReactNode
  items: NavItem[]
}

function DropdownNav({ label, icon, items }: DropdownNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <button className="flex items-center text-white hover:text-[#FFD700] py-2" onClick={() => setIsOpen(!isOpen)}>
        {icon}
        {label}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      <div
        className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 ${isOpen ? "block" : "hidden"} group-hover:block`}
      >
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
  const { isLoggedIn, currentUser } = useUser()
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

  return (
    <header className="w-full">
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
              <Link href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-[#FFD700]">
                <Facebook size={16} />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-[#FFD700]">
                <Twitter size={16} />
              </Link>
              <Link href="https://youtube.com" aria-label="YouTube" className="text-white hover:text-[#FFD700]">
                <Youtube size={16} />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-[#FFD700]">
                <Instagram size={16} />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-[#FFD700]">
                <Linkedin size={16} />
              </Link>
              <button onClick={toggleTheme} className="text-white hover:text-[#FFD700]" aria-label="Toggle dark mode">
                <Moon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-[#0A3C1F] text-white border-t border-[#1a4c2f]">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <DropdownNav
                label="Mission Briefing"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                      clipRule="evenodd"
                    />
                    <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                  </svg>
                }
                items={[
                  { label: "Overview", href: "/mission-briefing/overview" },
                  { label: "Requirements", href: "/mission-briefing/requirements" },
                  { label: "Application Process", href: "/mission-briefing/process" },
                ]}
              />

              <DropdownNav
                label="Top Recruits"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                items={[
                  { label: "Leaderboard", href: "/top-recruits/leaderboard" },
                  { label: "Badges", href: "/top-recruits/badges" },
                  { label: "Awards", href: "/top-recruits/awards" },
                ]}
              />

              <DropdownNav
                label="Play the Game"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                items={[
                  { label: "SF Football Trivia", href: "/trivia/sf-football" },
                  { label: "SF Baseball Trivia", href: "/trivia/sf-baseball" },
                  { label: "SF Basketball Trivia", href: "/trivia/sf-basketball" },
                  { label: "SF Districts Trivia", href: "/trivia/sf-districts" },
                  { label: "SF Tourist Spots Trivia", href: "/trivia/sf-tourist-spots" },
                  { label: "SF Day Trips Trivia", href: "/trivia/sf-day-trips" },
                ]}
              />

              <Link href="/chat-with-sgt-ken" className="flex items-center text-white hover:text-[#FFD700] py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Ask Sgt. Ken
              </Link>
            </nav>

            {/* Donate Now button - positioned to match reference */}
            <Link
              href="/donate"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold px-4 py-2 rounded-md mx-4"
            >
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-1"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                Donate Now
              </span>
            </Link>

            {/* Right side buttons */}
            <button
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleApplyNow}
                className="bg-white hover:bg-gray-100 text-[#0A3C1F] text-sm font-medium px-3 py-1 rounded"
              >
                Apply Now
              </button>

              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] text-sm font-medium px-3 py-1 rounded"
                >
                  Profile
                </Link>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] text-sm font-medium px-3 py-1 rounded"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#1a4c2f] pt-4">
              <nav className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <button
                    onClick={() => {}}
                    className="flex items-center text-white hover:text-[#FFD700] w-full text-left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                        clipRule="evenodd"
                      />
                      <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                    </svg>
                    Mission Briefing
                  </button>
                  <div className="pl-6 space-y-2">
                    <Link href="/mission-briefing/overview" className="block text-gray-300 hover:text-[#FFD700]">
                      Overview
                    </Link>
                    <Link href="/mission-briefing/requirements" className="block text-gray-300 hover:text-[#FFD700]">
                      Requirements
                    </Link>
                    <Link href="/mission-briefing/process" className="block text-gray-300 hover:text-[#FFD700]">
                      Application Process
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {}}
                    className="flex items-center text-white hover:text-[#FFD700] w-full text-left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Top Recruits
                  </button>
                  <div className="pl-6 space-y-2">
                    <Link href="/top-recruits/leaderboard" className="block text-gray-300 hover:text-[#FFD700]">
                      Leaderboard
                    </Link>
                    <Link href="/top-recruits/badges" className="block text-gray-300 hover:text-[#FFD700]">
                      Badges
                    </Link>
                    <Link href="/top-recruits/awards" className="block text-gray-300 hover:text-[#FFD700]">
                      Awards
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {}}
                    className="flex items-center text-white hover:text-[#FFD700] w-full text-left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v9.75c0 .83.67 1.5 1.5 1.5h13.5c.83 0 1.5-.67 1.5-1.5V5.25c0-.83-.67-1.5-1.5-1.5H5.25c-.83 0-1.5.67-1.5 1.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Play the Game
                  </button>
                  <div className="pl-6 space-y-2">
                    <Link href="/trivia/sf-football" className="block text-gray-300 hover:text-[#FFD700]">
                      SF Football Trivia
                    </Link>
                    <Link href="/trivia/sf-baseball" className="block text-gray-300 hover:text-[#FFD700]">
                      SF Baseball Trivia
                    </Link>
                    <Link href="/trivia/sf-basketball" className="block text-gray-300 hover:text-[#FFD700]">
                      SF Basketball Trivia
                    </Link>
                    <Link href="/trivia/sf-districts" className="block text-gray-300 hover:text-[#FFD700]">
                      SF Districts Trivia
                    </Link>
                  </div>
                </div>

                <Link
                  href="/chat-with-sgt-ken"
                  className="flex items-center text-white hover:text-[#FFD700]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ask Sgt. Ken
                </Link>

                <div className="pt-4 border-t border-[#1a4c2f] flex justify-between">
                  <Link href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-[#FFD700]">
                    <Facebook size={18} />
                  </Link>
                  <Link href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-[#FFD700]">
                    <Twitter size={18} />
                  </Link>
                  <Link href="https://youtube.com" aria-label="YouTube" className="text-white hover:text-[#FFD700]">
                    <Youtube size={18} />
                  </Link>
                  <Link href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-[#FFD700]">
                    <Instagram size={18} />
                  </Link>
                  <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-white hover:text-[#FFD700]">
                    <Linkedin size={18} />
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="text-white hover:text-[#FFD700]"
                    aria-label="Toggle dark mode"
                  >
                    <Moon size={18} />
                  </button>
                </div>

                <div className="mt-4 flex justify-center">
                  <Link
                    href="/donate"
                    className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold px-4 py-2 rounded-md w-full text-center"
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                      Donate Now
                    </span>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
