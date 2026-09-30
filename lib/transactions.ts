import type { Transaction } from "./types";

export const ALL_CATEGORIES = "All Transactions";

export const TRANSACTION_CATEGORIES = [
  ALL_CATEGORIES,
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
];

export const SORT_OPTIONS = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const PAGE_SIZE = 10;

export type TransactionFilters = {
  search: string;
  category: string;
};

export type TransactionQuery = TransactionFilters & {
  sort: SortOption;
  page: number;
};

export type TransactionPage = {
  items: Transaction[];
  page: number;
  pageCount: number;
};

export function filterTransactions(
  transactions: Transaction[],
  { search, category }: TransactionFilters,
): Transaction[] {
  const query = search.trim().toLowerCase();
  return transactions.filter(
    (tx) =>
      (category === ALL_CATEGORIES || tx.category === category) &&
      tx.name.toLowerCase().includes(query),
  );
}

/** Highest / Lowest compare signed amounts, so income ranks above any expense. */
export function sortTransactions(
  transactions: Transaction[],
  sort: SortOption,
): Transaction[] {
  const sorted = [...transactions];
  switch (sort) {
    case "Latest":
      return sorted.sort((a, b) => b.date.localeCompare(a.date));
    case "Oldest":
      return sorted.sort((a, b) => a.date.localeCompare(b.date));
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

export function paginateTransactions(
  transactions: Transaction[],
  page: number,
  pageSize = PAGE_SIZE,
): TransactionPage {
  const pageCount = Math.max(1, Math.ceil(transactions.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return {
    items: transactions.slice(start, start + pageSize),
    page: current,
    pageCount,
  };
}

export function queryTransactions(
  transactions: Transaction[],
  { search, category, sort, page }: TransactionQuery,
  pageSize = PAGE_SIZE,
): TransactionPage {
  const filtered = filterTransactions(transactions, { search, category });
  return paginateTransactions(sortTransactions(filtered, sort), page, pageSize);
}
