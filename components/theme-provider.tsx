"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isBrowser } from "@/lib/utils";

export function ThemeProvider({
  children,
  ...props
}: { children: React.ReactNode } & Record<string, unknown>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Return a placeholder during server-side rendering
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`${className} border border-gray-300 dark:border-[#FFD700]/30`}
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
      className={`${className} border border-gray-300 dark:border-[#FFD700]/30 hover:bg-gray-100 dark:hover:bg-[#FFD700]/10 transition-all duration-200`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[#FFD700]" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const prefersDark = React.useMemo(() => {
    if (!isBrowser()) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  const isDark = theme === "dark" || (theme === "system" && prefersDark);

  React.useEffect(() => {
    if (!isBrowser()) return;

    const root = document.documentElement;
    const systemTheme = prefersDark ? "dark" : "light";
    const newTheme = theme === "system" ? systemTheme : theme || systemTheme;

    // Only update if the class is different
    if (!root.classList.contains(newTheme)) {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, prefersDark]);

  return {
    theme,
    setTheme,
    isDark,
  };
}
