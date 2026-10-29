import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TransactionsPanel } from "@/components/transactions/TransactionsPanel";
import type { Transaction } from "@/lib/types";

const transactions: Transaction[] = Array.from({ length: 12 }, (_, i) => ({
  avatar: "emma",
  name: i === 0 ? "Emma Richardson" : `Merchant ${String(i).padStart(2, "0")}`,
  category: i < 2 ? "Bills" : "Groceries",
  date: `2022-11-${String(28 - i).padStart(2, "0")}`,
  amount: i % 2 === 0 ? 10 + i : -(20 + i),
  recurring: false,
}));

describe("TransactionsPanel", () => {
  it("renders 10 rows on the first page", () => {
    render(<TransactionsPanel transactions={transactions} />);
    const list = screen.getByRole("list", { name: "Transactions" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(10);
    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("narrows the list by search and category", () => {
    render(<TransactionsPanel transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Search transaction"), {
      target: { value: "emma" },
    });
    expect(screen.getAllByText("Emma Richardson").length).toBeGreaterThan(0);
    expect(screen.queryByText("Merchant 01")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search transaction"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Bills" },
    });
    const list = screen.getByRole("list", { name: "Transactions" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("resets to page 1 when the search changes", () => {
    render(<TransactionsPanel transactions={transactions} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.change(screen.getByLabelText("Search transaction"), {
      target: { value: "Merchant" },
    });
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("disables Next on the last page", () => {
    render(<TransactionsPanel transactions={transactions} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
  });

  it("shows an empty state when nothing matches", () => {
    render(<TransactionsPanel transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Search transaction"), {
      target: { value: "zzzz-no-match" },
    });
    expect(screen.getByText("No transactions match your search.")).toBeInTheDocument();
  });
});
