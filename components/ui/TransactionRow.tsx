import { getThemeColor } from "@/lib/theme";
import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const AVATAR_ACCENTS: Record<string, string> = {
  emma: "var(--color-secondary-cyan)",
  urban: "var(--color-secondary-green)",
  savory: "var(--color-secondary-yellow)",
  floral: "var(--color-secondary-purple)",
  spark: "var(--color-secondary-yellow)",
  ledger: "var(--color-secondary-navy)",
  trail: "var(--color-extended-brown)",
  north: "var(--color-extended-blue)",
  ember: "var(--color-extended-orange)",
  water: "var(--color-secondary-cyan)",
  net: "var(--color-extended-magenta)",
};

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

type TransactionAvatarProps = {
  tx: Transaction;
  size?: "md" | "sm";
};

export function TransactionAvatar({ tx, size = "md" }: TransactionAvatarProps) {
  const accent = AVATAR_ACCENTS[tx.avatar] ?? getThemeColor("navy");
  const initial = tx.name.trim().charAt(0).toUpperCase();
  const sizeClass =
    size === "sm" ? "size-8 text-preset-5" : "size-10 text-preset-3";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizeClass}`}
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

type TransactionRowProps = {
  tx: Transaction;
};

export function TransactionRow({ tx }: TransactionRowProps) {
  const isPositive = tx.amount >= 0;

  return (
    <>
      <TransactionAvatar tx={tx} />
      <div className="min-w-0 flex-1">
        <p className="text-preset-4-bold text-grey-900 truncate">{tx.name}</p>
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
    </>
  );
}

type CompactTransactionRowProps = {
  tx: Transaction;
};

export function CompactTransactionRow({ tx }: CompactTransactionRowProps) {
  const isPositive = tx.amount >= 0;

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <TransactionAvatar tx={tx} size="sm" />
        <p className="text-preset-5 font-bold text-grey-900 truncate">
          {tx.name}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-preset-5">
        <p className="font-bold text-grey-900">
          {isPositive ? "+" : ""}
          {formatCurrency(tx.amount)}
        </p>
        <p className="text-grey-500">{formatDisplayDate(tx.date)}</p>
      </div>
    </>
  );
}
