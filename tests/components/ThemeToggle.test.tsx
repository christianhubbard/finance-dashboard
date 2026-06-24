import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ColorModeProvider } from "@/components/shell/ColorModeProvider";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { COLOR_MODE_STORAGE_KEY } from "@/lib/color-mode";

function renderToggle(collapsed = false) {
  return render(
    <ColorModeProvider>
      <ThemeToggle collapsed={collapsed} />
    </ColorModeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("renders a dark mode action when the app is in light mode", () => {
    renderToggle(false);

    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("toggles to dark mode and updates the label", () => {
    renderToggle(false);

    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("dark");
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Light mode")).toBeInTheDocument();
  });

  it("hides the label when the sidebar is collapsed", () => {
    renderToggle(true);

    expect(screen.queryByText("Dark mode")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });
});
