import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetsPageContent } from "@/components/budgets/BudgetsPageContent";
import type { Budget, Transaction } from "@/lib/types";

const budgets: Budget[] = [
  { category: "Entertainment", maximum: 100, spent: 75, theme: "green" },
  { category: "Bills", maximum: 200, spent: 220, theme: "yellow" },
];

const transactions: Transaction[] = [
  {
    avatar: "arcade",
    name: "Arcade Club",
    category: "Entertainment",
    date: "2024-09-01",
    amount: -50,
    recurring: false,
  },
  {
    avatar: "cinema",
    name: "Movie Night",
    category: "Entertainment",
    date: "2024-09-02",
    amount: -25,
    recurring: false,
  },
  {
    avatar: "market",
    name: "Corner Market",
    category: "Groceries",
    date: "2024-09-03",
    amount: -10,
    recurring: false,
  },
];

describe("BudgetsPageContent", () => {
  it("renders the budgets page heading and summary totals", () => {
    render(<BudgetsPageContent budgets={budgets} transactions={transactions} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Budgets" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Limit")).toBeInTheDocument();
    expect(screen.getByText("$300.00")).toBeInTheDocument();
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getAllByText("$295.00")).not.toHaveLength(0);
    expect(screen.getByText("Remaining")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
  });

  it("shows each budget's limit, spent, remaining, and progress meter", () => {
    render(<BudgetsPageContent budgets={budgets} transactions={transactions} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Entertainment" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$100.00 limit")).toBeInTheDocument();
    expect(screen.getAllByText("$75.00")).not.toHaveLength(0);
    expect(screen.getByText("$25.00 remaining")).toBeInTheDocument();
    expect(
      screen.getByRole("meter", { name: "Entertainment budget progress" }),
    ).toHaveAttribute("aria-valuenow", "75");

    expect(
      screen.getByRole("heading", { level: 2, name: "Bills" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$200.00 limit")).toBeInTheDocument();
    expect(screen.getAllByText("$220.00")).not.toHaveLength(0);
    expect(screen.getByText("$20.00 over budget")).toBeInTheDocument();
  });

  it("shows recent transactions for the matching budget category", () => {
    render(<BudgetsPageContent budgets={budgets} transactions={transactions} />);

    const entertainmentTransactions = within(
      screen.getByRole("list", {
        name: "Entertainment recent transactions",
      }),
    ).getAllByRole("listitem");

    expect(entertainmentTransactions).toHaveLength(2);
    expect(
      within(entertainmentTransactions[0]).getByText("Movie Night"),
    ).toBeInTheDocument();
    expect(
      within(entertainmentTransactions[0]).getByText("Sep 2, 2024"),
    ).toBeInTheDocument();
    expect(
      within(entertainmentTransactions[0]).getByText("-$25.00"),
    ).toBeInTheDocument();
    expect(
      within(entertainmentTransactions[1]).getByText("Arcade Club"),
    ).toBeInTheDocument();
  });

  it("shows an empty state for categories without transactions", () => {
    render(<BudgetsPageContent budgets={budgets} transactions={transactions} />);

    expect(screen.getByText("No recent transactions")).toBeInTheDocument();
  });
});
