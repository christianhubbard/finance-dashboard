import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetCategoryCard } from "@/components/budgets/BudgetCategoryCard";
import { BudgetsSummary } from "@/components/budgets/BudgetsSummary";
import { BudgetsView } from "@/components/budgets/BudgetsView";
import type { Budget, Transaction } from "@/lib/types";

const budgets: Budget[] = [
  {
    category: "Entertainment",
    maximum: 50,
    spent: 50,
    theme: "green",
  },
  {
    category: "Groceries",
    maximum: 400,
    spent: 125,
    theme: "red",
  },
];

const transactions: Transaction[] = [
  {
    avatar: "urban",
    name: "Urban Services Hub",
    category: "Groceries",
    date: "2022-11-27",
    amount: -65.5,
    recurring: false,
  },
  {
    avatar: "north",
    name: "Northwind Traders",
    category: "Groceries",
    date: "2022-11-21",
    amount: -88.1,
    recurring: false,
  },
  {
    avatar: "trail",
    name: "Trail Hiking Gear",
    category: "Entertainment",
    date: "2022-11-22",
    amount: -45.99,
    recurring: false,
  },
];

describe("BudgetsSummary", () => {
  it("renders aggregate spent and limit totals", () => {
    render(<BudgetsSummary budgets={budgets} />);

    expect(screen.getByRole("heading", { name: "Spending Summary" })).toBeInTheDocument();
    expect(screen.getByText("$175.00")).toBeInTheDocument();
    expect(screen.getByText("of $450.00")).toBeInTheDocument();
  });

  it("renders each category with spent and maximum in the legend", () => {
    render(<BudgetsSummary budgets={budgets} />);

    expect(screen.getByText("Entertainment")).toBeInTheDocument();
    expect(screen.getByText("$50.00 of $50.00")).toBeInTheDocument();
    expect(screen.getByText("$125.00 of $400.00")).toBeInTheDocument();
  });
});

describe("BudgetCategoryCard", () => {
  it("shows spent, remaining, and latest transactions for the category", () => {
    render(
      <BudgetCategoryCard budget={budgets[1]} transactions={transactions} />,
    );

    expect(screen.getByRole("heading", { name: "Groceries" })).toBeInTheDocument();
    expect(screen.getByText("Maximum of $400.00")).toBeInTheDocument();
    expect(screen.getByText("$125.00")).toBeInTheDocument();
    expect(screen.getByText("$275.00")).toBeInTheDocument();
    expect(screen.getByText("Urban Services Hub")).toBeInTheDocument();
    expect(screen.getByText("Northwind Traders")).toBeInTheDocument();
  });

  it("shows zero remaining when a budget is fully spent", () => {
    render(
      <BudgetCategoryCard budget={budgets[0]} transactions={transactions} />,
    );

    expect(screen.getAllByText("$0.00").length).toBeGreaterThan(0);
  });

  it("shows an empty state when there are no matching transactions", () => {
    render(
      <BudgetCategoryCard
        budget={{
          category: "Personal Care",
          maximum: 100,
          spent: 45,
          theme: "navy",
        }}
        transactions={transactions}
      />,
    );

    expect(screen.getByText("No transactions")).toBeInTheDocument();
  });

  it("links to the transactions page", () => {
    render(
      <BudgetCategoryCard budget={budgets[1]} transactions={transactions} />,
    );

    expect(screen.getByRole("link", { name: "See All" })).toHaveAttribute(
      "href",
      "/transactions",
    );
  });
});

describe("BudgetsView", () => {
  it("renders the summary and one card per budget", () => {
    render(<BudgetsView budgets={budgets} transactions={transactions} />);

    expect(screen.getByRole("heading", { name: "Spending Summary" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Entertainment" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Groceries" })).toBeInTheDocument();
  });
});
