import { Card } from "@/components/ui/Card";
import { TransactionAvatar } from "@/components/ui/TransactionAvatar";
import { getThemeColor } from "@/lib/theme";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import type { Budget, Transaction } from "@/lib/types";

type BudgetCardProps = {
  budget: Budget;
  latestSpending: Transaction[];
};

export function BudgetCard({ budget, latestSpending }: BudgetCardProps) {
  const color = getThemeColor(budget.theme);
  const remaining = Math.max(0, budget.maximum - budget.spent);
  const progress = budget.maximum > 0 ? Math.min(1, budget.spent / budget.maximum) : 0;

  return (
    <Card className="px-5 py-6 sm:px-8 sm:py-8">
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

      <div className="mt-4 h-8 w-full rounded-lg bg-beige-100 p-1">
        <div
          className="h-full rounded"
          style={{ backgroundColor: color, width: `${progress * 100}%` }}
          role="progressbar"
          aria-label={`${budget.category} budget used`}
          aria-valuemin={0}
          aria-valuemax={budget.maximum}
          aria-valuenow={Math.min(budget.spent, budget.maximum)}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4">
          <span
            className="h-11 w-1 shrink-0 rounded-full"
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
        <div className="flex items-center gap-4">
          <span
            className="h-11 w-1 shrink-0 rounded-full bg-beige-100"
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

      {latestSpending.length > 0 ? (
        <section className="mt-5 rounded-xl bg-beige-100 p-4 sm:p-5">
          <h3 className="text-preset-3 text-grey-900">Latest Spending</h3>
          <ul className="mt-2 flex flex-col">
            {latestSpending.map((tx, i) => (
              <li
                key={`${tx.name}-${tx.date}-${i}`}
                className="flex items-center gap-3 border-b border-grey-500/15 py-3 last:border-b-0 last:pb-0"
              >
                <div className="hidden sm:block">
                  <TransactionAvatar tx={tx} size="sm" />
                </div>
                <p className="min-w-0 flex-1 truncate text-preset-5 font-bold text-grey-900">
                  {tx.name}
                </p>
                <div className="shrink-0 text-right">
                  <p className="text-preset-5 font-bold text-grey-900">
                    {tx.amount >= 0 ? "+" : ""}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="mt-1 text-preset-5 text-grey-500">
                    {formatDisplayDate(tx.date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Card>
  );
}
