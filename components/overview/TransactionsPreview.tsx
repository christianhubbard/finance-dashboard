import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import type { Transaction } from "@/lib/types";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

type TransactionsPreviewProps = {
  transactions: Transaction[];
};

export function TransactionsPreview({ transactions }: TransactionsPreviewProps) {
  return (
    <section className="rounded-2xl bg-white px-6 py-6">
      <h2 className="text-preset-2 text-grey-900">Transactions</h2>
      <ul className="mt-8 flex flex-col" aria-label="Recent transactions">
        {transactions.map((tx, i) => {
          const isPositive = tx.amount >= 0;
          return (
            <li
              key={`${tx.name}-${tx.date}-${i}`}
              className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0"
            >
              <TransactionAvatar tx={tx} />
              <div className="min-w-0 flex-1">
                <p className="text-preset-4-bold text-grey-900 truncate">
                  {tx.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-preset-5 text-grey-500">
                  <span>{tx.category}</span>
                  <span aria-hidden>•</span>
                  <span>{formatDisplayDate(tx.date)}</span>
                </div>
              </div>
              <p
                className={`text-preset-4-bold shrink-0 ${
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
    </section>
  );
}
