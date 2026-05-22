import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BudgetsView } from "@/components/budgets/BudgetsView";
import type { Budget, Transaction } from "@/lib/types";

const budgets: Budget[] = [
  {
    category: "Groceries",
    maximum: 400,
    spent: 125,
    theme: "red",
  },
  {
    category: "Dining Out",
    maximum: 300,
    spent: 120,
    theme: "cyan",
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
    avatar: "emma",
    name: "Emma Richardson",
    category: "General",
    date: "2022-11-28",
    amount: -100.25,
    recurring: true,
  },
  {
    avatar: "savory",
    name: "Savory Eats",
    category: "Dining Out",
    date: "2022-11-26",
    amount: -17.5,
    recurring: false,
  },
];

describe("BudgetsView", () => {
  it("renders a budgets heading and spending summary", () => {
    render(<BudgetsView budgets={budgets} transactions={transactions} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Budgets" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Spending Summary" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$245.00")).toBeInTheDocument();
    expect(screen.getByText("of $700.00")).toBeInTheDocument();
  });

  it("shows limit, spent, and remaining values for each budget category", () => {
    render(<BudgetsView budgets={budgets} transactions={transactions} />);

    const groceries = screen
      .getByRole("heading", { level: 2, name: "Groceries" })
      .closest("section");
    expect(groceries).not.toBeNull();

    const groceriesSection = within(groceries as HTMLElement);
    expect(groceriesSection.getByText("Maximum of $400.00")).toBeInTheDocument();
    expect(groceriesSection.getByText("$275.00 remaining")).toBeInTheDocument();
    expect(groceriesSection.getByText("Limit")).toBeInTheDocument();
    expect(groceriesSection.getByText("Spent")).toBeInTheDocument();
    expect(groceriesSection.getByText("Remaining")).toBeInTheDocument();
    expect(groceriesSection.getAllByText("$400.00")).toHaveLength(1);
    expect(groceriesSection.getAllByText("$125.00")).toHaveLength(1);
    expect(groceriesSection.getAllByText("$275.00")).toHaveLength(1);
  });

  it("groups recent transactions under their matching budget category", () => {
    render(<BudgetsView budgets={budgets} transactions={transactions} />);

    const groceriesList = screen.getByRole("list", {
      name: "Groceries recent transactions",
    });
    const diningList = screen.getByRole("list", {
      name: "Dining Out recent transactions",
    });

    expect(within(groceriesList).getByText("Urban Services Hub")).toBeInTheDocument();
    expect(within(groceriesList).getByText("Northwind Traders")).toBeInTheDocument();
    expect(within(groceriesList).queryByText("Savory Eats")).not.toBeInTheDocument();
    expect(within(diningList).getByText("Savory Eats")).toBeInTheDocument();
    expect(screen.queryByText("Emma Richardson")).not.toBeInTheDocument();
  });
});
