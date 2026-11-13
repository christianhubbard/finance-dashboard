import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import type { BudgetDetail } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Transaction } from "@/lib/types";

type BudgetsViewProps = {
  budgets: BudgetDetail[];
};

type BudgetCategoryCardProps = {
  budget: BudgetDetail;
};

function BudgetStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-secondary-green"
      : tone === "negative"
        ? "text-secondary-red"
        : "text-grey-900";

  return (
    <div>
      <dt className="text-preset-5 text-grey-500">{label}</dt>
      <dd className={`mt-1 text-preset-3 tabular-nums ${toneClass}`}>
        {value}
      </dd>
    </div>
  );
}

function TransactionRow({ tx, color }: { tx: Transaction; color: string }) {
  return (
    <li className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-preset-3 font-bold text-white"
        style={{ backgroundColor: color }}
        aria-hidden
      >
        {tx.name.trim().charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-preset-4-bold text-grey-900">{tx.name}</p>
        <p className="mt-1 text-preset-5 text-grey-500">
          {formatDisplayDate(tx.date)}
        </p>
      </div>
      <p
        className={`shrink-0 text-preset-4-bold tabular-nums ${
          tx.amount < 0 ? "text-grey-900" : "text-secondary-green"
        }`}
      >
        {tx.amount > 0 ? "+" : ""}
        {formatCurrency(tx.amount)}
      </p>
    </li>
  );
}

function BudgetCategoryCard({ budget }: BudgetCategoryCardProps) {
  const color = getThemeColor(budget.theme);
  const spentPct =
    budget.maximum > 0
      ? Math.min(100, Math.max(0, (budget.spent / budget.maximum) * 100))
      : 0;
  const isOverBudget = budget.remaining < 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <div>
            <h2 className="text-preset-2 text-grey-900">{budget.category}</h2>
            <p className="mt-1 text-preset-4 text-grey-500">
              Limit of {formatCurrency(budget.maximum)}
            </p>
          </div>
        </div>
        <p
          className={`rounded-full px-3 py-1 text-preset-5 font-bold ${
            isOverBudget
              ? "bg-secondary-red/10 text-secondary-red"
              : "bg-beige-100 text-grey-500"
          }`}
        >
          {isOverBudget ? "Over budget" : "On track"}
        </p>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-beige-100">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${spentPct}%`, backgroundColor: color }}
        />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-4 rounded-xl bg-beige-100/60 px-4 py-4">
        <BudgetStat label="Limit" value={formatCurrency(budget.maximum)} />
        <BudgetStat label="Spent" value={formatCurrency(budget.spent)} />
        <BudgetStat
          label="Remaining"
          value={formatCurrency(budget.remaining)}
          tone={isOverBudget ? "negative" : "positive"}
        />
      </dl>

      <div className="mt-6">
        <h3 className="text-preset-3 text-grey-900">Recent Transactions</h3>
        {budget.transactions.length > 0 ? (
          <ul
            className="mt-2 flex flex-col"
            aria-label={`Recent ${budget.category} transactions`}
          >
            {budget.transactions.map((tx, index) => (
              <TransactionRow
                key={`${tx.name}-${tx.date}-${index}`}
                tx={tx}
                color={color}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-beige-100/60 px-4 py-4 text-preset-4 text-grey-500">
            No recent transactions for this budget.
          </p>
        )}
      </div>
    </Card>
  );
}

export function BudgetsView({ budgets }: BudgetsViewProps) {
  const spentTotal = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const limitTotal = budgets.reduce((sum, budget) => sum + budget.maximum, 0);
  const remainingTotal = limitTotal - spentTotal;

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Budgets
      </h1>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.4fr)] xl:items-start">
        <Card>
          <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="relative flex items-center justify-center">
              <DonutChart budgets={budgets} size={260} strokeWidth={36} />
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                <p className="text-preset-5 text-grey-500">Spent</p>
                <p className="text-preset-1 font-bold tracking-tight text-grey-900">
                  {formatCurrency(spentTotal)}
                </p>
                <p className="text-preset-5 text-grey-500">
                  of {formatCurrency(limitTotal)}
                </p>
              </div>
            </div>

            <dl className="grid w-full grid-cols-3 gap-4 rounded-xl bg-beige-100/60 px-4 py-4">
              <BudgetStat label="Limit" value={formatCurrency(limitTotal)} />
              <BudgetStat label="Spent" value={formatCurrency(spentTotal)} />
              <BudgetStat
                label="Remaining"
                value={formatCurrency(remainingTotal)}
                tone={remainingTotal < 0 ? "negative" : "positive"}
              />
            </dl>
          </div>

          <ul className="mt-8 flex flex-col gap-4" aria-label="Budget totals">
            {budgets.map((budget) => (
              <li
                key={budget.category}
                className="flex items-center gap-4 border-b border-beige-100 pb-4 last:border-b-0 last:pb-0"
              >
                <span
                  className="h-12 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: getThemeColor(budget.theme) }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-preset-4-bold text-grey-900">
                    {budget.category}
                  </p>
                  <p className="mt-1 text-preset-5 text-grey-500">
                    {formatCurrency(budget.spent)} of{" "}
                    {formatCurrency(budget.maximum)}
                  </p>
                </div>
                <p className="shrink-0 text-preset-4-bold tabular-nums text-grey-900">
                  {formatCurrency(budget.remaining)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          {budgets.map((budget) => (
            <BudgetCategoryCard key={budget.category} budget={budget} />
          ))}
        </div>
      </div>
    </main>
  );
}
