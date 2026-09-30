"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import {
  ALL_CATEGORIES,
  SORT_OPTIONS,
  TRANSACTION_CATEGORIES,
  queryTransactions,
  type SortOption,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900";

const fieldClass = `rounded-lg border border-beige-500 bg-white text-preset-4 text-grey-900 transition-colors hover:border-grey-500 ${focusRing}`;

const pageButtonClass = `flex h-10 min-w-10 items-center justify-center rounded-lg border text-preset-4 transition-colors ${focusRing}`;

const stepButtonClass = `${pageButtonClass} gap-4 border-beige-500 px-4 text-grey-900 hover:bg-beige-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-grey-900`;

const rowGrid =
  "lg:grid lg:grid-cols-[2.5rem_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4";

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function SelectField({ id, label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="shrink-0 text-preset-4 text-grey-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldClass} cursor-pointer appearance-none py-3 pl-5 pr-11`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-grey-900"
          strokeWidth={2}
          aria-hidden
        />
      </div>
    </div>
  );
}

type TransactionsViewProps = {
  transactions: Transaction[];
};

export function TransactionsView({ transactions }: TransactionsViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [sort, setSort] = useState<SortOption>("Latest");
  const [page, setPage] = useState(1);

  const result = useMemo(
    () => queryTransactions(transactions, { search, category, sort, page }),
    [transactions, search, category, sort, page],
  );
  const pages = Array.from({ length: result.pageCount }, (_, i) => i + 1);

  return (
    <section className="rounded-2xl bg-white px-5 py-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="relative min-w-0 max-w-80 flex-1 basis-60">
          <label htmlFor="transactions-search" className="sr-only">
            Search transaction
          </label>
          <input
            id="transactions-search"
            type="search"
            placeholder="Search transaction"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={`${fieldClass} w-full py-3 pl-5 pr-12 placeholder:text-beige-500 [&::-webkit-search-cancel-button]:appearance-none`}
          />
          <Search
            className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-grey-900"
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <SelectField
            id="transactions-sort"
            label="Sort by"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(value) => {
              setSort(value as SortOption);
              setPage(1);
            }}
          />
          <SelectField
            id="transactions-category"
            label="Category"
            value={category}
            options={TRANSACTION_CATEGORIES}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {result.items.length === 0 ? (
        <p role="status" className="mt-6 py-10 text-center text-preset-4 text-grey-500">
          No transactions match your search.
        </p>
      ) : (
        <>
          <div
            className={`mt-6 hidden border-b border-beige-100 pb-3 text-preset-5 text-grey-500 ${rowGrid}`}
          >
            <span className="col-span-2">Recipient / Sender</span>
            <span>Category</span>
            <span>Transaction Date</span>
            <span className="text-right">Amount</span>
          </div>
          <ul className="mt-2 flex flex-col lg:mt-0" aria-label="Transactions">
            {result.items.map((tx, i) => {
              const isPositive = tx.amount >= 0;
              return (
                <li
                  key={`${tx.name}-${tx.date}-${i}`}
                  className={`flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0 ${rowGrid}`}
                >
                  <TransactionAvatar tx={tx} />
                  {/* lg:contents lifts name, category, and date into the row grid as columns. */}
                  <div className="min-w-0 flex-1 lg:contents">
                    <p className="truncate text-preset-4-bold text-grey-900">
                      {tx.name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-preset-5 text-grey-500 lg:contents">
                      <span className="lg:truncate">{tx.category}</span>
                      <span aria-hidden className="lg:hidden">
                        •
                      </span>
                      <span>{formatDisplayDate(tx.date)}</span>
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-right text-preset-4-bold ${
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

          <nav
            aria-label="Pagination"
            className="mt-6 flex items-center justify-between gap-4"
          >
            <button
              type="button"
              onClick={() => setPage(result.page - 1)}
              disabled={result.page === 1}
              className={stepButtonClass}
            >
              <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
              Prev
            </button>
            <ol className="flex flex-wrap items-center justify-center gap-2">
              {pages.map((n) => {
                const isCurrent = n === result.page;
                return (
                  <li key={n}>
                    <button
                      type="button"
                      onClick={() => setPage(n)}
                      aria-label={`Page ${n}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`${pageButtonClass} ${
                        isCurrent
                          ? "border-grey-900 bg-grey-900 text-white"
                          : "border-beige-500 text-grey-900 hover:bg-beige-500 hover:text-white"
                      }`}
                    >
                      {n}
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              onClick={() => setPage(result.page + 1)}
              disabled={result.page === result.pageCount}
              className={stepButtonClass}
            >
              Next
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
