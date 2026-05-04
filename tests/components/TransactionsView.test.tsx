import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import type { Transaction } from "@/lib/types";

const transactions: Transaction[] = [
  {
    avatar: "emma",
    name: "Emma Richardson",
    category: "General",
    date: "2024-08-19",
    amount: -75.5,
    recurring: false,
  },
  {
    avatar: "savory",
    name: "Savory Bites Bistro",
    category: "Dining Out",
    date: "2024-08-20",
    amount: -55.5,
    recurring: false,
  },
  {
    avatar: "ledger",
    name: "Urban Ledger",
    category: "General",
    date: "2024-08-21",
    amount: 1200,
    recurring: false,
  },
];

function renderedTransactionNames(): string[] {
  return within(screen.getByRole("list", { name: "Transactions" }))
    .getAllByRole("listitem")
    .map((item) => {
      const text = item.textContent ?? "";
      const transaction = transactions.find(({ name }) => text.includes(name));
      return transaction?.name ?? "";
    });
}

describe("TransactionsView", () => {
  it("renders all transaction details by default", () => {
    render(<TransactionsView transactions={transactions} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "All Transactions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Showing 3 of 3")).toBeInTheDocument();
    expect(screen.getByText("Emma Richardson")).toBeInTheDocument();
    expect(screen.getAllByText("Dining Out").length).toBeGreaterThan(0);
    expect(screen.getByText("Aug 21, 2024")).toBeInTheDocument();
    expect(screen.getByText("+$1,200.00")).toBeInTheDocument();
  });

  it("searches transactions by merchant name", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search by merchant name" }),
      { target: { value: "savory" } },
    );

    expect(screen.getByText("Showing 1 of 3")).toBeInTheDocument();
    expect(screen.getByText("Savory Bites Bistro")).toBeInTheDocument();
    expect(screen.queryByText("Emma Richardson")).not.toBeInTheDocument();
  });

  it("filters transactions by category", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(
      screen.getByRole("combobox", { name: "Filter by category" }),
      { target: { value: "Dining Out" } },
    );

    expect(screen.getByText("Showing 1 of 3")).toBeInTheDocument();
    expect(screen.getByText("Savory Bites Bistro")).toBeInTheDocument();
    expect(screen.queryByText("Urban Ledger")).not.toBeInTheDocument();
  });

  it("sorts transactions using the selected option", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(
      screen.getByRole("combobox", { name: "Sort transactions" }),
      { target: { value: "az" } },
    );

    expect(renderedTransactionNames()).toEqual([
      "Emma Richardson",
      "Savory Bites Bistro",
      "Urban Ledger",
    ]);
  });

  it("shows an empty state when filters match no transactions", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search by merchant name" }),
      { target: { value: "missing merchant" } },
    );

    expect(screen.getByText("Showing 0 of 3")).toBeInTheDocument();
    expect(
      screen.getByText("No transactions match your filters."),
    ).toBeInTheDocument();
  });
});
