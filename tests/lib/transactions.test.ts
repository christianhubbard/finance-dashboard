import { describe, expect, it } from "vitest";
import {
  filterAndSortTransactions,
  formatTransactionDate,
  getTransactionCategories,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const tx = (
  name: string,
  category: string,
  date: string,
  amount: number,
): Transaction => ({
  avatar: name.toLowerCase().slice(0, 4),
  name,
  category,
  date,
  amount,
  recurring: false,
});

const transactions = [
  tx("Beta Market", "Groceries", "2024-02-01", -45),
  tx("Alpha Cafe", "Dining Out", "2024-03-15", -12.5),
  tx("Gamma Payroll", "General", "2024-01-20", 1500),
  tx("Delta Utilities", "Bills", "2024-03-01", -120),
];

describe("formatTransactionDate", () => {
  it("formats an ISO date for display", () => {
    expect(formatTransactionDate("2024-03-15")).toBe("Mar 15, 2024");
  });
});

describe("getTransactionCategories", () => {
  it("returns unique categories alphabetically", () => {
    expect(getTransactionCategories(transactions)).toEqual([
      "Bills",
      "Dining Out",
      "General",
      "Groceries",
    ]);
  });
});

describe("filterAndSortTransactions", () => {
  it("searches transactions by merchant name case-insensitively", () => {
    const result = filterAndSortTransactions(transactions, { search: "cafe" });
    expect(result.map((transaction) => transaction.name)).toEqual(["Alpha Cafe"]);
  });

  it("filters transactions by category", () => {
    const result = filterAndSortTransactions(transactions, {
      category: "Groceries",
    });
    expect(result.map((transaction) => transaction.name)).toEqual(["Beta Market"]);
  });

  it("combines search and category filters", () => {
    const result = filterAndSortTransactions(transactions, {
      search: "delta",
      category: "Bills",
    });
    expect(result.map((transaction) => transaction.name)).toEqual([
      "Delta Utilities",
    ]);
  });

  it("sorts transactions newest first by default", () => {
    const result = filterAndSortTransactions(transactions);
    expect(result.map((transaction) => transaction.name)).toEqual([
      "Alpha Cafe",
      "Delta Utilities",
      "Beta Market",
      "Gamma Payroll",
    ]);
  });

  it("sorts transactions oldest first", () => {
    const result = filterAndSortTransactions(transactions, { sort: "oldest" });
    expect(result.map((transaction) => transaction.name)).toEqual([
      "Gamma Payroll",
      "Beta Market",
      "Delta Utilities",
      "Alpha Cafe",
    ]);
  });

  it("sorts transactions alphabetically by merchant", () => {
    const result = filterAndSortTransactions(transactions, { sort: "az" });
    expect(result.map((transaction) => transaction.name)).toEqual([
      "Alpha Cafe",
      "Beta Market",
      "Delta Utilities",
      "Gamma Payroll",
    ]);
  });

  it("sorts transactions by highest amount", () => {
    const result = filterAndSortTransactions(transactions, { sort: "highest" });
    expect(result.map((transaction) => transaction.name)).toEqual([
      "Gamma Payroll",
      "Alpha Cafe",
      "Beta Market",
      "Delta Utilities",
    ]);
  });

  it("sorts transactions by lowest amount", () => {
    const result = filterAndSortTransactions(transactions, { sort: "lowest" });
    expect(result.map((transaction) => transaction.name)).toEqual([
      "Delta Utilities",
      "Beta Market",
      "Alpha Cafe",
      "Gamma Payroll",
    ]);
  });

  it("does not mutate the source transactions", () => {
    const original = [...transactions];
    filterAndSortTransactions(transactions, { sort: "az" });
    expect(transactions).toEqual(original);
  });
});
