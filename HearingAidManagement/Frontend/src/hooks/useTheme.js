import { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState("light"); // default to light until mounted

  // Load saved or system theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme class & save to storage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Watch for OS theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // toggle theme
  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggle };
}