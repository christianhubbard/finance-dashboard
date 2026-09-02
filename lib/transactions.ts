import type { Transaction } from "./types";

export const PAGE_SIZE = 10;

export const TRANSACTION_CATEGORIES = [
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

export type SortKey =
  | "latest"
  | "oldest"
  | "nameAsc"
  | "nameDesc"
  | "highest"
  | "lowest";

export type FilterOptions = {
  search?: string;
  category?: string;
};

export type QueryOptions = FilterOptions & {
  sort?: SortKey;
  page?: number;
  pageSize?: number;
};

export type QueryResult = {
  rows: Transaction[];
  total: number;
  page: number;
  pageCount: number;
};

function dateValue(iso: string): number {
  return new Date(`${iso}T12:00:00`).getTime();
}

export function filterTransactions(
  txs: Transaction[],
  { search = "", category = "all" }: FilterOptions = {},
): Transaction[] {
  const q = search.trim().toLowerCase();
  const categoryFilter = category.trim().toLowerCase();

  return txs.filter((tx) => {
    const matchesSearch = q === "" || tx.name.toLowerCase().includes(q);
    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "all" ||
      tx.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });
}

export function sortTransactions(
  txs: Transaction[],
  sortKey: SortKey = "latest",
): Transaction[] {
  const sorted = [...txs];

  const byName = (a: Transaction, b: Transaction) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" });

  switch (sortKey) {
    case "oldest":
      return sorted.sort(
        (a, b) => dateValue(a.date) - dateValue(b.date) || byName(a, b),
      );
    case "nameAsc":
      return sorted.sort(
        (a, b) => byName(a, b) || dateValue(b.date) - dateValue(a.date),
      );
    case "nameDesc":
      return sorted.sort(
        (a, b) => byName(b, a) || dateValue(b.date) - dateValue(a.date),
      );
    case "highest":
      return sorted.sort((a, b) => b.amount - a.amount || byName(a, b));
    case "lowest":
      return sorted.sort((a, b) => a.amount - b.amount || byName(a, b));
    case "latest":
    default:
      return sorted.sort(
        (a, b) => dateValue(b.date) - dateValue(a.date) || byName(a, b),
      );
  }
}

export function paginateTransactions(
  txs: Transaction[],
  page: number,
  pageSize = PAGE_SIZE,
): Transaction[] {
  if (txs.length === 0 || pageSize <= 0) {
    return [];
  }
  const pageCount = Math.ceil(txs.length / pageSize);
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return txs.slice(start, start + pageSize);
}

export function queryTransactions(
  txs: Transaction[],
  options: QueryOptions = {},
): QueryResult {
  const { sort = "latest", page = 1, pageSize = PAGE_SIZE, ...filters } =
    options;
  const filtered = filterTransactions(txs, filters);
  const sorted = sortTransactions(filtered, sort);
  const pageCount =
    sorted.length === 0 ? 0 : Math.ceil(sorted.length / pageSize);
  const safePage =
    pageCount === 0 ? 1 : Math.min(Math.max(1, page), pageCount);

  return {
    rows: paginateTransactions(sorted, safePage, pageSize),
    total: sorted.length,
    page: safePage,
    pageCount,
  };
}
