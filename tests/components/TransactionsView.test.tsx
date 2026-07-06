import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import type { Transaction } from "@/lib/types";

const tx = (
  name: string,
  date: string,
  amount: number,
  category: string,
): Transaction => ({
  avatar: "x",
  name,
  category,
  date,
  amount,
  recurring: false,
});

const transactions = [
  ...Array.from({ length: 9 }, (_, i) =>
    tx(`Store ${i + 1}`, `2024-01-0${i + 1}`, -(i + 1), "Groceries"),
  ),
  tx("Cinema Club", "2024-02-01", -12, "Entertainment"),
];

function getList() {
  return screen.getByRole("list", { name: "Transactions" });
}

describe("TransactionsView", () => {
  it("renders the first page of 8 transactions, latest first", () => {
    render(<TransactionsView transactions={transactions} />);
    const items = within(getList()).getAllByRole("listitem");
    expect(items).toHaveLength(8);
    expect(items[0]).toHaveTextContent("Cinema Club");
  });

  it("moves to the next page", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    const items = within(getList()).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("filters by search text", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByPlaceholderText("Search transaction"), {
      target: { value: "cinema" },
    });
    const items = within(getList()).getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Cinema Club");
  });

  it("filters by category", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Entertainment" },
    });
    const items = within(getList()).getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Cinema Club");
  });

  it("re-sorts when the sort option changes", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "Highest" },
    });
    const items = within(getList()).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Store 1");
  });

  it("shows an empty state when nothing matches", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByPlaceholderText("Search transaction"), {
      target: { value: "zzz" },
    });
    expect(
      screen.getByText("No transactions match your search."),
    ).toBeInTheDocument();
  });
});
