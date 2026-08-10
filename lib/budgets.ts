import type { Budget, Transaction } from "./types";

export function remaining(budget: Budget): number {
  return Math.max(0, budget.maximum - budget.spent);
}

export function progressPercent(budget: Budget): number {
  if (budget.maximum <= 0) {
    return 0;
  }
  return Math.min(100, (budget.spent / budget.maximum) * 100);
}

export function totalSpent(budgets: Budget[]): number {
  return budgets.reduce((sum, b) => sum + b.spent, 0);
}

export function totalLimit(budgets: Budget[]): number {
  return budgets.reduce((sum, b) => sum + b.maximum, 0);
}

export function latestTransactionsForCategory(
  transactions: Transaction[],
  category: string,
  limit = 3,
): Transaction[] {
  return [...transactions]
    .filter((tx) => tx.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
