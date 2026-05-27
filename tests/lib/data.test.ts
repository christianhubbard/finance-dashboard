import { describe, expect, it } from "vitest";
import {
  getBudgetDetails,
  getLatestTransactions,
  getRecentTransactionsForCategory,
  sumAmounts,
} from "@/lib/data";
import type { FinanceData, Transaction } from "@/lib/types";

const tx = (date: string, amount = 0, name = date): Transaction => ({
  avatar: "x",
  name,
  category: "test",
  date,
  amount,
  recurring: false,
});

describe("sumAmounts", () => {
  it("sums an empty list to 0", () => {
    expect(sumAmounts([])).toBe(0);
  });

  it("sums positive and negative amounts", () => {
    expect(sumAmounts([{ amount: 10 }, { amount: -3 }, { amount: 2.5 }])).toBe(9.5);
  });
});

describe("getLatestTransactions", () => {
  const data = {
    transactions: [
      tx("2024-01-01", 1, "a"),
      tx("2024-03-15", 2, "b"),
      tx("2024-02-10", 3, "c"),
      tx("2024-05-20", 4, "d"),
    ],
  } as unknown as FinanceData;

  it("returns transactions sorted by date descending", () => {
    const result = getLatestTransactions(data, 10).map((t) => t.name);
    expect(result).toEqual(["d", "b", "c", "a"]);
  });

  it("respects the limit parameter", () => {
    expect(getLatestTransactions(data, 2)).toHaveLength(2);
  });

  it("defaults to a limit of 5", () => {
    const big = {
      transactions: Array.from({ length: 8 }, (_, i) =>
        tx(`2024-01-0${i + 1}`, i),
      ),
    } as unknown as FinanceData;
    expect(getLatestTransactions(big)).toHaveLength(5);
  });

  it("does not mutate the input array", () => {
    const original = [...data.transactions];
    getLatestTransactions(data, 2);
    expect(data.transactions).toEqual(original);
  });
});

describe("getRecentTransactionsForCategory", () => {
  const data = {
    transactions: [
      tx("2024-01-01", -10, "old-groceries"),
      tx("2024-03-15", -20, "latest-groceries"),
      { ...tx("2024-04-01", -30, "latest-bills"), category: "Bills" },
      tx("2024-02-10", -40, "middle-groceries"),
    ],
  } as unknown as FinanceData;

  data.transactions[0].category = "Groceries";
  data.transactions[1].category = "Groceries";
  data.transactions[3].category = "Groceries";

  it("filters transactions by category and sorts recent first", () => {
    const result = getRecentTransactionsForCategory(data, "Groceries", 2).map(
      (t) => t.name,
    );
    expect(result).toEqual(["latest-groceries", "middle-groceries"]);
  });
});

describe("getBudgetDetails", () => {
  it("derives remaining values and attaches recent category transactions", () => {
    const data = {
      budgets: [
        { category: "Groceries", maximum: 400, spent: 125, theme: "red" },
      ],
      transactions: [
        { ...tx("2024-01-01", -10, "old"), category: "Groceries" },
        { ...tx("2024-02-01", -20, "new"), category: "Groceries" },
        { ...tx("2024-03-01", -30, "other"), category: "Bills" },
      ],
    } as unknown as FinanceData;

    const [budget] = getBudgetDetails(data, 1);

    expect(budget.remaining).toBe(275);
    expect(budget.transactions.map((t) => t.name)).toEqual(["new"]);
  });
});
