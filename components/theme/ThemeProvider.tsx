"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

export type ColorTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "finance-color-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(theme: ColorTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>("light");

  // Sync before paint so the toggle never reads stale "light" after ThemeScript applied "dark".
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const initial: ColorTheme = saved === "dark" ? "dark" : "light";
      // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap client-only preference after SSR
      setThemeState(initial);
      applyThemeClass(initial);
    } catch {
      applyThemeClass("light");
    }
  }, []);

  const setTheme = useCallback((next: ColorTheme) => {
    setThemeState(next);
    applyThemeClass(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore (e.g. privacy mode)
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: ColorTheme = current === "dark" ? "light" : "dark";
      applyThemeClass(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
