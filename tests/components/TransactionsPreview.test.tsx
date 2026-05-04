import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionsPreview } from "@/components/overview/TransactionsPreview";
import type { Transaction } from "@/lib/types";

const transactions: Transaction[] = [
  {
    avatar: "emma",
    name: "Emma Richardson",
    category: "General",
    date: "2024-08-19",
    amount: 75.5,
    recurring: false,
  },
  {
    avatar: "savory",
    name: "Savory Bites Bistro",
    category: "Dining Out",
    date: "2024-08-19",
    amount: -55.5,
    recurring: false,
  },
];

describe("TransactionsPreview", () => {
  it("renders a heading and a labeled list", () => {
    render(<TransactionsPreview transactions={transactions} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Transactions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Recent transactions" }),
    ).toBeInTheDocument();
  });

  it("renders each transaction's name, category, and formatted date", () => {
    render(<TransactionsPreview transactions={transactions} />);
    expect(screen.getByText("Emma Richardson")).toBeInTheDocument();
    expect(screen.getByText("Savory Bites Bistro")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Dining Out")).toBeInTheDocument();
    expect(screen.getAllByText("Aug 19, 2024")).toHaveLength(2);
  });

  it("formats positive amounts with a + and negatives with a -", () => {
    render(<TransactionsPreview transactions={transactions} />);
    expect(screen.getByText("+$75.50")).toBeInTheDocument();
    expect(screen.getByText("-$55.50")).toBeInTheDocument();
  });

  it("renders nothing in the list when given no transactions", () => {
    render(<TransactionsPreview transactions={[]} />);
    const list = screen.getByRole("list", { name: "Recent transactions" });
    expect(list.children).toHaveLength(0);
  });
});
