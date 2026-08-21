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

export function sumAmounts(transactions: { amount: number }[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function getBudgetRemaining(budget: Budget): number {
  return Math.max(0, budget.maximum - budget.spent);
}

export function getBudgetProgress(budget: Budget): number {
  if (budget.maximum <= 0) return 0;
  return Math.min(100, (budget.spent / budget.maximum) * 100);
}

export function getBudgetsSpentTotal(budgets: Budget[]): number {
  return budgets.reduce((sum, b) => sum + b.spent, 0);
}

export function getBudgetsLimitTotal(budgets: Budget[]): number {
  return budgets.reduce((sum, b) => sum + b.maximum, 0);
}

export function getTransactionsForCategory(
  data: FinanceData,
  category: string,
  limit = 3,
): Transaction[] {
  const sorted = [...data.transactions]
    .filter((t) => t.category === category)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  return sorted.slice(0, limit);
}
