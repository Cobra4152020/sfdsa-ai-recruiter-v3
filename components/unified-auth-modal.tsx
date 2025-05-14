"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useAuthModal } from "@/context/auth-modal-context"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type TabType = "signin" | "signup" | "optin"

export function UnifiedAuthModal() {
  const { isOpen, modalType, userType, referralCode, closeModal } = useAuthModal()
  const [activeTab, setActiveTab] = useState<TabType>(modalType)

  // Update active tab when modalType changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(modalType)
    }
  }, [isOpen, modalType])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {activeTab === "signin" ? "Sign In" : activeTab === "signup" ? "Create Account" : "Complete Registration"}
          </h2>
          <button onClick={closeModal} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "signin"
                  ? "border-b-2 border-[#0A3C1F] text-[#0A3C1F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === "signup"
                  ? "border-b-2 border-[#0A3C1F] text-[#0A3C1F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Create Account
            </button>
            {activeTab === "optin" && (
              <button className={`py-2 px-4 text-sm font-medium border-b-2 border-[#0A3C1F] text-[#0A3C1F]`}>
                Complete Registration
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* This is a placeholder for actual authentication components */}
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p>Authentication forms will be populated here based on:</p>
            <p>
              <strong>Active Tab:</strong> {activeTab}
            </p>
            <p>
              <strong>User Type:</strong> {userType}
            </p>
            {referralCode && (
              <p>
                <strong>Referral Code:</strong> {referralCode}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
