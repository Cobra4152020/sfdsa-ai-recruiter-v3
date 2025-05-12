"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarDays, Award, Users, User, LayoutDashboard, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    checkUser()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Daily Briefing",
      href: "/daily-briefing",
      icon: CalendarDays,
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: Award,
    },
    {
      name: "Refer",
      href: "/refer",
      icon: Users,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SFDSA</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <Icon className="mr-1 h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </>
          )}

          <button
            className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            onClick={toggleMenu}
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background">
          <div className="relative z-20 grid gap-6 p-4 rounded-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center p-2 w-full rounded-md text-foreground hover:bg-accent",
                      pathname === item.href && "bg-accent",
                    )}
                    onClick={closeMenu}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
