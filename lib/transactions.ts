import type { Transaction } from "./types";

export const TRANSACTION_CATEGORIES = [
  "All Transactions",
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
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "a-z", label: "A to Z" },
  { value: "z-a", label: "Z to A" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
] as const;

export type TransactionSort = (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 10;

export type TransactionQuery = {
  search: string;
  category: string;
  sort: TransactionSort;
  page: number;
  pageSize?: number;
};

export function filterTransactions(
  transactions: Transaction[],
  { search, category }: { search: string; category: string },
): Transaction[] {
  const needle = search.trim().toLowerCase();
  return transactions.filter((tx) => {
    if (category && category !== "All Transactions" && tx.category !== category) {
      return false;
    }
    if (needle && !tx.name.toLowerCase().includes(needle)) {
      return false;
    }
    return true;
  });
}

export function sortTransactions(
  transactions: Transaction[],
  sort: TransactionSort,
): Transaction[] {
  const copy = [...transactions];
  copy.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return a.date.localeCompare(b.date);
      case "a-z":
        return a.name.localeCompare(b.name);
      case "z-a":
        return b.name.localeCompare(a.name);
      case "highest":
        return Math.abs(b.amount) - Math.abs(a.amount);
      case "lowest":
        return Math.abs(a.amount) - Math.abs(b.amount);
      case "latest":
      default:
        return b.date.localeCompare(a.date);
    }
  });
  return copy;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize = PAGE_SIZE,
): { items: T[]; page: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
  };
}

export function queryTransactions(
  transactions: Transaction[],
  { search, category, sort, page, pageSize = PAGE_SIZE }: TransactionQuery,
) {
  const filtered = filterTransactions(transactions, { search, category });
  const sorted = sortTransactions(filtered, sort);
  const paged = paginate(sorted, page, pageSize);
  return { ...paged, total: filtered.length };
}
