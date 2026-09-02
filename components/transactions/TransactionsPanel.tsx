"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import {
  PAGE_SIZE,
  TRANSACTION_CATEGORIES,
  queryTransactions,
  type SortKey,
} from "@/lib/transactions";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "nameAsc", label: "A to Z" },
  { value: "nameDesc", label: "Z to A" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
];

const controlClass =
  "rounded-lg border border-beige-500 bg-white px-4 py-3 text-preset-4 text-grey-900 transition-colors hover:border-grey-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900";

function formatSignedAmount(amount: number): string {
  const formatted = formatCurrency(amount);
  return amount >= 0 ? `+${formatted}` : formatted;
}

function Amount({ amount }: { amount: number }) {
  const isPositive = amount >= 0;
  return (
    <p
      className={`text-preset-4-bold tabular-nums ${
        isPositive ? "text-secondary-green" : "text-grey-900"
      }`}
    >
      {formatSignedAmount(amount)}
    </p>
  );
}

type TransactionsPanelProps = {
  transactions: Transaction[];
};

export function TransactionsPanel({ transactions }: TransactionsPanelProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("latest");
  const [page, setPage] = useState(1);

  const result = useMemo(
    () =>
      queryTransactions(transactions, {
        search,
        category,
        sort,
        page,
        pageSize: PAGE_SIZE,
      }),
    [transactions, search, category, sort, page],
  );

  const setSearchAndReset = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const setCategoryAndReset = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const setSortAndReset = (value: SortKey) => {
    setSort(value);
    setPage(1);
  };

  return (
    <Card className="px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-[320px]">
          <label htmlFor="transaction-search" className="sr-only">
            Search transaction
          </label>
          <input
            id="transaction-search"
            type="search"
            value={search}
            onChange={(event) => setSearchAndReset(event.target.value)}
            placeholder="Search transaction"
            className={`${controlClass} w-full pr-11 placeholder:text-grey-500`}
          />
          <Search
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-grey-900"
            strokeWidth={2}
            aria-hidden
          />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-preset-4 text-grey-500">
            <span className="hidden sm:inline whitespace-nowrap">Sort by</span>
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(event) =>
                setSortAndReset(event.target.value as SortKey)
              }
              className={`${controlClass} min-w-[8.5rem]`}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-preset-4 text-grey-500">
            <span className="hidden sm:inline whitespace-nowrap">Category</span>
            <select
              aria-label="Category"
              value={category}
              onChange={(event) => setCategoryAndReset(event.target.value)}
              className={`${controlClass} min-w-[11rem]`}
            >
              <option value="all">All Transactions</option>
              {TRANSACTION_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {result.total === 0 ? (
        <p className="mt-10 text-preset-4 text-grey-500">
          No transactions match your search.
        </p>
      ) : (
        <>
          <div
            className="mt-6 hidden grid-cols-[minmax(0,2.2fr)_1fr_1.2fr_auto] gap-8 border-b border-grey-100 pb-3 text-preset-5 text-grey-500 lg:grid"
            aria-hidden
          >
            <span>Recipient / Sender</span>
            <span>Category</span>
            <span>Transaction Date</span>
            <span className="text-right">Amount</span>
          </div>

          <ul className="flex flex-col" aria-label="Transactions">
            {result.rows.map((tx, index) => (
              <li
                key={`${tx.name}-${tx.date}-${tx.amount}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-grey-100 py-4 last:border-b-0 lg:grid-cols-[minmax(0,2.2fr)_1fr_1.2fr_auto] lg:gap-8"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <TransactionAvatar tx={tx} />
                  <div className="min-w-0">
                    <p className="text-preset-4-bold truncate text-grey-900">
                      {tx.name}
                    </p>
                    <p className="mt-1 text-preset-5 text-grey-500 lg:hidden">
                      {tx.category}
                    </p>
                  </div>
                </div>
                <p className="hidden text-preset-5 text-grey-500 lg:block">
                  {tx.category}
                </p>
                <p className="hidden text-preset-5 text-grey-500 lg:block">
                  {formatDisplayDate(tx.date)}
                </p>
                <div className="text-right">
                  <Amount amount={tx.amount} />
                  <p className="mt-1 text-preset-5 text-grey-500 lg:hidden">
                    {formatDisplayDate(tx.date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {result.pageCount > 0 ? (
            <nav
              className="mt-6 flex items-center justify-between gap-3"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={result.page <= 1}
                className={`${controlClass} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
                Prev
              </button>

              <ol className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: result.pageCount }, (_, i) => i + 1).map(
                  (pageNumber) => {
                    const isCurrent = pageNumber === result.page;
                    return (
                      <li key={pageNumber}>
                        <button
                          type="button"
                          aria-label={`Page ${pageNumber}`}
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={() => setPage(pageNumber)}
                          className={`flex size-10 items-center justify-center rounded-lg text-preset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900 ${
                            isCurrent
                              ? "bg-grey-900 text-white"
                              : "border border-beige-500 bg-white text-grey-900 hover:bg-beige-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  },
                )}
              </ol>

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(result.pageCount, current + 1),
                  )
                }
                disabled={result.page >= result.pageCount}
                className={`${controlClass} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Next
                <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
              </button>
            </nav>
          ) : null}
        </>
      )}
    </Card>
  );
}
