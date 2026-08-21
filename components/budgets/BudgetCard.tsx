import Link from "next/link";
import { ChevronRight, Ellipsis } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CompactTransactionRow } from "@/components/ui/TransactionRow";
import {
  getBudgetProgress,
  getBudgetRemaining,
  getTransactionsForCategory,
} from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget, FinanceData } from "@/lib/types";

type BudgetCardProps = {
  budget: Budget;
  data: FinanceData;
};

export function BudgetCard({ budget, data }: BudgetCardProps) {
  const remaining = getBudgetRemaining(budget);
  const progress = getBudgetProgress(budget);
  const latest = getTransactionsForCategory(data, budget.category, 3);
  const themeColor = getThemeColor(budget.theme);
  const seeAllHref = `/transactions?category=${encodeURIComponent(budget.category)}`;

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: themeColor }}
            aria-hidden
          />
          <h2 className="text-preset-2 truncate text-grey-900">
            {budget.category}
          </h2>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label={`${budget.category} options`}
          className="flex size-4 shrink-0 cursor-not-allowed items-center justify-center text-grey-500 disabled:opacity-100"
        >
          <Ellipsis className="size-4" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <p className="text-preset-4 text-grey-500">
          Maximum of {formatCurrency(budget.maximum)}
        </p>
        <div className="h-8 rounded bg-beige-100 p-1">
          <div
            className="h-full rounded-sm transition-[width]"
            style={{
              width: `${progress}%`,
              backgroundColor: themeColor,
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${budget.category} budget usage`}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-1 items-center gap-4">
            <span
              className="h-8 w-1 shrink-0 rounded-sm"
              style={{ backgroundColor: themeColor }}
              aria-hidden
            />
            <div>
              <p className="text-preset-5 text-grey-500">Spent</p>
              <p className="text-preset-4-bold text-grey-900">
                {formatCurrency(budget.spent)}
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <span
              className="h-8 w-1 shrink-0 rounded-sm bg-beige-100"
              aria-hidden
            />
            <div>
              <p className="text-preset-5 text-grey-500">Remaining</p>
              <p className="text-preset-4-bold text-grey-900">
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-beige-100 p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-preset-3 text-grey-900">Latest Spending</h3>
          <Link
            href={seeAllHref}
            className="flex items-center gap-3 text-preset-4 text-grey-500 hover:text-grey-900"
          >
            See All
            <ChevronRight className="size-3" aria-hidden />
          </Link>
        </div>
        {latest.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-3">
            {latest.map((tx, i) => (
              <li key={`${tx.name}-${tx.date}-${i}`}>
                {i > 0 ? (
                  <div
                    className="mb-3 border-t border-grey-500/15"
                    aria-hidden
                  />
                ) : null}
                <div className="flex w-full items-start justify-between gap-4">
                  <CompactTransactionRow tx={tx} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-preset-5 text-grey-500">
            No recent transactions in this category.
          </p>
        )}
      </div>
    </Card>
  );
}
