import type {
  FinanceData,
  RecurringBill,
  RecurringBillListItem,
  RecurringBillStatus,
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

const recurringBillStatusOrder: RecurringBillStatus[] = [
  "paid",
  "upcoming",
  "overdue",
];

function byDueDate(a: RecurringBill, b: RecurringBill): number {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function billTotal(bills: RecurringBill[]): number {
  return sumAmounts(bills.map((bill) => ({ amount: Math.abs(bill.amount) })));
}

export function getRecurringBillGroups(
  data: FinanceData,
): Record<RecurringBillStatus, RecurringBill[]> {
  return {
    paid: [...data.recurringBills.paid].sort(byDueDate),
    upcoming: [...data.recurringBills.upcoming].sort(byDueDate),
    overdue: [...data.recurringBills.dueSoon].sort(byDueDate),
  };
}

export function getRecurringBills(data: FinanceData): RecurringBillListItem[] {
  const groups = getRecurringBillGroups(data);

  return recurringBillStatusOrder.flatMap((status) =>
    groups[status].map((bill) => ({ ...bill, status })),
  );
}

export function getRecurringBillsSummary(
  data: FinanceData,
): RecurringBillsSummary {
  const groups = getRecurringBillGroups(data);
  const paid = billTotal(groups.paid);
  const upcoming = billTotal(groups.upcoming);
  const overdue = billTotal(groups.overdue);

  return {
    totalBills: paid + upcoming + overdue,
    paid,
    upcoming,
    overdue,
    billCount: recurringBillStatusOrder.reduce(
      (count, status) => count + groups[status].length,
      0,
    ),
  };
}
