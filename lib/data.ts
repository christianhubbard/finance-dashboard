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

export type BudgetDetail = Budget & {
  remaining: number;
  transactions: Transaction[];
};

export function getRecentTransactionsForCategory(
  data: FinanceData,
  category: string,
  limit = 3,
): Transaction[] {
  return getLatestTransactions(
    {
      ...data,
      transactions: data.transactions.filter((tx) => tx.category === category),
    },
    limit,
  );
}

export function getBudgetDetails(
  data: FinanceData,
  transactionLimit = 3,
): BudgetDetail[] {
  return data.budgets.map((budget) => ({
    ...budget,
    remaining: budget.maximum - budget.spent,
    transactions: getRecentTransactionsForCategory(
      data,
      budget.category,
      transactionLimit,
    ),
  }));
}
