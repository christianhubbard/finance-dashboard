import type {
  FinanceData,
  RecurringBillStatus,
  RecurringBillWithStatus,
  Transaction,
} from "./types";
import finance from "@/data/finance.json";

export function getFinanceData(): FinanceData {
  return finance as FinanceData;
}

/** Latest transactions first (by ISO date string) */
export function getLatestTransactions(
  data: FinanceData,
  limit = 5,
): Transaction[] {
  const sorted = [...data.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return sorted.slice(0, limit);
}

export function sumAmounts(transactions: { amount: number }[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

/** Flatten recurring bill buckets; `dueSoon` is exposed as `overdue` for the page. */
export function getRecurringBillsWithStatus(
  data: FinanceData,
): RecurringBillWithStatus[] {
  const { paid, upcoming, dueSoon } = data.recurringBills;
  return [
    ...paid.map((bill) => ({ ...bill, status: "paid" as const })),
    ...upcoming.map((bill) => ({ ...bill, status: "upcoming" as const })),
    ...dueSoon.map((bill) => ({ ...bill, status: "overdue" as const })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function filterRecurringBillsByStatus(
  bills: RecurringBillWithStatus[],
  status: RecurringBillStatus | "all",
): RecurringBillWithStatus[] {
  if (status === "all") return bills;
  return bills.filter((bill) => bill.status === status);
}

export type RecurringBillsSummary = {
  totalCount: number;
  totalAmount: number;
  paidCount: number;
  paidAmount: number;
  upcomingCount: number;
  upcomingAmount: number;
  overdueCount: number;
  overdueAmount: number;
};

export function getRecurringBillsSummary(
  data: FinanceData,
): RecurringBillsSummary {
  const bills = getRecurringBillsWithStatus(data);
  const absSum = (list: { amount: number }[]) =>
    sumAmounts(list.map((t) => ({ amount: Math.abs(t.amount) })));

  const paid = bills.filter((b) => b.status === "paid");
  const upcoming = bills.filter((b) => b.status === "upcoming");
  const overdue = bills.filter((b) => b.status === "overdue");

  return {
    totalCount: bills.length,
    totalAmount: absSum(bills),
    paidCount: paid.length,
    paidAmount: absSum(paid),
    upcomingCount: upcoming.length,
    upcomingAmount: absSum(upcoming),
    overdueCount: overdue.length,
    overdueAmount: absSum(overdue),
  };
}
