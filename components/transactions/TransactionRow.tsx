import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import type { Transaction } from "@/lib/types";

type TransactionRowProps = {
  tx: Transaction;
};

function TransactionAmount({ amount }: { amount: number }) {
  const isPositive = amount >= 0;
  return (
    <p
      className={`text-preset-4-bold ${
        isPositive ? "text-secondary-green" : "text-grey-900"
      }`}
    >
      {isPositive ? "+" : ""}
      {formatCurrency(amount)}
    </p>
  );
}

export function TransactionRow({ tx }: TransactionRowProps) {
  return (
    <li className="border-b border-beige-100 py-4 last:border-b-0">
      <div className="hidden items-center gap-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 items-center gap-4">
          <TransactionAvatar tx={tx} />
          <p className="truncate text-preset-4-bold text-grey-900">{tx.name}</p>
        </div>
        <p className="text-preset-4 text-grey-500">{tx.category}</p>
        <p className="text-preset-4 text-grey-500">{formatDisplayDate(tx.date)}</p>
        <div className="text-right">
          <TransactionAmount amount={tx.amount} />
        </div>
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <TransactionAvatar tx={tx} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-preset-4-bold text-grey-900">{tx.name}</p>
          <p className="mt-1 text-preset-5 text-grey-500">{tx.category}</p>
        </div>
        <div className="shrink-0 text-right">
          <TransactionAmount amount={tx.amount} />
          <p className="mt-1 text-preset-5 text-grey-500">
            {formatDisplayDate(tx.date)}
          </p>
        </div>
      </div>
    </li>
  );
}
