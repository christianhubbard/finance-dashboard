import type { Metadata } from "next";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import { getFinanceData } from "@/lib/data";

export const metadata: Metadata = {
  title: "finance — Transactions",
};

export default function TransactionsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:pb-16 md:pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Transactions
      </h1>
      <div className="mt-6">
        <TransactionsView transactions={data.transactions} />
      </div>
    </main>
  );
}
