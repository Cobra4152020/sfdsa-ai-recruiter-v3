"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useAuthModal } from "@/context/auth-modal-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export function UnifiedAuthModal() {
  const { isOpen, modalType, userType, closeModal } = useAuthModal()
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "optin">("signin")

  useEffect(() => {
    if (isOpen) {
      setActiveTab(modalType)
    }
  }, [isOpen, modalType])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>
            {activeTab === "signin" ? "Sign In" : activeTab === "signup" ? "Create Account" : "Apply Now"}
          </DialogTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={closeModal}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sign in to your account using your email and password.</p>
              </div>
              {/* Sign in form would go here */}
              <Button className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">Sign In</Button>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Create a new account to join our community.</p>
              </div>
              {/* Sign up form would go here */}
              <Button className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">Create Account</Button>
            </div>
          </TabsContent>
          <TabsContent value="optin">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Apply to become a Deputy Sheriff with the San Francisco Sheriff's Department.
                </p>
              </div>
              {/* Opt-in form would go here */}
              <Button className="w-full bg-[#0A3C1F] hover:bg-[#0A3C1F]/90">Submit Application</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
