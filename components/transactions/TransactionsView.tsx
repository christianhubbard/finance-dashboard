"use client";

import { useState } from "react";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { TransactionsPagination } from "@/components/transactions/TransactionsPagination";
import { TransactionsToolbar } from "@/components/transactions/TransactionsToolbar";
import {
  ALL_TRANSACTIONS,
  DEFAULT_SORT,
  getTransactionsPage,
  type TransactionCategory,
  type TransactionSort,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

type TransactionsViewProps = {
  transactions: Transaction[];
};

export function TransactionsView({ transactions }: TransactionsViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TransactionCategory>(ALL_TRANSACTIONS);
  const [sort, setSort] = useState<TransactionSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const result = getTransactionsPage(transactions, {
    search,
    category,
    sort,
    page,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: TransactionCategory) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: TransactionSort) => {
    setSort(value);
    setPage(1);
  };

  return (
    <section className="rounded-2xl bg-white px-6 py-6">
      <TransactionsToolbar
        search={search}
        category={category}
        sort={sort}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      <div className="mt-6 hidden border-b border-beige-100 pb-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-4">
        <p className="text-preset-5 text-grey-500">Recipient / Sender</p>
        <p className="text-preset-5 text-grey-500">Category</p>
        <p className="text-preset-5 text-grey-500">Transaction Date</p>
        <p className="text-right text-preset-5 text-grey-500">Amount</p>
      </div>

      {result.items.length > 0 ? (
        <ul className="flex flex-col" aria-label="Transactions">
          {result.items.map((tx, index) => (
            <TransactionRow key={`${tx.name}-${tx.date}-${index}`} tx={tx} />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-preset-4 text-grey-500">
          No transactions match your filters.
        </p>
      )}

      <div className="mt-6">
        <TransactionsPagination
          page={result.page}
          totalPages={result.totalPages}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
