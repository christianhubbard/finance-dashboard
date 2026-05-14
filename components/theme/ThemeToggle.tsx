"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- avoid SSR/client theme mismatch flash
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-transparent"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-grey-300/40 text-grey-900 transition-colors hover:bg-grey-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900 dark:border-white/15 dark:text-grey-100 dark:hover:bg-white/10 dark:focus-visible:outline-grey-100"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="size-5" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="size-5" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
