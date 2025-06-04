"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type ModalType = "signin" | "signup" | "optin";
type UserType = "recruit" | "volunteer" | "admin";

interface AuthModalContextType {
  isOpen: boolean;
  modalType: ModalType;
  userType: UserType;
  referralCode?: string;
  openModal: (
    type: ModalType,
    userType: UserType,
    referralCode?: string,
  ) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("signin");
  const [userType, setUserType] = useState<UserType>("recruit");
  const [referralCode, setReferralCode] = useState<string | undefined>(
    undefined,
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = (
    type: ModalType,
    userType: UserType,
    referralCode?: string,
  ) => {
    setModalType(type);
    setUserType(userType);
    setReferralCode(referralCode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    modalType,
    userType,
    referralCode,
    openModal,
    closeModal,
  };

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return (
    <AuthModalContext.Provider value={value}>
      <div className="min-h-screen">{children}</div>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    console.warn("useAuthModal must be used within an AuthModalProvider");
    return {
      isOpen: false,
      modalType: "signin" as ModalType,
      userType: "recruit" as UserType,
      openModal: () => {},
      closeModal: () => {},
    };
  }
  return context;
}
