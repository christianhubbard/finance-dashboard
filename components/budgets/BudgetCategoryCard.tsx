import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TransactionAvatar } from "@/components/ui/TransactionAvatar";
import { getBudgetRemaining } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget, Transaction } from "@/lib/types";

type BudgetCategoryCardProps = {
  budget: Budget;
  transactions: Transaction[];
};

export function BudgetCategoryCard({
  budget,
  transactions,
}: BudgetCategoryCardProps) {
  const color = getThemeColor(budget.theme);
  const remaining = getBudgetRemaining(budget);
  const pct =
    budget.maximum > 0
      ? Math.min(100, (budget.spent / budget.maximum) * 100)
      : 0;

  return (
    <Card>
      <article aria-label={budget.category}>
        <div className="flex items-center gap-4">
          <span
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <h2 className="text-preset-2 text-grey-900">{budget.category}</h2>
        </div>

        <p className="mt-5 text-preset-4 text-grey-500">
          Maximum of {formatCurrency(budget.maximum)}
        </p>
        <div
          className="mt-4 h-8 overflow-hidden rounded-sm bg-beige-100 p-1"
          role="progressbar"
          aria-label={`${budget.category} spent`}
          aria-valuemin={0}
          aria-valuemax={budget.maximum}
          aria-valuenow={budget.spent}
        >
          <div
            className="h-full rounded-sm"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-4">
          <div className="flex gap-4">
            <span
              className="w-1 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <div>
              <dt className="text-preset-5 text-grey-500">Limit</dt>
              <dd className="mt-1 text-preset-4-bold text-grey-900">
                {formatCurrency(budget.maximum)}
              </dd>
            </div>
          </div>
          <div className="flex gap-4">
            <span
              className="w-1 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <div>
              <dt className="text-preset-5 text-grey-500">Spent</dt>
              <dd className="mt-1 text-preset-4-bold text-grey-900">
                {formatCurrency(budget.spent)}
              </dd>
            </div>
          </div>
          <div className="flex gap-4">
            <span
              className="w-1 shrink-0 rounded-full bg-beige-100"
              aria-hidden
            />
            <div>
              <dt className="text-preset-5 text-grey-500">Remaining</dt>
              <dd className="mt-1 text-preset-4-bold text-grey-900">
                {formatCurrency(remaining)}
              </dd>
            </div>
          </div>
        </dl>

        <section className="mt-5 rounded-xl bg-beige-100 p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-preset-3 text-grey-900">Latest Spending</h3>
            <Link
              href="/transactions"
              className="text-preset-4 font-medium text-grey-500 underline-offset-4 hover:text-grey-900 hover:underline"
            >
              See All
            </Link>
          </div>
          {transactions.length === 0 ? (
            <p className="mt-5 text-preset-4 text-grey-500">
              No recent transactions in this category.
            </p>
          ) : (
            <ul
              className="mt-5 flex flex-col"
              aria-label={`Latest ${budget.category} transactions`}
            >
              {transactions.map((tx, i) => (
                <li
                  key={`${tx.name}-${tx.date}-${i}`}
                  className="flex items-center gap-4 border-b border-grey-500/15 py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <TransactionAvatar tx={tx} className="size-8 text-preset-4-bold" />
                  <p className="min-w-0 flex-1 truncate text-preset-5 font-bold text-grey-900">
                    {tx.name}
                  </p>
                  <div className="shrink-0 text-right">
                    <p className="text-preset-5 font-bold text-grey-900">
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="mt-1 text-preset-5 text-grey-500">
                      {formatDisplayDate(tx.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </Card>
  );
}
