import { describe, expect, it } from "vitest";
import {
  filterRecurringBillsByStatus,
  getRecurringBillsSummary,
  getRecurringBillsWithStatus,
} from "@/lib/data";
import type { FinanceData, RecurringBill } from "@/lib/types";

const bill = (
  name: string,
  amount: number,
  date: string,
): RecurringBill => ({
  avatar: "x",
  name,
  category: "Bills",
  date,
  amount,
  recurring: true,
});

const data: FinanceData = {
  balance: { current: 0, income: 0, expenses: 0 },
  pots: [],
  transactions: [],
  budgets: [],
  recurringBills: {
    paid: [bill("Netflix", -15, "2024-01-01"), bill("Spotify", -10, "2024-01-05")],
    upcoming: [bill("Rent", -1200, "2024-01-20")],
    dueSoon: [bill("Power", -80, "2024-01-12"), bill("Water", -45, "2024-01-10")],
  },
};

describe("getRecurringBillsWithStatus", () => {
  it("maps dueSoon bills to overdue status", () => {
    const bills = getRecurringBillsWithStatus(data);
    expect(bills.filter((b) => b.status === "overdue").map((b) => b.name)).toEqual(
      ["Water", "Power"],
    );
  });

  it("sorts bills by due date ascending", () => {
    const dates = getRecurringBillsWithStatus(data).map((b) => b.date);
    expect(dates).toEqual([
      "2024-01-01",
      "2024-01-05",
      "2024-01-10",
      "2024-01-12",
      "2024-01-20",
    ]);
  });

  it("preserves paid and upcoming statuses", () => {
    const bills = getRecurringBillsWithStatus(data);
    expect(bills.filter((b) => b.status === "paid")).toHaveLength(2);
    expect(bills.filter((b) => b.status === "upcoming")).toHaveLength(1);
  });
});

describe("filterRecurringBillsByStatus", () => {
  const bills = getRecurringBillsWithStatus(data);

  it("returns all bills when filter is all", () => {
    expect(filterRecurringBillsByStatus(bills, "all")).toHaveLength(5);
  });

  it("filters by a single status", () => {
    expect(filterRecurringBillsByStatus(bills, "paid")).toHaveLength(2);
    expect(filterRecurringBillsByStatus(bills, "overdue")).toHaveLength(2);
    expect(filterRecurringBillsByStatus(bills, "upcoming")).toHaveLength(1);
  });
});

describe("getRecurringBillsSummary", () => {
  it("computes absolute totals and counts", () => {
    const summary = getRecurringBillsSummary(data);
    expect(summary.totalCount).toBe(5);
    expect(summary.totalAmount).toBe(1350);
    expect(summary.paidCount).toBe(2);
    expect(summary.paidAmount).toBe(25);
    expect(summary.upcomingCount).toBe(1);
    expect(summary.upcomingAmount).toBe(1200);
    expect(summary.overdueCount).toBe(2);
    expect(summary.overdueAmount).toBe(125);
  });
});
