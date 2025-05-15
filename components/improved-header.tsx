"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { UserProfile } from "@/components/user-profile"
import { useTheme } from "@/components/theme-provider"
import { useAuthModal } from "@/context/auth-modal-context"

interface ImprovedHeaderProps {
  showOptInForm?: (isApplying?: boolean) => void
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isLoggedIn } = useUser()
  const { openModal } = useAuthModal()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Handle sign up button click
  const handleSignUp = () => {
    if (typeof openModal === "function") {
      openModal("signup", "recruit")
    } else if (showOptInForm) {
      showOptInForm(false)
    }
  }

  // Handle apply now button click
  const handleApplyNow = () => {
    if (typeof openModal === "function") {
      openModal("optin", "recruit")
    } else if (showOptInForm) {
      showOptInForm(true)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0A3C1F] dark:bg-black py-1 shadow-lg`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        {/* Top row with logo and theme toggle */}
        <div className="flex items-center justify-between py-1 border-b border-white/10">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="SF Deputy Sheriff AI Recruitment - Home">
            <Shield className="h-8 w-8 text-[#FFD700] mr-2" aria-hidden="true" />
            <div>
              <span className="font-bold text-white text-lg">SF Deputy Sheriff</span>
              <span className="text-[#FFD700] text-xs block -mt-1">AI Recruitment</span>
            </div>
          </Link>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

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
        </div>

        {/* Bottom row with navigation and buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
            <Link href="/" className="text-white hover:text-[#FFD700] transition-colors">
              Home
            </Link>
            <Link href="/awards" className="text-white hover:text-[#FFD700] transition-colors">
              Top Recruit Awards
            </Link>
            <Link href="/practice-tests" className="text-white hover:text-[#FFD700] transition-colors">
              Practice Tests
            </Link>
            <Link href="/gi-bill" className="text-white hover:text-[#FFD700] transition-colors">
              G.I. Bill
            </Link>
            <Link href="/discounted-housing" className="text-white hover:text-[#FFD700] transition-colors">
              Discounted Housing
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4 mt-1 md:mt-0">
            {isLoggedIn ? (
              <UserProfile />
            ) : (
              <Button
                onClick={handleSignUp}
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-medium"
              >
                Sign Up
              </Button>
            )}

            <Button
              onClick={handleApplyNow}
              className="bg-white hover:bg-white/90 text-[#0A3C1F] font-medium"
              aria-label="Apply now for Deputy Sheriff position"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[#0A3C1F] dark:bg-black border-t border-white/10"
          aria-label="Mobile Navigation"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#FFD700] py-2 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/awards"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#FFD700] py-2 transition-colors"
              >
                Top Recruit Awards
              </Link>
              <Link
                href="/practice-tests"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#FFD700] py-2 transition-colors"
              >
                Practice Tests
              </Link>
              <Link
                href="/gi-bill"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#FFD700] py-2 transition-colors"
              >
                G.I. Bill
              </Link>
              <Link
                href="/discounted-housing"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#FFD700] py-2 transition-colors"
              >
                Discounted Housing
              </Link>

              <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                {isLoggedIn ? (
                  <div className="py-2">
                    <UserProfile />
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      handleSignUp()
                      setIsMenuOpen(false)
                    }}
                    className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] dark:text-black font-medium w-full"
                  >
                    Sign Up
                  </Button>
                )}

                <Button
                  onClick={() => {
                    handleApplyNow()
                    setIsMenuOpen(false)
                  }}
                  className="bg-white hover:bg-white/90 text-[#0A3C1F] font-medium w-full"
                  aria-label="Apply now for Deputy Sheriff position"
                >
                  Apply Now
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
