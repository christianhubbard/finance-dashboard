export type ColorMode = "light" | "dark";

export const COLOR_MODE_STORAGE_KEY = "finance-color-mode";

export function applyColorMode(mode: ColorMode): void {
  document.documentElement.classList.toggle("dark", mode === "dark");
  try {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore (e.g. privacy mode)
  }
}

export function getStoredColorMode(): ColorMode | null {
  try {
    const value = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (value === "light" || value === "dark") {
      return value;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getSystemColorMode(): ColorMode {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function resolveColorMode(): ColorMode {
  return getStoredColorMode() ?? getSystemColorMode();
}

export const colorModeInitScript = `(function(){try{var m=localStorage.getItem("${COLOR_MODE_STORAGE_KEY}");if(m==="dark"){document.documentElement.classList.add("dark");}else if(m==="light"){document.documentElement.classList.remove("dark");}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark");}}catch(e){}})();`;
