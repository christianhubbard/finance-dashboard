import { TransactionRow } from "@/components/ui/TransactionRow";
import type { Transaction } from "@/lib/types";

type TransactionsPreviewProps = {
  transactions: Transaction[];
};

export function TransactionsPreview({ transactions }: TransactionsPreviewProps) {
  return (
    <section className="rounded-2xl bg-white px-6 py-6">
      <h2 className="text-preset-2 text-grey-900">Transactions</h2>
      <ul className="mt-8 flex flex-col" aria-label="Recent transactions">
        {transactions.map((tx, i) => (
          <li
            key={`${tx.name}-${tx.date}-${i}`}
            className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0"
          >
            <TransactionRow tx={tx} />
          </li>
        ))}
      </ul>
    </section>
  );
}
