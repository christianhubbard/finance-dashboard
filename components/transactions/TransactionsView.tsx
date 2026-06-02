"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import {
  filterAndSortTransactions,
  formatTransactionDate,
  getTransactionCategories,
  type TransactionSortOption,
} from "@/lib/transactions";
import { getThemeColor } from "@/lib/theme";
import type { Transaction } from "@/lib/types";

const AVATAR_ACCENTS: Record<string, string> = {
  emma: "var(--color-secondary-cyan)",
  urban: "var(--color-secondary-green)",
  savory: "var(--color-secondary-yellow)",
  floral: "var(--color-secondary-purple)",
  spark: "var(--color-secondary-yellow)",
  ledger: "var(--color-secondary-navy)",
  trail: "var(--color-extended-brown)",
  north: "var(--color-extended-blue)",
  ember: "var(--color-extended-orange)",
  water: "var(--color-secondary-cyan)",
  net: "var(--color-extended-magenta)",
};

const SORT_OPTIONS: { value: TransactionSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A to Z" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
];

type TransactionsViewProps = {
  transactions: Transaction[];
};

function TransactionAvatar({ tx }: { tx: Transaction }) {
  const accent = AVATAR_ACCENTS[tx.avatar] ?? getThemeColor("navy");
  const initial = tx.name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-preset-3 font-bold text-white"
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

export function TransactionsView({ transactions }: TransactionsViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<TransactionSortOption>("newest");

  const categories = useMemo(
    () => getTransactionCategories(transactions),
    [transactions],
  );
  const visibleTransactions = useMemo(
    () =>
      filterAndSortTransactions(transactions, {
        search,
        category,
        sort,
      }),
    [category, search, sort, transactions],
  );

  return (
    <Card className="mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-preset-2 text-grey-900">All Transactions</h2>
          <p className="mt-1 text-preset-4 text-grey-500">
            Showing {visibleTransactions.length} of {transactions.length}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_180px] lg:min-w-[680px]">
          <label className="relative block">
            <span className="sr-only">Search by merchant name</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transaction"
              className="w-full rounded-lg border border-beige-500 bg-white py-3 pl-5 pr-11 text-preset-4 text-grey-900 outline-none transition-colors placeholder:text-grey-500 focus:border-grey-900"
            />
            <Search
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-grey-900"
              strokeWidth={2}
              aria-hidden
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-beige-500 bg-white px-4 py-3 text-preset-4 text-grey-900 outline-none transition-colors focus:border-grey-900"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Sort transactions</span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as TransactionSortOption)
              }
              className="w-full rounded-lg border border-beige-500 bg-white px-4 py-3 text-preset-4 text-grey-900 outline-none transition-colors focus:border-grey-900"
              aria-label="Sort transactions"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-beige-100">
        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.8fr)_minmax(120px,0.8fr)_minmax(100px,0.6fr)] gap-4 bg-beige-100 px-6 py-3 text-preset-5 text-grey-500">
          <span>Merchant</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>
        {visibleTransactions.length > 0 ? (
          <ul className="divide-y divide-beige-100" aria-label="Transactions">
            {visibleTransactions.map((tx, index) => {
              const isPositive = tx.amount >= 0;
              return (
                <li
                  key={`${tx.name}-${tx.date}-${index}`}
                  className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.8fr)_minmax(120px,0.8fr)_minmax(100px,0.6fr)] items-center gap-4 px-6 py-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <TransactionAvatar tx={tx} />
                    <p className="truncate text-preset-4-bold text-grey-900">
                      {tx.name}
                    </p>
                  </div>
                  <p className="text-preset-5 text-grey-500">{tx.category}</p>
                  <p className="text-preset-5 text-grey-500">
                    {formatTransactionDate(tx.date)}
                  </p>
                  <p
                    className={`text-right text-preset-4-bold tabular-nums ${
                      isPositive ? "text-secondary-green" : "text-grey-900"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(tx.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-6 py-10 text-center text-preset-4 text-grey-500">
            No transactions match your filters.
          </p>
        )}
      </div>
    </Card>
  );
}
