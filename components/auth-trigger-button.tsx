"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/context/auth-modal-context";

interface AuthTriggerButtonProps {
  modalType?: "signin" | "signup" | "optin";
  userType?: "recruit" | "volunteer" | "admin";
  referralCode?: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export function AuthTriggerButton({
  modalType = "signin",
  userType = "recruit",
  referralCode,
  className,
  variant = "default",
  size = "default",
  children,
}: AuthTriggerButtonProps) {
  const { openModal } = useAuthModal();

  const handleClick = () => {
    openModal(modalType, userType, referralCode);
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
}
