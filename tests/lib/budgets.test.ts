import { describe, expect, it } from "vitest";
import {
  latestTransactionsForCategory,
  progressPercent,
  remaining,
  totalLimit,
  totalSpent,
} from "@/lib/budgets";
import type { Budget, Transaction } from "@/lib/types";

const budget = (overrides: Partial<Budget> = {}): Budget => ({
  category: "Groceries",
  maximum: 400,
  spent: 125,
  theme: "red",
  ...overrides,
});

const tx = (overrides: Partial<Transaction> = {}): Transaction => ({
  avatar: "urban",
  name: "Urban Services Hub",
  category: "Groceries",
  date: "2022-11-27",
  amount: -65.5,
  recurring: false,
  ...overrides,
});

describe("remaining", () => {
  it("returns maximum minus spent when under limit", () => {
    expect(remaining(budget())).toBe(275);
  });

  it("returns 0 when fully spent", () => {
    expect(remaining(budget({ spent: 50, maximum: 50 }))).toBe(0);
  });

  it("does not return negative when overspent", () => {
    expect(remaining(budget({ spent: 450, maximum: 400 }))).toBe(0);
  });
});

describe("progressPercent", () => {
  it("calculates spent as a percentage of maximum", () => {
    expect(progressPercent(budget({ spent: 125, maximum: 400 }))).toBe(31.25);
  });

  it("clamps to 100 when spent exceeds maximum", () => {
    expect(progressPercent(budget({ spent: 500, maximum: 400 }))).toBe(100);
  });

  it("returns 0 when maximum is zero", () => {
    expect(progressPercent(budget({ maximum: 0, spent: 10 }))).toBe(0);
  });
});

describe("totalSpent", () => {
  it("sums spent across budgets", () => {
    expect(
      totalSpent([
        budget({ spent: 50 }),
        budget({ category: "Bills", spent: 375 }),
      ]),
    ).toBe(425);
  });

  it("returns 0 for an empty list", () => {
    expect(totalSpent([])).toBe(0);
  });
});

describe("totalLimit", () => {
  it("sums maximum across budgets", () => {
    expect(
      totalLimit([
        budget({ maximum: 400 }),
        budget({ category: "Bills", maximum: 750 }),
      ]),
    ).toBe(1150);
  });
});

describe("latestTransactionsForCategory", () => {
  const transactions = [
    tx({ date: "2022-11-21", name: "Northwind" }),
    tx({ date: "2022-11-27", name: "Urban Services" }),
    tx({ category: "Bills", date: "2022-11-26", name: "Emma Bills" }),
    tx({ date: "2022-11-25", name: "Earlier Groceries" }),
  ];

  it("filters by category and sorts by date descending", () => {
    const result = latestTransactionsForCategory(transactions, "Groceries");
    expect(result.map((t) => t.name)).toEqual([
      "Urban Services",
      "Earlier Groceries",
      "Northwind",
    ]);
  });

  it("respects the limit parameter", () => {
    expect(latestTransactionsForCategory(transactions, "Groceries", 2)).toHaveLength(2);
  });

  it("returns an empty array when no transactions match", () => {
    expect(latestTransactionsForCategory(transactions, "Entertainment")).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const original = [...transactions];
    latestTransactionsForCategory(transactions, "Groceries");
    expect(transactions).toEqual(original);
  });
});
