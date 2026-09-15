import { describe, expect, it } from "vitest";
import {
  getLatestTransactions,
  getRecurringBillsSummary,
  sumAmounts,
} from "@/lib/data";
import type { FinanceData, RecurringBill, Transaction } from "@/lib/types";

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

const bill = (
  name: string,
  amount: number,
  date = "2024-01-01",
): RecurringBill => ({
  avatar: "x",
  name,
  category: "Bills",
  date,
  amount,
  recurring: true,
});

describe("getRecurringBillsSummary", () => {
  const data = {
    recurringBills: {
      paid: [bill("Netflix", -15), bill("Spotify", -10)],
      upcoming: [bill("Rent", -1200)],
      dueSoon: [bill("Power", -80), bill("Water", -45)],
    },
  } as unknown as FinanceData;

  it("counts every bill in total and rolls due-soon into upcoming", () => {
    const summary = getRecurringBillsSummary(data);
    expect(summary.totalCount).toBe(5);
    expect(summary.paidCount).toBe(2);
    expect(summary.upcomingCount).toBe(3);
  });

  it("sums absolute amounts and includes due-soon in upcoming", () => {
    const summary = getRecurringBillsSummary(data);
    expect(summary.totalAmount).toBe(1350);
    expect(summary.paidAmount).toBe(25);
    expect(summary.upcomingAmount).toBe(1325);
  });

  it("returns zeros when every bucket is empty", () => {
    const empty = {
      recurringBills: { paid: [], upcoming: [], dueSoon: [] },
    } as unknown as FinanceData;
    expect(getRecurringBillsSummary(empty)).toEqual({
      totalCount: 0,
      totalAmount: 0,
      paidCount: 0,
      paidAmount: 0,
      upcomingCount: 0,
      upcomingAmount: 0,
    });
  });
});
