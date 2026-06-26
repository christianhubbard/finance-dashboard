import { describe, expect, it } from "vitest";
import {
  getLatestTransactions,
  getRecurringBillsSummary,
  getRecurringBillsWithStatus,
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

const recurringBill = (name: string, date: string, amount: number): RecurringBill => ({
  avatar: "x",
  name,
  category: "Bills",
  date,
  amount,
  recurring: true,
});

describe("getRecurringBillsWithStatus", () => {
  const data = {
    recurringBills: {
      paid: [recurringBill("Paid A", "2022-11-10", -10)],
      upcoming: [recurringBill("Upcoming A", "2022-12-01", -20)],
      dueSoon: [recurringBill("Due Soon A", "2022-12-08", -30)],
    },
  } as unknown as FinanceData;

  it("tags each bill with its status bucket", () => {
    const result = getRecurringBillsWithStatus(data);
    expect(result.map((bill) => bill.status)).toEqual([
      "paid",
      "upcoming",
      "dueSoon",
    ]);
  });
});

describe("getRecurringBillsSummary", () => {
  const data = {
    recurringBills: {
      paid: [recurringBill("Paid A", "2022-11-10", -10), recurringBill("Paid B", "2022-11-01", -5)],
      upcoming: [recurringBill("Upcoming A", "2022-12-01", -20)],
      dueSoon: [recurringBill("Due Soon A", "2022-12-08", -30)],
    },
  } as unknown as FinanceData;

  it("computes counts and absolute totals", () => {
    expect(getRecurringBillsSummary(data)).toEqual({
      totalCount: 4,
      paidCount: 2,
      upcomingCount: 1,
      dueSoonCount: 1,
      paidTotal: 15,
      upcomingTotal: 20,
      dueSoonTotal: 30,
    });
  });
});
