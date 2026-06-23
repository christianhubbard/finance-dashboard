import type { Transaction } from "./types";

export const TRANSACTION_SORT_OPTIONS = [
  "newest",
  "oldest",
  "az",
  "highest",
  "lowest",
] as const;

export type TransactionSortOption = (typeof TRANSACTION_SORT_OPTIONS)[number];

type TransactionQuery = {
  search?: string;
  category?: string;
  sort?: TransactionSortOption;
};

export function formatTransactionDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getTransactionCategories(
  transactions: Transaction[],
): string[] {
  return Array.from(new Set(transactions.map((tx) => tx.category))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterAndSortTransactions(
  transactions: Transaction[],
  { search = "", category = "all", sort = "newest" }: TransactionQuery = {},
): Transaction[] {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      tx.name.toLowerCase().includes(normalizedSearch);
    const matchesCategory = category === "all" || tx.category === category;

    return matchesSearch && matchesCategory;
  });

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "az":
        return a.name.localeCompare(b.name);
      case "highest":
        return b.amount - a.amount;
      case "lowest":
        return a.amount - b.amount;
      case "newest":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
}
