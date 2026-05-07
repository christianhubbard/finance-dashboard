import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget, Transaction } from "@/lib/types";

type BudgetsPageContentProps = {
  budgets: Budget[];
  transactions: Transaction[];
};

function formatDisplayDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getRecentTransactions(
  transactions: Transaction[],
  category: string,
): Transaction[] {
  return transactions
    .filter((transaction) => transaction.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-beige-100/60 px-4 py-4">
      <p className="text-preset-5 text-grey-500">{label}</p>
      <p className="mt-1 text-preset-3 font-bold text-grey-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function BudgetCategoryCard({
  budget,
  transactions,
}: {
  budget: Budget;
  transactions: Transaction[];
}) {
  const remaining = budget.maximum - budget.spent;
  const progress =
    budget.maximum > 0
      ? Math.min(Math.round((budget.spent / budget.maximum) * 100), 100)
      : 0;
  const themeColor = getThemeColor(budget.theme);
  const recentTransactions = getRecentTransactions(
    transactions,
    budget.category,
  );

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: themeColor }}
            aria-hidden
          />
          <h2 className="text-preset-2 text-grey-900">{budget.category}</h2>
        </div>
        <p className="shrink-0 text-preset-4 text-grey-500">
          {formatCurrency(budget.maximum)} limit
        </p>
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-preset-5 text-grey-500">Spent</p>
            <p className="text-preset-1 font-bold tracking-tight text-grey-900 tabular-nums">
              {formatCurrency(budget.spent)}
            </p>
          </div>
          <p
            className={`pb-1 text-preset-4-bold ${
              remaining >= 0 ? "text-secondary-green" : "text-secondary-red"
            }`}
          >
            {formatCurrency(Math.abs(remaining))}{" "}
            {remaining >= 0 ? "remaining" : "over budget"}
          </p>
        </div>

        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-beige-100"
          role="meter"
          aria-label={`${budget.category} budget progress`}
          aria-valuemin={0}
          aria-valuemax={budget.maximum}
          aria-valuenow={Math.min(budget.spent, budget.maximum)}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: themeColor }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-beige-100 px-4 py-4">
        <h3 className="text-preset-3 text-grey-900">Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <ul
            className="mt-3 flex flex-col"
            aria-label={`${budget.category} recent transactions`}
          >
            {recentTransactions.map((transaction, index) => {
              const isPositive = transaction.amount >= 0;

              return (
                <li
                  key={`${transaction.name}-${transaction.date}-${index}`}
                  className="flex items-center justify-between gap-4 border-b border-beige-100 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-preset-4-bold text-grey-900">
                      {transaction.name}
                    </p>
                    <p className="mt-1 text-preset-5 text-grey-500">
                      {formatDisplayDate(transaction.date)}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-preset-4-bold tabular-nums ${
                      isPositive ? "text-secondary-green" : "text-grey-900"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-preset-4 text-grey-500">
            No recent transactions
          </p>
        )}
      </div>
    </Card>
  );
}

export function BudgetsPageContent({
  budgets,
  transactions,
}: BudgetsPageContentProps) {
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.maximum, 0);
  const totalRemaining = totalLimit - totalSpent;

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Budgets
      </h1>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)] xl:items-start">
        <Card className="xl:sticky xl:top-10">
          <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="relative flex items-center justify-center">
              <DonutChart budgets={budgets} size={260} strokeWidth={36} />
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                <p className="text-preset-5 text-grey-500">Spent</p>
                <p className="text-preset-1 font-bold tracking-tight text-grey-900 tabular-nums">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <SummaryMetric
                label="Total Limit"
                value={formatCurrency(totalLimit)}
              />
              <SummaryMetric
                label="Total Spent"
                value={formatCurrency(totalSpent)}
              />
              <SummaryMetric
                label="Remaining"
                value={formatCurrency(totalRemaining)}
              />
            </div>

            <ul className="flex w-full flex-col gap-3" aria-label="Budget mix">
              {budgets.map((budget) => (
                <li key={budget.category} className="flex items-center gap-3">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getThemeColor(budget.theme) }}
                    aria-hidden
                  />
                  <span className="text-preset-4 flex-1 text-grey-500">
                    {budget.category}
                  </span>
                  <span className="text-preset-4-bold text-grey-900 tabular-nums">
                    {formatCurrency(budget.spent)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <section
          className="grid gap-6 lg:grid-cols-2"
          aria-label="Budget categories"
        >
          {budgets.map((budget) => (
            <BudgetCategoryCard
              key={budget.category}
              budget={budget}
              transactions={transactions}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
