import type { FinanceData, Transaction } from "./types";
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
