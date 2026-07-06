import { describe, expect, it } from "vitest";
import {
  ALL_CATEGORIES,
  filterTransactions,
  getCategoryOptions,
  pageCount,
  paginate,
  sortTransactions,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const tx = (
  name: string,
  date: string,
  amount: number,
  category = "General",
): Transaction => ({
  avatar: "x",
  name,
  category,
  date,
  amount,
  recurring: false,
});

const transactions = [
  tx("Beta Store", "2024-02-01", -20, "Groceries"),
  tx("Alpha Cafe", "2024-03-01", -5, "Dining Out"),
  tx("Charlie Payroll", "2024-01-01", 1000, "General"),
];

describe("getCategoryOptions", () => {
  it("prepends the all option and deduplicates categories", () => {
    const options = getCategoryOptions([
      ...transactions,
      tx("Dup", "2024-04-01", -1, "Groceries"),
    ]);
    expect(options).toEqual([
      ALL_CATEGORIES,
      "Groceries",
      "Dining Out",
      "General",
    ]);
  });
});

describe("filterTransactions", () => {
  it("returns everything for the all option and empty search", () => {
    expect(filterTransactions(transactions, "", ALL_CATEGORIES)).toHaveLength(3);
  });

  it("matches names case-insensitively", () => {
    const result = filterTransactions(transactions, "alpha", ALL_CATEGORIES);
    expect(result.map((t) => t.name)).toEqual(["Alpha Cafe"]);
  });

  it("filters by category", () => {
    const result = filterTransactions(transactions, "", "Groceries");
    expect(result.map((t) => t.name)).toEqual(["Beta Store"]);
  });

  it("combines search and category", () => {
    expect(filterTransactions(transactions, "alpha", "Groceries")).toHaveLength(0);
  });
});

describe("sortTransactions", () => {
  it("sorts by Latest and Oldest", () => {
    expect(sortTransactions(transactions, "Latest").map((t) => t.name)).toEqual(
      ["Alpha Cafe", "Beta Store", "Charlie Payroll"],
    );
    expect(sortTransactions(transactions, "Oldest").map((t) => t.name)).toEqual(
      ["Charlie Payroll", "Beta Store", "Alpha Cafe"],
    );
  });

  it("sorts alphabetically both ways", () => {
    expect(sortTransactions(transactions, "A to Z").map((t) => t.name)).toEqual(
      ["Alpha Cafe", "Beta Store", "Charlie Payroll"],
    );
    expect(sortTransactions(transactions, "Z to A").map((t) => t.name)).toEqual(
      ["Charlie Payroll", "Beta Store", "Alpha Cafe"],
    );
  });

  it("sorts by amount both ways", () => {
    expect(sortTransactions(transactions, "Highest").map((t) => t.amount)).toEqual(
      [1000, -5, -20],
    );
    expect(sortTransactions(transactions, "Lowest").map((t) => t.amount)).toEqual(
      [-20, -5, 1000],
    );
  });

  it("does not mutate the input", () => {
    const original = [...transactions];
    sortTransactions(transactions, "Z to A");
    expect(transactions).toEqual(original);
  });
});

describe("paginate", () => {
  const items = [1, 2, 3, 4, 5];

  it("returns the requested page", () => {
    expect(paginate(items, 1, 2)).toEqual([1, 2]);
    expect(paginate(items, 3, 2)).toEqual([5]);
  });

  it("returns an empty array past the last page", () => {
    expect(paginate(items, 4, 2)).toEqual([]);
  });
});

describe("pageCount", () => {
  it("rounds up to whole pages", () => {
    expect(pageCount(5, 2)).toBe(3);
    expect(pageCount(4, 2)).toBe(2);
  });

  it("never returns less than one page", () => {
    expect(pageCount(0, 8)).toBe(1);
  });
});
