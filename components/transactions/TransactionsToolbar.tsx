"use client";

import { Search } from "lucide-react";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_SORT_OPTIONS,
  type TransactionCategory,
  type TransactionSort,
} from "@/lib/transactions";

type TransactionsToolbarProps = {
  search: string;
  category: TransactionCategory;
  sort: TransactionSort;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: TransactionCategory) => void;
  onSortChange: (value: TransactionSort) => void;
};

const selectClassName =
  "h-11 min-w-0 rounded-lg border border-beige-100 bg-white px-4 text-preset-4 text-grey-900 outline-none transition-colors hover:border-grey-300 focus:border-grey-900 focus:ring-2 focus:ring-grey-900/10";

export function TransactionsToolbar({
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative block w-full lg:max-w-[320px]">
        <span className="sr-only">Search transaction</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-grey-500"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transaction"
          className="h-11 w-full rounded-lg border border-beige-100 bg-white py-2 pl-11 pr-4 text-preset-4 text-grey-900 outline-none transition-colors placeholder:text-grey-500 hover:border-grey-300 focus:border-grey-900 focus:ring-2 focus:ring-grey-900/10"
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-preset-4 text-grey-500">Sort by</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as TransactionSort)}
            className={selectClassName}
            aria-label="Sort transactions"
          >
            {TRANSACTION_SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-preset-4 text-grey-500">Category</span>
          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as TransactionCategory)
            }
            className={selectClassName}
            aria-label="Filter by category"
          >
            {TRANSACTION_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
