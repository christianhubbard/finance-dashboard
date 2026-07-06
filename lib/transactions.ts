import type { Transaction } from "./types";

export const SORT_OPTIONS = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const ALL_CATEGORIES = "All Transactions";

/** Unique categories in first-seen order, prefixed with the "all" option */
export function getCategoryOptions(transactions: Transaction[]): string[] {
  const seen = new Set<string>();
  for (const tx of transactions) {
    seen.add(tx.category);
  }
  return [ALL_CATEGORIES, ...seen];
}

export function filterTransactions(
  transactions: Transaction[],
  search: string,
  category: string,
): Transaction[] {
  const query = search.trim().toLowerCase();
  return transactions.filter((tx) => {
    if (category !== ALL_CATEGORIES && tx.category !== category) {
      return false;
    }
    return query === "" || tx.name.toLowerCase().includes(query);
  });
}

export function sortTransactions(
  transactions: Transaction[],
  sort: SortOption,
): Transaction[] {
  const sorted = [...transactions];
  switch (sort) {
    case "Latest":
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    case "Oldest":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "A to Z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "Z to A":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "Highest":
      return sorted.sort((a, b) => b.amount - a.amount);
    case "Lowest":
      return sorted.sort((a, b) => a.amount - b.amount);
  }
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function pageCount(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}
