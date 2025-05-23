"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useAuthModal } from "@/context/auth-modal-context"
import { LogOut, User, Settings, Award, ChevronDown } from "lucide-react"

export function UserAuthStatus() {
  const { user, signOut } = useAuth()
  const { openModal } = useAuthModal()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="hidden md:flex flex-col gap-1">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => openModal("signin", "recruit")} className="text-sm">
          Sign In
        </Button>
        <Button onClick={() => openModal("signup", "recruit")} className="text-sm">
          Sign Up
        </Button>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
    router.push("/")
  }

  const navigateTo = (path: string) => {
    setIsMenuOpen(false)
    router.push(path)
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "U"
  const displayName = user.name || user.email || "User"
  const userRole = user.userType || "recruit"

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-1 hover:bg-gray-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs text-gray-500 capitalize">{userRole}</span>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{displayName}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigateTo("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/profile/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {userRole === "admin" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigateTo("/admin/dashboard")}>
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </>
          )}
          {userRole === "volunteer" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigateTo("/volunteer-dashboard")}>
                <span>Volunteer Dashboard</span>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
