"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { COLOR_MODE_STORAGE_KEY } from "@/lib/color-mode";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore (e.g. privacy mode)
    }
  };

  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:text-muted"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}    >
      <Icon className="size-5" strokeWidth={2} aria-hidden />
    </button>
  );
}
