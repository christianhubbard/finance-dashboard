import { describe, expect, it } from "vitest";
import {
  getBudgetProgress,
  getBudgetRemaining,
  getBudgetsLimitTotal,
  getBudgetsSpentTotal,
  getTransactionsForCategory,
} from "@/lib/data";
import type { Budget, FinanceData, Transaction } from "@/lib/types";

const budget = (overrides: Partial<Budget> = {}): Budget => ({
  category: "Test",
  maximum: 100,
  spent: 40,
  theme: "green",
  ...overrides,
});

const tx = (
  date: string,
  category: string,
  name = date,
): Transaction => ({
  avatar: "x",
  name,
  category,
  date,
  amount: -10,
  recurring: false,
});

describe("getBudgetRemaining", () => {
  it("returns maximum minus spent when under limit", () => {
    expect(getBudgetRemaining(budget({ maximum: 100, spent: 40 }))).toBe(60);
  });

  it("clamps to zero when spent exceeds maximum", () => {
    expect(getBudgetRemaining(budget({ maximum: 75, spent: 133 }))).toBe(0);
  });

  it("returns zero when spent equals maximum", () => {
    expect(getBudgetRemaining(budget({ maximum: 50, spent: 50 }))).toBe(0);
  });
});

describe("getBudgetProgress", () => {
  it("returns percentage of spent relative to maximum", () => {
    expect(getBudgetProgress(budget({ maximum: 100, spent: 40 }))).toBe(40);
  });

  it("caps at 100 when over budget", () => {
    expect(getBudgetProgress(budget({ maximum: 75, spent: 133 }))).toBe(100);
  });

  it("returns 0 when maximum is zero", () => {
    expect(getBudgetProgress(budget({ maximum: 0, spent: 10 }))).toBe(0);
  });
});

describe("getBudgetsSpentTotal", () => {
  it("sums spent across all budgets", () => {
    const budgets = [
      budget({ spent: 50 }),
      budget({ spent: 125 }),
      budget({ spent: 45 }),
    ];
    expect(getBudgetsSpentTotal(budgets)).toBe(220);
  });
});

describe("getBudgetsLimitTotal", () => {
  it("sums maximum across all budgets", () => {
    const budgets = [
      budget({ maximum: 50 }),
      budget({ maximum: 750 }),
      budget({ maximum: 400 }),
    ];
    expect(getBudgetsLimitTotal(budgets)).toBe(1200);
  });
});

describe("getTransactionsForCategory", () => {
  const data = {
    transactions: [
      tx("2024-01-01", "Bills", "a"),
      tx("2024-03-15", "Bills", "b"),
      tx("2024-02-10", "Dining Out", "c"),
      tx("2024-05-20", "Bills", "d"),
    ],
  } as unknown as FinanceData;

  it("filters by exact category name", () => {
    const result = getTransactionsForCategory(data, "Bills", 10);
    expect(result.map((t) => t.name)).toEqual(["d", "b", "a"]);
  });

  it("respects the limit parameter", () => {
    expect(getTransactionsForCategory(data, "Bills", 2)).toHaveLength(2);
  });

  it("returns an empty array when no transactions match", () => {
    expect(getTransactionsForCategory(data, "Groceries", 3)).toEqual([]);
  });

  it("does not mutate the input transactions array", () => {
    const original = [...data.transactions];
    getTransactionsForCategory(data, "Bills", 2);
    expect(data.transactions).toEqual(original);
  });
});
