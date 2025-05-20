"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the user type
export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  userType?: string
  participation_count?: number
  has_applied?: boolean
}

// Define the context type
interface UserContextType {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  isLoggedIn: boolean
  setCurrentUser: (user: User | null) => void
  login: (user: User) => void
  signOut: () => Promise<void>
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  setCurrentUser: () => {},
  login: () => {},
  signOut: async () => {},
})

// Hook to use the user context
export const useUser = () => useContext(UserContext)

// Add the missing export as an alias to maintain backward compatibility
export const useUserContext = useUser

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = (user: User) => {
    setCurrentUser(user)
  }

  const signOut = async () => {
    setCurrentUser(null)
    router.push("/")
  }

  return (
    <UserContext.Provider value={{ currentUser, isLoading, error, isLoggedIn: !!currentUser, setCurrentUser, login, signOut }}>
      {children}
    </UserContext.Provider>
  )
}
