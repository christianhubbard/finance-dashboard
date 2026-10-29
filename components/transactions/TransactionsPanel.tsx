"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import {
  SORT_OPTIONS,
  TRANSACTION_CATEGORIES,
  queryTransactions,
  type TransactionSort,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const controlClass =
  "rounded-lg border border-beige-500 bg-white px-3 py-2 text-preset-4 text-grey-900 hover:border-grey-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-900";

function signedAmount(amount: number): string {
  const formatted = formatCurrency(Math.abs(amount));
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}

function Amount({ amount }: { amount: number }) {
  const positive = amount > 0;
  return (
    <span
      className={`text-preset-4-bold tabular-nums ${
        positive ? "text-secondary-green" : "text-grey-900"
      }`}
    >
      {signedAmount(amount)}
    </span>
  );
}

function TransactionCells({ tx }: { tx: Transaction }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <TransactionAvatar tx={tx} />
      <p className="text-preset-4-bold truncate text-grey-900">{tx.name}</p>
    </div>
  );
}

export function TransactionsPanel({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All Transactions");
  const [sort, setSort] = useState<TransactionSort>("latest");
  const [page, setPage] = useState(1);

  const result = useMemo(
    () => queryTransactions(transactions, { search, category, sort, page }),
    [transactions, search, category, sort, page],
  );

  const pages = Array.from({ length: result.totalPages }, (_, i) => i + 1);

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search transaction</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-500"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            placeholder="Search transaction"
            aria-label="Search transaction"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={`${controlClass} w-full pl-10`}
          />
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-preset-4 text-grey-500">
            Sort by
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as TransactionSort);
                setPage(1);
              }}
              className={controlClass}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-preset-4 text-grey-500">
            Category
            <select
              aria-label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className={controlClass}
            >
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {result.total === 0 ? (
        <p className="mt-8 text-preset-4 text-grey-500">
          No transactions match your search.
        </p>
      ) : (
        <>
          <ul className="mt-6 flex flex-col md:hidden" aria-label="Transactions">
            {result.items.map((tx, i) => (
              <li
                key={`${tx.name}-${tx.date}-${tx.amount}-${i}`}
                className="flex items-center justify-between gap-4 border-b border-beige-100 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <TransactionCells tx={tx} />
                  <p className="mt-1 pl-14 text-preset-5 text-grey-500">
                    {tx.category}
                    <span aria-hidden> • </span>
                    {formatDisplayDate(tx.date)}
                  </p>
                </div>
                <Amount amount={tx.amount} />
              </li>
            ))}
          </ul>

          <table className="mt-6 hidden w-full md:table">
            <caption className="sr-only">Transactions</caption>
            <thead>
              <tr className="border-b border-beige-100 text-left text-preset-5 text-grey-500">
                <th className="pb-3 font-normal">Recipient / Sender</th>
                <th className="pb-3 font-normal">Category</th>
                <th className="pb-3 font-normal">Transaction Date</th>
                <th className="pb-3 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((tx, i) => (
                <tr
                  key={`${tx.name}-${tx.date}-${tx.amount}-${i}`}
                  className="border-b border-beige-100 last:border-b-0"
                >
                  <td className="py-4 pr-4">
                    <TransactionCells tx={tx} />
                  </td>
                  <td className="py-4 text-preset-5 text-grey-500">{tx.category}</td>
                  <td className="py-4 text-preset-5 text-grey-500">
                    {formatDisplayDate(tx.date)}
                  </td>
                  <td className="py-4 text-right">
                    <Amount amount={tx.amount} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <nav
        className="mt-6 flex flex-wrap items-center justify-between gap-3"
        aria-label="Pagination"
      >
        <button
          type="button"
          className={`${controlClass} disabled:cursor-not-allowed disabled:opacity-40`}
          disabled={result.page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <div className="flex flex-wrap gap-2">
          {pages.map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Page ${n}`}
              aria-current={n === result.page ? "page" : undefined}
              className={`${controlClass} min-w-10 ${
                n === result.page ? "bg-grey-900 text-white hover:border-grey-900" : ""
              }`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`${controlClass} disabled:cursor-not-allowed disabled:opacity-40`}
          disabled={result.page >= result.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </nav>
    </Card>
  );
}
