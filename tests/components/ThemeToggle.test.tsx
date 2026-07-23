import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function ThemeLabel() {
  const { theme } = useTheme();
  return <span data-testid="theme-label">{theme}</span>;
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light and toggles to dark", async () => {
    render(
      <ThemeProvider>
        <ThemeLabel />
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-label")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await act(async () => {
      screen.getByRole("button", { name: /switch to dark mode/i }).click();
    });

    expect(screen.getByTestId("theme-label")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("finance-color-theme")).toBe("dark");
  });

  it("restores a saved dark preference", async () => {
    localStorage.setItem("finance-color-theme", "dark");

    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeLabel />
        </ThemeProvider>,
      );
    });

    expect(screen.getByTestId("theme-label")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
