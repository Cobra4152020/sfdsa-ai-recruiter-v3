"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthTriggerButton } from "@/components/auth-trigger-button"
import { UserAuthStatus } from "@/components/user-auth-status"
import { useMobile } from "@/hooks/use-mobile"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useAuthModal } from "@/context/auth-modal-context"

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

interface ImprovedHeaderProps {
  showOptInForm: () => void
}

const mainNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Resources",
    href: "#",
    children: [
      { label: "GI Bill Benefits", href: "/gi-bill" },
      { label: "Discounted Housing", href: "/discounted-housing" },
      { label: "Gamification", href: "/gamification" },
      { label: "Mission Briefing", href: "/mission-briefing" },
      { label: "Deputy Launchpad", href: "/deputy-launchpad" },
    ],
  },
  {
    label: "Trivia Games",
    href: "#",
    children: [
      { label: "All Trivia Games", href: "/trivia" },
      { label: "SF Football", href: "/trivia/sf-football" },
      { label: "SF Baseball", href: "/trivia/sf-baseball" },
      { label: "SF Basketball", href: "/trivia/sf-basketball" },
      { label: "SF Districts", href: "/trivia/sf-districts" },
      { label: "SF Tourist Spots", href: "/trivia/sf-tourist-spots" },
      { label: "SF Day Trips", href: "/sf-day-trips" },
    ],
  },
  {
    label: "Community",
    href: "#",
    children: [
      { label: "Awards", href: "/awards" },
      { label: "Badges", href: "/badges" },
      { label: "Chat with Sgt. Ken", href: "/chat-with-sgt-ken" },
      { label: "Daily Briefing", href: "/daily-briefing" },
      { label: "TikTok Challenges", href: "/tiktok-challenges" },
    ],
  },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
]

export function ImprovedHeader({ showOptInForm }: ImprovedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const isMobile = useMobile()
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() => setMobileMenuOpen(false))

  // Safely access the auth modal context
  const { openModal: contextOpenModal } = useAuthModal()
  const openModal =
    contextOpenModal ||
    (() => {
      console.warn("Auth modal context not available")
      showOptInForm()
    })

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const toggleSubmenu = (label: string) => {
    if (activeSubmenu === label) {
      setActiveSubmenu(null)
    } else {
      setActiveSubmenu(label)
    }
  }

  const handleRegisterClick = () => {
    if (typeof openModal === "function") {
      openModal("signup", "recruit")
    } else {
      showOptInForm()
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-[#0A3C1F] mr-8">
              SFDSA AI Recruiter
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {mainNavItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.children ? (
                    <button
                      className={`flex items-center text-gray-600 hover:text-[#0A3C1F] px-1 py-2 ${
                        item.children.some((child) => child.href === pathname) ? "text-[#0A3C1F] font-medium" : ""
                      }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-gray-600 hover:text-[#0A3C1F] px-1 py-2 ${
                        pathname === item.href ? "text-[#0A3C1F] font-medium" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Desktop Dropdown */}
                  {item.children && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                      <div className="py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                              pathname === child.href ? "bg-gray-50 text-[#0A3C1F] font-medium" : "text-gray-700"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <UserAuthStatus />
            <AuthTriggerButton mode="signin" userType="recruit" label="Sign In" />
            <Button onClick={handleRegisterClick} className="bg-[#0A3C1F] hover:bg-[#0D4D28] text-white">
              Join Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-lg absolute top-16 left-0 right-0 z-50" ref={mobileMenuRef}>
          <nav className="flex flex-col space-y-3">
            {mainNavItems.map((item) => (
              <div key={item.label} className="py-1">
                {item.children ? (
                  <>
                    <button
                      className={`flex items-center justify-between w-full text-left text-gray-600 px-1 py-2 ${
                        item.children.some((child) => child.href === pathname) ? "text-[#0A3C1F] font-medium" : ""
                      }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${activeSubmenu === item.label ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    {activeSubmenu === item.label && (
                      <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`block py-2 text-sm ${
                              pathname === child.href ? "text-[#0A3C1F] font-medium" : "text-gray-600"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-1 py-2 ${
                      pathname === item.href ? "text-[#0A3C1F] font-medium" : "text-gray-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 mt-2 border-t border-gray-200 space-y-3">
              <UserAuthStatus />
              <AuthTriggerButton mode="signin" userType="recruit" label="Sign In" className="w-full" />
              <Button
                onClick={() => {
                  handleRegisterClick()
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-[#0A3C1F] hover:bg-[#0D4D28] text-white"
              >
                Join Now
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
