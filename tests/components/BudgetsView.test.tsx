import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetsView } from "@/components/budgets/BudgetsView";
import type { BudgetDetail } from "@/lib/data";

const budgets: BudgetDetail[] = [
  {
    category: "Groceries",
    maximum: 400,
    spent: 125,
    remaining: 275,
    theme: "red",
    transactions: [
      {
        avatar: "urban",
        name: "Urban Services Hub",
        category: "Groceries",
        date: "2022-11-27",
        amount: -65.5,
        recurring: false,
      },
    ],
  },
  {
    category: "Bills",
    maximum: 750,
    spent: 375,
    remaining: 375,
    theme: "yellow",
    transactions: [],
  },
];

describe("BudgetsView", () => {
  it("renders the Budgets page heading and spending summary", () => {
    render(<BudgetsView budgets={budgets} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Budgets" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Spending Summary" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("$500.00")).not.toHaveLength(0);
    expect(screen.getAllByText("$1,150.00")).not.toHaveLength(0);
    expect(screen.getAllByText("$650.00")).not.toHaveLength(0);
  });

  it("shows each budget's limit, spent, and remaining values", () => {
    render(<BudgetsView budgets={budgets} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Groceries" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Limit of $400.00")).toBeInTheDocument();
    expect(screen.getAllByText("$125.00")).not.toHaveLength(0);
    expect(screen.getAllByText("$275.00")).not.toHaveLength(0);

    expect(
      screen.getByRole("heading", { level: 2, name: "Bills" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Limit of $750.00")).toBeInTheDocument();
    expect(screen.getAllByText("$375.00")).not.toHaveLength(0);
  });

  it("renders recent transactions for each budget category", () => {
    render(<BudgetsView budgets={budgets} />);

    expect(
      screen.getByRole("list", { name: "Recent Groceries transactions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Urban Services Hub")).toBeInTheDocument();
    expect(screen.getByText("Nov 27, 2022")).toBeInTheDocument();
    expect(screen.getByText("-$65.50")).toBeInTheDocument();
  });

  it("renders an empty state when a budget has no matching transactions", () => {
    render(<BudgetsView budgets={budgets} />);

    expect(
      screen.getByText("No recent transactions for this budget."),
    ).toBeInTheDocument();
  });
});
