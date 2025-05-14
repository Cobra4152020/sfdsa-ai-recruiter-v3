"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import ApplyButton from "./apply-button"
import AskSgtKenButton from "./ask-sgt-ken-button"
import NotificationBell from "./notification-bell"

export default function ImprovedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      if (session) {
        // Check user type
        const userId = session.user.id

        // Check if admin
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle()

        if (adminData) {
          setUserType("admin")
          return
        }

        // Check if volunteer
        const { data: volunteerData } = await supabase
          .from("volunteer_users")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle()

        if (volunteerData) {
          setUserType("volunteer")
          return
        }

        // Default to recruit
        setUserType("recruit")
      }
    }

    checkAuth()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUserType(null)
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/sfdsa-logo.png" alt="SF Deputy Sheriff's Association" className="h-10 mr-2" />
            <span className="hidden font-bold sm:inline-block">SF Deputy Sheriff's Association</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:space-x-4">
          <Link
            href="/mission-briefing"
            className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            Mission
          </Link>
          <Link
            href="/deputy-launchpad"
            className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            Launchpad
          </Link>
          <Link
            href="/gamification"
            className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            Rewards
          </Link>
          <Link href="/trivia" className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            Trivia
          </Link>

          <AskSgtKenButton variant="outline" size="sm" />

          {isAuthenticated ? (
            <>
              <NotificationBell />

              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  My Account
                  <ChevronDown className="w-4 h-4" />
                </Button>

                <div className="absolute right-0 z-10 invisible w-48 py-2 mt-1 bg-white border rounded-md shadow-lg opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity">
                  {userType === "admin" && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}

                  {userType === "volunteer" && (
                    <Link
                      href="/volunteer-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Volunteer Dashboard
                    </Link>
                  )}

                  <Link href="/user-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>

                  <Link href="/profile/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <ApplyButton variant="default" size="sm" />
          )}
        </nav>

        <div className="flex items-center md:hidden">
          {isAuthenticated && <NotificationBell />}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 ml-2 text-gray-600 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="px-4 py-3 md:hidden">
          <div className="flex flex-col space-y-2">
            <Link
              href="/mission-briefing"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Mission
            </Link>
            <Link
              href="/deputy-launchpad"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Launchpad
            </Link>
            <Link
              href="/gamification"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Rewards
            </Link>
            <Link
              href="/trivia"
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Trivia
            </Link>

            <div className="pt-2 mt-2 border-t">
              {isAuthenticated ? (
                <>
                  {userType === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {userType === "volunteer" && (
                    <Link
                      href="/volunteer-dashboard"
                      className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Volunteer Dashboard
                    </Link>
                  )}

                  <Link
                    href="/user-dashboard"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile/settings"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full px-3 py-2 text-sm font-medium text-left text-red-600 rounded-md hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <AskSgtKenButton className="w-full" />
                  <ApplyButton className="w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
