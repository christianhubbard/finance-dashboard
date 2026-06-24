"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyColorMode,
  resolveColorMode,
  type ColorMode,
} from "@/lib/color-mode";

type ColorModeContextValue = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>("light");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap client-only preference after SSR
    setModeState(resolveColorMode());
  }, []);

  useEffect(() => {
    applyColorMode(mode);
  }, [mode]);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  );

  return (
    <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}
