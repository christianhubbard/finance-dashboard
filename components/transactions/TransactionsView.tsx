"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TransactionAvatar } from "@/components/ui/TransactionAvatar";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import {
  ALL_CATEGORIES,
  filterTransactions,
  getCategoryOptions,
  pageCount,
  paginate,
  SORT_OPTIONS,
  sortTransactions,
  type SortOption,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const PAGE_SIZE = 8;

const selectClassName =
  "h-11 rounded-lg border border-beige-500 bg-white px-3 text-preset-4 text-grey-900 outline-none focus:border-grey-900";

type TransactionsViewProps = {
  transactions: Transaction[];
};

export function TransactionsView({ transactions }: TransactionsViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [sort, setSort] = useState<SortOption>("Latest");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => getCategoryOptions(transactions),
    [transactions],
  );

  const visible = useMemo(
    () => sortTransactions(filterTransactions(transactions, search, category), sort),
    [transactions, search, category, sort],
  );

  const totalPages = pageCount(visible.length, PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const pageItems = paginate(visible, currentPage, PAGE_SIZE);

  return (
    <Card className="px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <label className="relative min-w-0 flex-1 basis-52">
          <span className="sr-only">Search transaction</span>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search transaction"
            className="h-11 w-full rounded-lg border border-beige-500 bg-white pl-4 pr-10 text-preset-4 text-grey-900 outline-none placeholder:text-beige-500 focus:border-grey-900"
          />
          <Search
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-grey-900"
            strokeWidth={2}
            aria-hidden
          />
        </label>
        <div className="flex shrink-0 items-center gap-2">
          <label
            htmlFor="tx-sort"
            className="hidden text-preset-4 text-grey-500 sm:block"
          >
            Sort by
          </label>
          <select
            id="tx-sort"
            aria-label="Sort by"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(1);
            }}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <label
            htmlFor="tx-category"
            className="hidden text-preset-4 text-grey-500 sm:block"
          >
            Category
          </label>
          <select
            id="tx-category"
            aria-label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className={selectClassName}
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="mt-6 hidden items-center gap-4 border-b border-grey-100 pb-3 text-preset-5 text-grey-500 md:flex"
        aria-hidden
      >
        <span className="min-w-0 flex-1">Recipient / Sender</span>
        <span className="w-32 shrink-0">Category</span>
        <span className="w-32 shrink-0">Transaction Date</span>
        <span className="w-28 shrink-0 text-right">Amount</span>
      </div>

      {pageItems.length > 0 ? (
        <ul className="flex flex-col" aria-label="Transactions">
          {pageItems.map((tx, i) => {
            const isPositive = tx.amount >= 0;
            return (
              <li
                key={`${tx.name}-${tx.date}-${i}`}
                className="flex items-center gap-4 border-b border-grey-100 py-4 last:border-b-0"
              >
                <TransactionAvatar tx={tx} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-preset-4-bold text-grey-900">
                    {tx.name}
                  </p>
                  <p className="mt-1 text-preset-5 text-grey-500 md:hidden">
                    {tx.category}
                  </p>
                </div>
                <p className="hidden w-32 shrink-0 text-preset-5 text-grey-500 md:block">
                  {tx.category}
                </p>
                <p className="hidden w-32 shrink-0 text-preset-5 text-grey-500 md:block">
                  {formatDisplayDate(tx.date)}
                </p>
                <div className="w-24 shrink-0 text-right md:w-28">
                  <p
                    className={`text-preset-4-bold ${
                      isPositive ? "text-secondary-green" : "text-grey-900"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="mt-1 text-preset-5 text-grey-500 md:hidden">
                    {formatDisplayDate(tx.date)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-12 text-center text-preset-4 text-grey-500">
          No transactions match your search.
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="flex h-10 items-center gap-2 rounded-lg border border-beige-500 px-3 text-preset-4 text-grey-900 transition-colors hover:bg-beige-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
        >
          <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
          <span className="hidden sm:block">Prev</span>
        </button>
        <div className="flex items-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === currentPage ? "page" : undefined}
              className={`size-10 rounded-lg border text-preset-4 transition-colors ${
                n === currentPage
                  ? "border-grey-900 bg-grey-900 text-white"
                  : "border-beige-500 text-grey-900 hover:bg-beige-100"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="flex h-10 items-center gap-2 rounded-lg border border-beige-500 px-3 text-preset-4 text-grey-900 transition-colors hover:bg-beige-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
        >
          <span className="hidden sm:block">Next</span>
          <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </Card>
  );
}
