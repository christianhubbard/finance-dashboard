import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  applyColorMode,
  COLOR_MODE_STORAGE_KEY,
  getStoredColorMode,
  getSystemColorMode,
  resolveColorMode,
} from "@/lib/color-mode";

describe("color-mode", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("applies dark mode to the document and persists it", () => {
    applyColorMode("dark");

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("dark");
  });

  it("applies light mode to the document and persists it", () => {
    document.documentElement.classList.add("dark");

    applyColorMode("light");

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("light");
  });

  it("reads a stored color mode", () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "dark");

    expect(getStoredColorMode()).toBe("dark");
  });

  it("returns null when no color mode is stored", () => {
    expect(getStoredColorMode()).toBeNull();
  });

  it("detects the system color mode", () => {
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(getSystemColorMode()).toBe("dark");
  });

  it("prefers a stored color mode over the system preference", () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, "light");
    vi.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(resolveColorMode()).toBe("light");
  });
});
