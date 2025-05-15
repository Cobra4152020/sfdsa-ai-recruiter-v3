"use client"

import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram, Linkedin, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useAuthModal } from "@/context/auth-modal-context"
import { useUser } from "@/context/user-context"

export function ExactHeaderMatch() {
  const { theme, setTheme } = useTheme()
  const { openModal } = useAuthModal()
  const { isLoggedIn } = useUser()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogin = () => {
    if (typeof openModal === "function") {
      openModal("signin", "recruit")
    }
  }

  const handleApplyNow = () => {
    if (typeof openModal === "function") {
      openModal("optin", "recruit")
    }
  }

  return (
    <header className="w-full">
      {/* Top bar with logo and social icons */}
      <div className="bg-[#0A3C1F] text-white">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-[#FFD700] mr-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 3L20 7V11C20 15.4183 16.4183 19 12 19C7.58172 19 4 15.4183 4 11V7L12 3Z"
                  stroke="#FFD700"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <div className="font-bold">SF Deputy Sheriff</div>
              <div className="text-[#FFD700] text-xs">AI Recruitment</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/donate"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A3C1F] font-bold px-4 py-2 rounded-md flex items-center"
            >
              <span>Donate Now</span>
            </Link>

            <div className="flex items-center space-x-3">
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
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center">
            {/* Main Navigation */}
            <nav className="flex items-center space-x-6">
              <Link href="/mission-briefing" className="text-white hover:text-[#FFD700] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Mission Briefing
              </Link>

              <Link href="/top-recruits" className="text-white hover:text-[#FFD700] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Top Recruits
              </Link>

              <Link href="/play-the-game" className="text-white hover:text-[#FFD700] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Play the Game
              </Link>

              <Link href="/chat-with-sgt-ken" className="text-white hover:text-[#FFD700] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                Ask Sgt. Ken
              </Link>
            </nav>

            {/* Right side buttons */}
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
        </div>
      </div>
    </header>
  )
}
