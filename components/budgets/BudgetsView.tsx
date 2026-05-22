import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget, Transaction } from "@/lib/types";

type BudgetsViewProps = {
  budgets: Budget[];
  transactions: Transaction[];
};

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function formatTransactionAmount(amount: number): string {
  return `${amount >= 0 ? "+" : ""}${formatCurrency(amount)}`;
}

function getRecentBudgetTransactions(
  transactions: Transaction[],
  category: string,
  limit = 3,
): Transaction[] {
  return transactions
    .filter((tx) => tx.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

function getBudgetHeadingId(category: string): string {
  return `budget-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function BudgetsView({ budgets, transactions }: BudgetsViewProps) {
  const spentTotal = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const limitTotal = budgets.reduce((sum, budget) => sum + budget.maximum, 0);
  const remainingTotal = limitTotal - spentTotal;

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
          Budgets
        </h1>
        <p className="max-w-2xl text-preset-4 text-grey-500">
          Track category limits, spending progress, and recent transactions by
          budget.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)] lg:items-start">
        <Card className="lg:sticky lg:top-8">
          <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="relative flex items-center justify-center">
              <DonutChart budgets={budgets} size={260} strokeWidth={36} />
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                <p className="text-preset-5 text-grey-500">Spent</p>
                <p className="text-preset-1 font-bold tracking-tight text-grey-900">
                  {formatCurrency(spentTotal)}
                </p>
                <p className="mt-1 text-preset-5 text-grey-500">
                  of {formatCurrency(limitTotal)}
                </p>
              </div>
            </div>

            <dl className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-xl bg-beige-100/60 px-4 py-3">
                <dt className="text-preset-5 text-grey-500">Total Limit</dt>
                <dd className="mt-1 text-preset-3 text-grey-900">
                  {formatCurrency(limitTotal)}
                </dd>
              </div>
              <div className="rounded-xl bg-beige-100/60 px-4 py-3">
                <dt className="text-preset-5 text-grey-500">Remaining</dt>
                <dd
                  className={`mt-1 text-preset-3 ${
                    remainingTotal >= 0
                      ? "text-secondary-green"
                      : "text-secondary-red"
                  }`}
                >
                  {remainingTotal >= 0
                    ? formatCurrency(remainingTotal)
                    : `${formatCurrency(Math.abs(remainingTotal))} over`}
                </dd>
              </div>
            </dl>

            <ul className="flex w-full flex-col gap-4" aria-label="Budget totals">
              {budgets.map((budget) => (
                <li
                  key={budget.category}
                  className="flex items-center justify-between gap-4 border-b border-beige-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: getThemeColor(budget.theme) }}
                      aria-hidden
                    />
                    <span className="text-preset-4 text-grey-500">
                      {budget.category}
                    </span>
                  </div>
                  <span className="text-preset-4-bold text-grey-900">
                    {formatCurrency(budget.spent)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          {budgets.map((budget) => {
            const remaining = budget.maximum - budget.spent;
            const progress =
              budget.maximum > 0
                ? Math.min(100, (budget.spent / budget.maximum) * 100)
                : 0;
            const budgetColor = getThemeColor(budget.theme);
            const recentTransactions = getRecentBudgetTransactions(
              transactions,
              budget.category,
            );
            const headingId = getBudgetHeadingId(budget.category);

            return (
              <Card key={budget.category} className="overflow-hidden">
                <section aria-labelledby={headingId}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="size-4 shrink-0 rounded-full"
                        style={{ backgroundColor: budgetColor }}
                        aria-hidden
                      />
                      <div>
                        <h2
                          id={headingId}
                          className="text-preset-2 text-grey-900"
                        >
                          {budget.category}
                        </h2>
                        <p className="mt-1 text-preset-4 text-grey-500">
                          Maximum of {formatCurrency(budget.maximum)}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-preset-3 ${
                        remaining >= 0
                          ? "text-secondary-green"
                          : "text-secondary-red"
                      }`}
                    >
                      {remaining >= 0
                        ? `${formatCurrency(remaining)} remaining`
                        : `${formatCurrency(Math.abs(remaining))} over budget`}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="h-3 overflow-hidden rounded-full bg-beige-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: budgetColor,
                        }}
                      />
                    </div>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-beige-100/60 px-4 py-3">
                        <dt className="text-preset-5 text-grey-500">Limit</dt>
                        <dd className="mt-1 text-preset-3 text-grey-900">
                          {formatCurrency(budget.maximum)}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-beige-100/60 px-4 py-3">
                        <dt className="text-preset-5 text-grey-500">Spent</dt>
                        <dd className="mt-1 text-preset-3 text-grey-900">
                          {formatCurrency(budget.spent)}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-beige-100/60 px-4 py-3">
                        <dt className="text-preset-5 text-grey-500">
                          Remaining
                        </dt>
                        <dd
                          className={`mt-1 text-preset-3 ${
                            remaining >= 0
                              ? "text-secondary-green"
                              : "text-secondary-red"
                          }`}
                        >
                          {remaining >= 0
                            ? formatCurrency(remaining)
                            : `-${formatCurrency(Math.abs(remaining))}`}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-8 rounded-xl bg-beige-100/60 px-4 py-4">
                    <h3 className="text-preset-3 text-grey-900">
                      Recent Transactions
                    </h3>
                    {recentTransactions.length > 0 ? (
                      <ul
                        className="mt-3 flex flex-col"
                        aria-label={`${budget.category} recent transactions`}
                      >
                        {recentTransactions.map((tx, index) => (
                          <li
                            key={`${tx.name}-${tx.date}-${index}`}
                            className="flex items-center justify-between gap-4 border-b border-white py-3 last:border-b-0"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-preset-4-bold text-grey-900">
                                {tx.name}
                              </p>
                              <p className="mt-1 text-preset-5 text-grey-500">
                                {formatDisplayDate(tx.date)}
                              </p>
                            </div>
                            <p
                              className={`shrink-0 text-preset-4-bold ${
                                tx.amount >= 0
                                  ? "text-secondary-green"
                                  : "text-grey-900"
                              }`}
                            >
                              {formatTransactionAmount(tx.amount)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-preset-4 text-grey-500">
                        No recent transactions for this budget.
                      </p>
                    )}
                  </div>
                </section>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
