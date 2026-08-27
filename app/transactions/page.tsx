import type { Metadata } from "next";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import { getFinanceData } from "@/lib/data";

export const metadata: Metadata = {
  title: "finance — Transactions",
  description: "Search, filter, and sort personal finance transactions",
};

export default function TransactionsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Transactions
      </h1>
      <div className="mt-8">
        <TransactionsView transactions={data.transactions} />
      </div>
    </main>
  );
}
