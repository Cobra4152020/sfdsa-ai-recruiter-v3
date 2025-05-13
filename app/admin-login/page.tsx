"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginBypass() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to admin dashboard
    router.push("/admin/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Redirecting to Admin Dashboard...</h1>
        <p className="text-red-600 font-bold">⚠️ WARNING: Authentication Bypassed ⚠️</p>
        <p className="text-gray-600 max-w-md mt-2">
          This is a development configuration. Authentication has been removed for testing purposes. Do not use in
          production environments.
        </p>
      </div>
    </div>
  )
}
