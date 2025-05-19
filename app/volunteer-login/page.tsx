"use client"

import { useEffect, useState } from "react"

export default function VolunteerLoginPage() {
  const [openRegistrationPopup, setOpenRegistrationPopup] = useState<any>(null)

  useEffect(() => {
    const loadClientModules = async () => {
      const { useRegistration } = await import("@/context/registration-context")
      const { openRegistrationPopup } = useRegistration()
      setOpenRegistrationPopup(() => openRegistrationPopup)
    }
    loadClientModules()
  }, [])

  useEffect(() => {
    if (!openRegistrationPopup) return
    // Open the registration popup automatically with volunteer settings
    openRegistrationPopup({
      userType: "volunteer",
      initialTab: "signin",
      title: "Volunteer Recruiter Login",
      description: "Sign in to access your volunteer recruiter dashboard",
    })
  }, [openRegistrationPopup])

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Volunteer Recruiter Login</h1>
        <p className="mb-6">
          The login form should appear automatically. If it doesn't, please click the button below.
        </p>
        <button
          onClick={() => openRegistrationPopup && openRegistrationPopup({ userType: "volunteer", initialTab: "signin" })}
          className="bg-[#0A3C1F] text-white py-2 px-4 rounded hover:bg-[#0A3C1F]/90"
        >
          Open Login Form
        </button>
      </div>
    </main>
  )
}
