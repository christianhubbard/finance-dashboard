import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SpendingSummary } from "@/components/budgets/SpendingSummary";
import type { Budget } from "@/lib/types";

const budgets: Budget[] = [
  { category: "Bills", maximum: 750, spent: 375, theme: "yellow" },
  { category: "Groceries", maximum: 400, spent: 125, theme: "red" },
];

describe("SpendingSummary", () => {
  it("renders the donut chart with a segment per budget", () => {
    const { container } = render(<SpendingSummary budgets={budgets} />);
    expect(container.querySelectorAll("svg circle")).toHaveLength(3);
  });

  it("shows total spent against the total limit", () => {
    render(<SpendingSummary budgets={budgets} />);
    expect(screen.getByText("$500.00")).toBeInTheDocument();
    expect(screen.getByText("of $1,150.00 limit")).toBeInTheDocument();
  });

  it("lists each category with spent and maximum", () => {
    render(<SpendingSummary budgets={budgets} />);
    const items = within(
      screen.getByRole("list", { name: "Spending by category" }),
    ).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Bills$375.00of $750.00");
    expect(items[1]).toHaveTextContent("Groceries$125.00of $400.00");
  });
});
