import type { FinanceData, RecurringBill, Transaction } from "./types";
import finance from "@/data/finance.json";

export type RecurringBillsSummary = {
  totalCount: number;
  totalAmount: number;
  paidCount: number;
  paidAmount: number;
  upcomingCount: number;
  upcomingAmount: number;
};

function absSum(bills: RecurringBill[]): number {
  return sumAmounts(bills.map((bill) => ({ amount: Math.abs(bill.amount) })));
}

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

/** Monthly totals. Upcoming includes due-soon (still unpaid). */
export function getRecurringBillsSummary(
  data: FinanceData,
): RecurringBillsSummary {
  const { paid, upcoming, dueSoon } = data.recurringBills;
  const unpaid = [...upcoming, ...dueSoon];
  const all = [...paid, ...unpaid];

  return {
    totalCount: all.length,
    totalAmount: absSum(all),
    paidCount: paid.length,
    paidAmount: absSum(paid),
    upcomingCount: unpaid.length,
    upcomingAmount: absSum(unpaid),
  };
}
