"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApply } from "@/context/apply-context"

export default function LoginPage() {
  const router = useRouter()
  const { openApplyPopup } = useApply()

  useEffect(() => {
    // Open the apply popup with the signin tab active
    openApplyPopup()

    // Redirect to home after a short delay
    const timeout = setTimeout(() => {
      router.push("/")
    }, 100)

    return () => clearTimeout(timeout)
  }, [openApplyPopup, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  )
}
