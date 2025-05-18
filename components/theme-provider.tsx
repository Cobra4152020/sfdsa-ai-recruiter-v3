"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClientOnly } from "@/hooks/use-client-only"
import { isBrowser } from "@/lib/utils"

export function ThemeProvider({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="outline"
      size="icon"
      className={className}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function useTheme() {
  const { theme, setTheme } = useNextTheme()
  const prefersDark = useClientOnly(() => {
    if (!isBrowser()) return false
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }, false)

  const isDark = theme === "dark" || (theme === "system" && prefersDark)

  React.useEffect(() => {
    if (!isBrowser()) return

    const root = document.documentElement
    const systemTheme = prefersDark ? "dark" : "light"
    
    if (theme === "system") {
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
    } else {
      root.classList.remove("light", "dark")
      root.classList.add(theme || "")
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light"
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, prefersDark])

  return {
    theme,
    setTheme,
    isDark,
  }
}
