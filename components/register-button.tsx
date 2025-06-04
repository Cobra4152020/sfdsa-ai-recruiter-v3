"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useRegistration } from "@/context/registration-context";

interface RegisterButtonProps extends ButtonProps {
  applyNow?: boolean;
  referralCode?: string;
  userType?: "recruit" | "volunteer" | "admin";
  initialTab?: "signin" | "signup" | "optin";
  callbackUrl?: string;
  title?: string;
  description?: string;
}

export function RegisterButton({
  children,
  applyNow = false,
  referralCode,
  userType = "recruit",
  initialTab = "signin",
  callbackUrl,
  title,
  description,
  ...props
}: RegisterButtonProps) {
  const { openRegistrationPopup } = useRegistration();

  const handleClick = () => {
    openRegistrationPopup({
      applying: applyNow,
      referral: referralCode,
      userType,
      initialTab,
      callbackUrl,
      title,
      description,
    });
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children ||
        (applyNow
          ? "Apply Now"
          : userType === "volunteer"
            ? "Volunteer Sign Up"
            : "Register")}
    </Button>
  );
}
