import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/shell/AppShell";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

describe("AppShell", () => {
  it("renders its children in the main content area", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders the sidebar navigation", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>,
    );
    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });
});
