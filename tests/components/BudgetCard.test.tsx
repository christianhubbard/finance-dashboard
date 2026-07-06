import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import type { Budget, Transaction } from "@/lib/types";

const budget: Budget = {
  category: "Dining Out",
  maximum: 300,
  spent: 120,
  theme: "cyan",
};

const latestSpending: Transaction[] = [
  {
    avatar: "savory",
    name: "Savory Eats",
    category: "Dining Out",
    date: "2022-11-26",
    amount: -17.5,
    recurring: false,
  },
];

describe("BudgetCard", () => {
  it("renders the category, maximum, spent, and remaining amounts", () => {
    render(<BudgetCard budget={budget} latestSpending={latestSpending} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Dining Out" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Maximum of $300.00")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
    expect(screen.getByText("$180.00")).toBeInTheDocument();
  });

  it("exposes a progressbar reflecting spend against the maximum", () => {
    render(<BudgetCard budget={budget} latestSpending={latestSpending} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "120");
    expect(bar).toHaveAttribute("aria-valuemax", "300");
  });

  it("caps the progressbar and clamps remaining at zero when overspent", () => {
    render(
      <BudgetCard
        budget={{ ...budget, spent: 450 }}
        latestSpending={[]}
      />,
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "300");
    expect(bar).toHaveStyle({ width: "100%" });
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("renders latest spending entries", () => {
    render(<BudgetCard budget={budget} latestSpending={latestSpending} />);
    expect(screen.getByText("Latest Spending")).toBeInTheDocument();
    expect(screen.getByText("Savory Eats")).toBeInTheDocument();
    expect(screen.getByText("-$17.50")).toBeInTheDocument();
  });

  it("omits the latest spending section when there are no entries", () => {
    render(<BudgetCard budget={budget} latestSpending={[]} />);
    expect(screen.queryByText("Latest Spending")).not.toBeInTheDocument();
  });
});
