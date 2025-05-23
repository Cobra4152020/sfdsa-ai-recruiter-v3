'use client'

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase"
import { UserContext } from "@/contexts/user-context"
import { Spinner } from "@/components/ui/spinner"

interface RootLayoutClientProps {
  children: React.ReactNode
}

export default function RootLayoutClient({
  children,
}: RootLayoutClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
        }
      } catch (error) {
        console.error("Error checking user session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [supabase.auth])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
} 