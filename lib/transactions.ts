import type { Transaction } from "@/lib/types";

export const ALL_TRANSACTIONS = "All Transactions" as const;

export const TRANSACTION_CATEGORIES = [
  ALL_TRANSACTIONS,
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

export const TRANSACTION_SORT_OPTIONS = [
  "Latest",
  "Oldest",
  "A to Z",
  "Z to A",
  "Highest",
  "Lowest",
] as const;

export type TransactionSort = (typeof TRANSACTION_SORT_OPTIONS)[number];

export const DEFAULT_SORT: TransactionSort = "Latest";

export type TransactionFilters = {
  search: string;
  category: TransactionCategory;
  sort: TransactionSort;
};

export type PaginatedTransactions = {
  items: Transaction[];
  page: number;
  totalPages: number;
  total: number;
};

export function parseTransactionCategory(
  value: string,
): TransactionCategory | undefined {
  return TRANSACTION_CATEGORIES.find((category) => category === value);
}

export function parseTransactionSort(
  value: string,
): TransactionSort | undefined {
  return TRANSACTION_SORT_OPTIONS.find((option) => option === value);
}

export function filterTransactions(
  transactions: Transaction[],
  { search, category }: Pick<TransactionFilters, "search" | "category">,
): Transaction[] {
  const query = search.trim().toLowerCase();

  return transactions.filter((transaction) => {
    if (category !== ALL_TRANSACTIONS && transaction.category !== category) {
      return false;
    }

    if (!query) {
      return true;
    }

    return transaction.name.toLowerCase().includes(query);
  });
}

export function sortTransactions(
  transactions: Transaction[],
  sort: TransactionSort,
): Transaction[] {
  const sorted = [...transactions];

  switch (sort) {
    case "Latest":
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      break;
    case "Oldest":
      sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      break;
    case "A to Z":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Z to A":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "Highest":
      sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
      break;
    case "Lowest":
      sorted.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
      break;
    default: {
      const _exhaustive: never = sort;
      void _exhaustive;
    }
  }

  return sorted;
}

export function paginateTransactions(
  transactions: Transaction[],
  page: number,
  pageSize = 10,
): PaginatedTransactions {
  const total = transactions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: transactions.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
  };
}

export function getTransactionsPage(
  transactions: Transaction[],
  filters: TransactionFilters & { page: number },
  pageSize = 10,
): PaginatedTransactions {
  const filtered = filterTransactions(transactions, filters);
  const sorted = sortTransactions(filtered, filters.sort);
  return paginateTransactions(sorted, filters.page, pageSize);
}
