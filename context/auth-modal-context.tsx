"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type ModalType = "signin" | "signup" | "optin"
type UserType = "recruit" | "volunteer" | "admin"

interface AuthModalContextType {
  isOpen: boolean
  modalType: ModalType
  userType: UserType
  referralCode?: string
  openModal: (type: ModalType, userType: UserType, referralCode?: string) => void
  closeModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>("signin")
  const [userType, setUserType] = useState<UserType>("recruit")
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined)

  const openModal = (type: ModalType, userType: UserType, referralCode?: string) => {
    setModalType(type)
    setUserType(userType)
    setReferralCode(referralCode)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        modalType,
        userType,
        referralCode,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    console.warn("useAuthModal must be used within an AuthModalProvider")
    return {
      isOpen: false,
      modalType: "signin" as ModalType,
      userType: "recruit" as UserType,
      openModal: () => {},
      closeModal: () => {},
    }
  }
  return context
}
