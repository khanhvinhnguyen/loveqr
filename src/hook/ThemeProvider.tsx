"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
  systemTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  }

  const updateResolvedTheme = (currentTheme: Theme) => {
    if (currentTheme === "system") {
      setResolvedTheme(getSystemTheme())
    } else {
      setResolvedTheme(currentTheme)
    }
  }

  const applyTheme = (themeToApply: "light" | "dark") => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(themeToApply)
    }
  }

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    updateResolvedTheme(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme)
    }
  }

  useEffect(() => {
    const savedTheme = (typeof window !== "undefined" ? localStorage.getItem("theme") : null) as Theme
    const initialTheme = savedTheme || "system"
    setTheme(initialTheme)
    updateResolvedTheme(initialTheme)
    setMounted(true)
  }, [updateResolvedTheme])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = getSystemTheme()
        setResolvedTheme(systemTheme)
        applyTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  useEffect(() => {
    if (mounted) {
      applyTheme(resolvedTheme)
    }
  }, [resolvedTheme, mounted])

  const value = {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
    systemTheme: getSystemTheme(),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
