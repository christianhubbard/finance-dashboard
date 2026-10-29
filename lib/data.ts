import type { Budget, FinanceData, Transaction } from "./types";
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

export function getLatestTransactionsByCategory(
  data: FinanceData,
  category: string,
  limit = 3,
): Transaction[] {
  return getLatestTransactions(data, data.transactions.length)
    .filter((t) => t.category === category)
    .slice(0, limit);
}

export function getBudgetRemaining(budget: Budget): number {
  return Math.max(0, budget.maximum - budget.spent);
}

export function sumAmounts(transactions: { amount: number }[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
