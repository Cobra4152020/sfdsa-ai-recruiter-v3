"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-provider"
import { DropdownNav } from "@/components/ui/dropdown-nav"
import { NotificationBell } from "@/components/notification-bell"
import { useUserContext } from "@/context/user-context"
import { useMobile } from "@/hooks/use-mobile"

interface ImprovedHeaderProps {
  showOptInForm: (applying?: boolean) => void
}

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user } = useUserContext()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleApplyClick = () => {
    showOptInForm(true)
  }

  const handleInfoClick = () => {
    showOptInForm(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/sfdsa-logo.png" alt="SF Deputy Sheriff's Association" className="h-8 w-auto mr-2" />
              <span className="hidden md:inline-block font-bold text-[#0A3C1F] dark:text-white">SF Deputy Sheriff</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pathname === "/"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Home
            </Link>

            <DropdownNav
              trigger={
                <button className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center">
                  Benefits
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              }
              items={[
                { label: "GI Bill", href: "/gi-bill" },
                { label: "Discounted Housing", href: "/discounted-housing" },
              ]}
            />

            <Link
              href="/gamification"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pathname === "/gamification"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Gamification
            </Link>

            <Link
              href="/trivia"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pathname === "/trivia"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Trivia
            </Link>

            <Link
              href="/donate"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pathname === "/donate"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Donate
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pathname === "/contact"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            {user && <NotificationBell userId={user.id} />}

            <ThemeToggle />

            {!isMobile && (
              <>
                <Button variant="outline" className="hidden sm:inline-flex" onClick={handleInfoClick}>
                  Get Info
                </Button>
                <Button onClick={handleApplyClick}>Apply Now</Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Home
            </Link>

            <Link
              href="/gi-bill"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/gi-bill"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              GI Bill
            </Link>

            <Link
              href="/discounted-housing"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/discounted-housing"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Discounted Housing
            </Link>

            <Link
              href="/gamification"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/gamification"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Gamification
            </Link>

            <Link
              href="/trivia"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/trivia"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Trivia
            </Link>

            <Link
              href="/donate"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/donate"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Donate
            </Link>

            <Link
              href="/contact"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                pathname === "/contact"
                  ? "text-[#0A3C1F] dark:text-white bg-gray-100 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#0A3C1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Contact
            </Link>

            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3">
                <Button variant="outline" className="w-full mb-2" onClick={handleInfoClick}>
                  Get Info
                </Button>
              </div>
              <div className="flex items-center px-3">
                <Button className="w-full" onClick={handleApplyClick}>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
