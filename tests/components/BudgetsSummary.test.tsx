import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BudgetsSummary } from "@/components/budgets/BudgetsSummary";
import type { Budget } from "@/lib/types";

const budgets: Budget[] = [
  { category: "Entertainment", maximum: 100, spent: 50, theme: "green" },
  { category: "Dining Out", maximum: 200, spent: 75.5, theme: "yellow" },
  { category: "Bills", maximum: 300, spent: 0, theme: "cyan" },
];

describe("BudgetsSummary", () => {
  it("renders the section heading", () => {
    render(<BudgetsSummary budgets={budgets} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Spending Summary" }),
    ).toBeInTheDocument();
  });

  it("computes and displays total spent and total budget limit", () => {
    render(<BudgetsSummary budgets={budgets} />);
    expect(screen.getByText("$125.50")).toBeInTheDocument();
    expect(screen.getByText("$600.00")).toBeInTheDocument();
  });

  it("renders the donut chart", () => {
    const { container } = render(<BudgetsSummary budgets={budgets} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("width")).toBe("240");
  });

  it("shows zero totals when given no budgets", () => {
    render(<BudgetsSummary budgets={[]} />);
    expect(screen.getAllByText("$0.00")).toHaveLength(2);
  });
});
