import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TransactionsPanel } from "@/components/transactions/TransactionsPanel";
import type { Transaction } from "@/lib/types";

const tx = (
  overrides: Partial<Transaction> & Pick<Transaction, "name" | "date" | "amount">,
): Transaction => ({
  avatar: "emma",
  category: "General",
  recurring: false,
  ...overrides,
});

const fixtures: Transaction[] = [
  tx({ name: "Emma Richardson", date: "2022-11-28", amount: -100.25, category: "General" }),
  tx({ name: "Urban Ledger", date: "2022-11-23", amount: 1200, category: "General" }),
  tx({ name: "Spark Electric", date: "2022-11-24", amount: -250, category: "Bills" }),
  tx({ name: "Ember Coffee Co.", date: "2022-11-20", amount: -6.5, category: "Dining Out" }),
  tx({ name: "Savory Eats", date: "2022-11-26", amount: -17.5, category: "Dining Out" }),
  tx({ name: "Floral Boutique", date: "2022-11-25", amount: -35, category: "Personal Care" }),
  tx({ name: "Northwind Traders", date: "2022-11-21", amount: -88.1, category: "Groceries" }),
  tx({ name: "Trail Hiking Gear", date: "2022-11-22", amount: -45.99, category: "Entertainment" }),
  tx({ name: "Aqua Utilities", date: "2022-11-14", amount: -54.2, category: "Bills" }),
  tx({ name: "Payroll Deposit", date: "2022-11-10", amount: 1850, category: "General" }),
  tx({ name: "Pixel Market", date: "2022-11-16", amount: -89.99, category: "Shopping" }),
  tx({ name: "Green Leaf Transit", date: "2022-11-19", amount: -42, category: "Transportation" }),
];

function getTransactionNames() {
  const list = screen.getByRole("list", { name: "Transactions" });
  return within(list)
    .getAllByRole("listitem")
    .map((item) => item.querySelector("p")?.textContent ?? "");
}

describe("TransactionsPanel", () => {
  it("renders the first page of transactions sorted by latest", () => {
    render(<TransactionsPanel transactions={fixtures} />);
    const names = getTransactionNames();
    expect(names).toHaveLength(10);
    expect(names[0]).toBe("Emma Richardson");
    expect(names).not.toContain("Payroll Deposit");
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
  });

  it("filters by merchant search and resets to page 1", () => {
    render(<TransactionsPanel transactions={fixtures} />);
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    fireEvent.change(screen.getByLabelText("Search transaction"), {
      target: { value: "emma" },
    });

    expect(getTransactionNames()).toEqual(["Emma Richardson"]);
    expect(screen.queryByRole("button", { name: "Page 2" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("filters by category", () => {
    render(<TransactionsPanel transactions={fixtures} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
      target: { value: "Bills" },
    });
    expect(getTransactionNames()).toEqual(["Spark Electric", "Aqua Utilities"]);
  });

  it("sorts by highest signed amount", () => {
    render(<TransactionsPanel transactions={fixtures} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Sort by" }), {
      target: { value: "highest" },
    });
    expect(getTransactionNames()[0]).toBe("Payroll Deposit");
  });

  it("moves between pages with numbered buttons and Next", () => {
    render(<TransactionsPanel transactions={fixtures} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(getTransactionNames()).toEqual([
      "Aqua Utilities",
      "Payroll Deposit",
    ]);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("shows an empty state when filters match nothing", () => {
    render(<TransactionsPanel transactions={fixtures} />);
    fireEvent.change(screen.getByLabelText("Search transaction"), {
      target: { value: "no such merchant" },
    });
    expect(
      screen.getByText("No transactions match your search."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Transactions" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument();
  });
});
