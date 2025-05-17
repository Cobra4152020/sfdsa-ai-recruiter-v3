"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

type Theme = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Force light theme
  const value: ThemeProviderState = {
    theme: "light",
    setTheme: () => null, // No-op since we're forcing light theme
    toggleTheme: () => null, // No-op since we're forcing light theme
  }

  // Apply light theme to document
  if (typeof window !== "undefined") {
    const root = window.document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={true}
      aria-label="Theme is locked to light mode"
    >
      <Sun className="h-5 w-5 text-gray-400" />
      <span className="sr-only">Theme is locked to light mode</span>
    </Button>
  )
}
