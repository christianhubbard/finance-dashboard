import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BudgetCategoryCard } from "@/components/budgets/BudgetCategoryCard";
import type { Budget, Transaction } from "@/lib/types";

const budget: Budget = {
  category: "Dining Out",
  maximum: 300,
  spent: 120,
  theme: "cyan",
};

const transactions: Transaction[] = [
  {
    avatar: "savory",
    name: "Savory Bites Bistro",
    category: "Dining Out",
    date: "2024-08-19",
    amount: -55.5,
    recurring: false,
  },
];

describe("BudgetCategoryCard", () => {
  it("renders the category heading", () => {
    render(<BudgetCategoryCard budget={budget} transactions={transactions} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Dining Out" }),
    ).toBeInTheDocument();
  });

  it("shows limit, spent, and remaining values", () => {
    render(<BudgetCategoryCard budget={budget} transactions={transactions} />);
    const term = (label: string) =>
      screen.getByText(label, { selector: "dt" }).nextElementSibling;
    expect(term("Limit")).toHaveTextContent("$300.00");
    expect(term("Spent")).toHaveTextContent("$120.00");
    expect(term("Remaining")).toHaveTextContent("$180.00");
  });

  it("clamps remaining to zero and the bar to 100% when over budget", () => {
    render(
      <BudgetCategoryCard
        budget={{ ...budget, spent: 400 }}
        transactions={[]}
      />,
    );
    expect(
      screen.getByText("Remaining", { selector: "dt" }).nextElementSibling,
    ).toHaveTextContent("$0.00");
    const bar = screen.getByRole("progressbar").firstElementChild as HTMLElement;
    expect(bar.style.width).toBe("100%");
  });

  it("lists the provided transactions under Latest Spending", () => {
    render(<BudgetCategoryCard budget={budget} transactions={transactions} />);
    const list = screen.getByRole("list", {
      name: "Latest Dining Out transactions",
    });
    expect(within(list).getByText("Savory Bites Bistro")).toBeInTheDocument();
    expect(within(list).getByText("-$55.50")).toBeInTheDocument();
    expect(within(list).getByText("Aug 19, 2024")).toBeInTheDocument();
  });

  it("shows an empty state when there are no transactions", () => {
    render(<BudgetCategoryCard budget={budget} transactions={[]} />);
    expect(
      screen.getByText("No recent transactions in this category."),
    ).toBeInTheDocument();
  });
});
