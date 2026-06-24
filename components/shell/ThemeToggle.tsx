"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyColorMode,
  resolveColorMode,
  type ColorMode,
} from "@/lib/color-mode";

type ThemeToggleProps = {
  collapsed: boolean;
};

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with client-only preference after SSR
    setMode(resolveColorMode());
  }, []);

  const toggle = () => {
    const next: ColorMode = mode === "light" ? "dark" : "light";
    applyColorMode(next);
    setMode(next);
  };

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-preset-4 font-medium text-grey-300 transition-colors hover:bg-white/5 hover:text-white ${
        collapsed ? "justify-center px-2" : ""
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={collapsed ? (isDark ? "Light mode" : "Dark mode") : undefined}
    >
      {isDark ? (
        <Sun className="size-5 shrink-0" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
      )}
      {!collapsed ? (
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      ) : null}
    </button>
  );
}
