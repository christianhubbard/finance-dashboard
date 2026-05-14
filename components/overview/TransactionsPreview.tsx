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

function TransactionAvatar({ tx }: { tx: Transaction }) {
  const accent = AVATAR_ACCENTS[tx.avatar] ?? getThemeColor("navy");
  const initial = tx.name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-preset-3 font-bold text-white"
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

type TransactionsPreviewProps = {
  transactions: Transaction[];
};

export function TransactionsPreview({ transactions }: TransactionsPreviewProps) {
  return (
    <section className="rounded-2xl bg-white px-6 py-6 dark:bg-[#1b1913]">
      <h2 className="text-preset-2 text-grey-900 dark:text-grey-100">Transactions</h2>
      <ul className="mt-8 flex flex-col" aria-label="Recent transactions">
        {transactions.map((tx, i) => {
          const isPositive = tx.amount >= 0;
          return (
            <li
              key={`${tx.name}-${tx.date}-${i}`}
              className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0 dark:border-white/10"
            >
              <TransactionAvatar tx={tx} />
              <div className="min-w-0 flex-1">
                <p className="text-preset-4-bold text-grey-900 truncate dark:text-grey-100">
                  {tx.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-preset-5 text-grey-500 dark:text-grey-300">
                  <span>{tx.category}</span>
                  <span aria-hidden>•</span>
                  <span>{formatDisplayDate(tx.date)}</span>
                </div>
              </div>
              <p
                className={`text-preset-4-bold shrink-0 ${
                  isPositive ? "text-secondary-green" : "text-grey-900 dark:text-grey-100"
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
