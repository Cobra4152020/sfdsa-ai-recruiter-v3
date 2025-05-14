"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { getCookie, deleteCookie } from "cookies-next"

export function SocialLoginWelcome() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the welcome cookie exists
    const showWelcome = getCookie("showWelcome")

    if (showWelcome === "true") {
      setOpen(true)
      // Delete the cookie
      deleteCookie("showWelcome")
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const handleCompleteProfile = () => {
    setOpen(false)
    router.push("/profile/edit")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Welcome to SF Deputy Sheriff Recruitment!</DialogTitle>
          <DialogDescription className="text-center">
            Your account has been successfully created using your social media profile.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-center">
          <p className="text-sm text-gray-500">
            You can now access all recruitment resources, track your application progress, and earn badges as you
            complete different steps in the recruitment process.
          </p>
          <p className="text-sm font-medium">Would you like to complete your profile now?</p>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-center sm:space-x-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Skip for now
          </Button>
          <Button type="button" onClick={handleCompleteProfile}>
            Complete Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
