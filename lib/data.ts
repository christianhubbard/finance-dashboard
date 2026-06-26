import type {
  FinanceData,
  RecurringBill,
  RecurringBillStatus,
  RecurringBillWithStatus,
  RecurringBillsSummary,
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

function sumAbsoluteAmounts(transactions: { amount: number }[]): number {
  return sumAmounts(transactions.map((t) => ({ amount: Math.abs(t.amount) })));
}

function sortByDateDesc(bills: RecurringBill[]): RecurringBill[] {
  return [...bills].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function sortByDateAsc(bills: RecurringBill[]): RecurringBill[] {
  return [...bills].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getRecurringBillsWithStatus(
  data: FinanceData,
): RecurringBillWithStatus[] {
  const { paid, upcoming, dueSoon } = data.recurringBills;

  const withStatus = (
    bills: RecurringBill[],
    status: RecurringBillStatus,
  ): RecurringBillWithStatus[] => bills.map((bill) => ({ ...bill, status }));

  return [
    ...withStatus(sortByDateDesc(paid), "paid"),
    ...withStatus(sortByDateAsc(upcoming), "upcoming"),
    ...withStatus(sortByDateAsc(dueSoon), "dueSoon"),
  ];
}

export function getRecurringBillsSummary(
  data: FinanceData,
): RecurringBillsSummary {
  const { paid, upcoming, dueSoon } = data.recurringBills;

  return {
    totalCount: paid.length + upcoming.length + dueSoon.length,
    paidCount: paid.length,
    upcomingCount: upcoming.length,
    dueSoonCount: dueSoon.length,
    paidTotal: sumAbsoluteAmounts(paid),
    upcomingTotal: sumAbsoluteAmounts(upcoming),
    dueSoonTotal: sumAbsoluteAmounts(dueSoon),
  };
}
