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
      className={`text-preset-4-bold shrink-0 ${
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
      <div className="hidden items-center gap-4 md:flex">
        <div className="flex min-w-0 flex-[2] items-center gap-4">
          <TransactionAvatar tx={tx} />
          <p className="text-preset-4-bold truncate text-grey-900">{tx.name}</p>
        </div>
        <p className="flex-1 text-preset-4 text-grey-500">{tx.category}</p>
        <p className="flex-1 text-preset-4 text-grey-500">
          {formatDisplayDate(tx.date)}
        </p>
        <TransactionAmount amount={tx.amount} />
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <TransactionAvatar tx={tx} />
        <div className="min-w-0 flex-1">
          <p className="text-preset-4-bold truncate text-grey-900">{tx.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-preset-5 text-grey-500">
            <span>{tx.category}</span>
            <span aria-hidden>•</span>
            <span>{formatDisplayDate(tx.date)}</span>
          </div>
        </div>
        <TransactionAmount amount={tx.amount} />
      </div>
    </li>
  );
}
