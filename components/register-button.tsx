"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useRegistration } from "@/context/registration-context"

interface RegisterButtonProps extends ButtonProps {
  applyNow?: boolean
  referralCode?: string
}

export function RegisterButton({ children, applyNow = false, referralCode, ...props }: RegisterButtonProps) {
  const { openRegistrationPopup } = useRegistration()

  const handleClick = () => {
    openRegistrationPopup({
      applying: applyNow,
      referral: referralCode,
    })
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children || (applyNow ? "Apply Now" : "Register")}
    </Button>
  )
}
