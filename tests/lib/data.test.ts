import { describe, expect, it } from "vitest";
import { getLatestTransactions, sumAmounts } from "@/lib/data";
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
