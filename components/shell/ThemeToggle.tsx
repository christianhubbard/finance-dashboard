"use client";

import { Moon, Sun } from "lucide-react";
import { useColorMode } from "./ColorModeProvider";

type ThemeToggleProps = {
  collapsed: boolean;
};

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { mode, toggleMode } = useColorMode();
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={toggleMode}
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
