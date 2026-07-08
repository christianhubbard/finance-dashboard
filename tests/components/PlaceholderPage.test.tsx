import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

describe("PlaceholderPage", () => {
  it("renders the title as a level-1 heading", () => {
    render(<PlaceholderPage title="Budgets" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Budgets" }),
    ).toBeInTheDocument();
  });

  it("renders the placeholder body copy", () => {
    render(<PlaceholderPage title="Budgets" />);
    expect(
      screen.getByText(/This section is a placeholder for the MVP/i),
    ).toBeInTheDocument();
  });

  it("references the finance data file in the body", () => {
    render(<PlaceholderPage title="Budgets" />);
    expect(screen.getByText("data/finance.json")).toBeInTheDocument();
  });
});
