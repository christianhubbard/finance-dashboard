import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import type { Transaction } from "@/lib/types";

const make = (
  name: string,
  date: string,
  amount: number,
  category = "General",
): Transaction => ({
  avatar: "emma",
  name,
  category,
  date,
  amount,
  recurring: false,
});

const transactions: Transaction[] = [
  make("Emma Richardson", "2022-11-28", -100.25),
  make("Spark Electric", "2022-11-24", -250, "Bills"),
  make("Urban Ledger", "2022-11-23", 1200),
  ...Array.from({ length: 9 }, (_, i) =>
    make(`Shop ${i + 1}`, `2022-11-${10 + i}`, -(i + 1), "Shopping"),
  ),
];

const rows = () =>
  within(screen.getByRole("list", { name: "Transactions" })).getAllByRole(
    "listitem",
  );

describe("TransactionsView", () => {
  it("shows the first page in Latest order with column headers", () => {
    render(<TransactionsView transactions={transactions} />);

    expect(screen.getByText("Recipient / Sender")).toBeInTheDocument();
    expect(screen.getByText("Transaction Date")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort by")).toHaveValue("Latest");
    expect(screen.getByLabelText("Category")).toHaveValue("All Transactions");

    expect(rows()).toHaveLength(10);
    expect(rows()[0]).toHaveTextContent("Emma Richardson");
    expect(rows()[0]).toHaveTextContent("Nov 28, 2022");
  });

  it("colors income green with a + and expenses dark grey with a -", () => {
    render(<TransactionsView transactions={transactions} />);

    expect(screen.getByText("+$1,200.00")).toHaveClass("text-secondary-green");
    expect(screen.getByText("-$250.00")).toHaveClass("text-grey-900");
  });

  it("disables Prev on the first page and Next on the last page", () => {
    render(<TransactionsView transactions={transactions} />);

    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(rows().map((row) => row.textContent)).toEqual([
      expect.stringContaining("Shop 2"),
      expect.stringContaining("Shop 1"),
    ]);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("filters by the selected category", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Bills" },
    });

    expect(rows()).toHaveLength(1);
    expect(rows()[0]).toHaveTextContent("Spark Electric");
  });

  it("sorts by signed amount for Highest", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "Highest" },
    });

    expect(rows()[0]).toHaveTextContent("Urban Ledger");
  });

  it("resets to page 1 when the search changes", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    fireEvent.change(screen.getByPlaceholderText("Search transaction"), {
      target: { value: "shop" },
    });

    expect(rows()).toHaveLength(9);
    expect(rows()[0]).toHaveTextContent("Shop 9");
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.queryByRole("button", { name: "Page 2" }),
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", () => {
    render(<TransactionsView transactions={transactions} />);

    fireEvent.change(screen.getByPlaceholderText("Search transaction"), {
      target: { value: "no such merchant" },
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "No transactions match your search.",
    );
    expect(
      screen.queryByRole("list", { name: "Transactions" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  });
});
