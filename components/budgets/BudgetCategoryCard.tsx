import Link from "next/link";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import { latestTransactionsForCategory, progressPercent, remaining } from "@/lib/budgets";
import type { Budget, Transaction } from "@/lib/types";

type BudgetCategoryCardProps = {
  budget: Budget;
  transactions: Transaction[];
};

export function BudgetCategoryCard({ budget, transactions }: BudgetCategoryCardProps) {
  const pct = progressPercent(budget);
  const latest = latestTransactionsForCategory(transactions, budget.category);
  const barColor = getThemeColor(budget.theme);

  return (
    <Card>
      <div className="flex gap-4">
        <span
          className="w-1 shrink-0 self-stretch rounded-full"
          style={{ backgroundColor: barColor }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-preset-2 text-grey-900">{budget.category}</h2>
              <p className="mt-2 text-preset-4 text-grey-500">
                Maximum of {formatCurrency(budget.maximum)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-beige-100">
            <div
              className="h-full rounded-full transition-[width]"
              style={{
                width: `${pct}%`,
                backgroundColor: barColor,
              }}
            />
          </div>

          <div className="mt-4 flex gap-8">
            <div>
              <p className="text-preset-5 text-grey-500">Spent</p>
              <p className="text-preset-3 font-bold text-grey-900">
                {formatCurrency(budget.spent)}
              </p>
            </div>
            <div>
              <p className="text-preset-5 text-grey-500">Remaining</p>
              <p className="text-preset-3 font-bold text-grey-900">
                {formatCurrency(remaining(budget))}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h3 className="text-preset-3 font-bold text-grey-900">Latest Spending</h3>
            <Link
              href="/transactions"
              className="text-preset-4 font-medium text-grey-500 underline-offset-4 hover:text-grey-900 hover:underline"
            >
              See All
            </Link>
          </div>

          {latest.length === 0 ? (
            <p className="mt-4 text-preset-4 text-grey-500">No transactions</p>
          ) : (
            <ul className="mt-4 flex flex-col" aria-label={`Latest ${budget.category} transactions`}>
              {latest.map((tx, i) => {
                const isPositive = tx.amount >= 0;
                return (
                  <li
                    key={`${tx.name}-${tx.date}-${i}`}
                    className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0"
                  >
                    <TransactionAvatar tx={tx} />
                    <div className="min-w-0 flex-1">
                      <p className="text-preset-4-bold truncate text-grey-900">{tx.name}</p>
                      <p className="mt-1 text-preset-5 text-grey-500">
                        {formatDisplayDate(tx.date)}
                      </p>
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
          )}
        </div>
      </div>
    </Card>
  );
}
