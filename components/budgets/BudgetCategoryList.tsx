import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget } from "@/lib/types";

type BudgetCategoryListProps = {
  budgets: Budget[];
};

function getProgressPercent(spent: number, maximum: number): number {
  if (maximum <= 0) {
    return 0;
  }
  return Math.min(100, (spent / maximum) * 100);
}

export function BudgetCategoryList({ budgets }: BudgetCategoryListProps) {
  return (
    <Card>
      <h2 className="text-preset-2 text-grey-900">Categories</h2>
      <ul
        aria-label="Budget categories"
        className="mt-8 flex flex-col gap-6"
      >
        {budgets.map((budget) => {
          const remaining = budget.maximum - budget.spent;
          const pct = getProgressPercent(budget.spent, budget.maximum);
          const barColor = getThemeColor(budget.theme);

          return (
            <li key={budget.category}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-preset-4-bold text-grey-900">
                  {budget.category}
                </span>
                <div className="text-preset-4 text-right">
                  <span className="font-bold text-grey-900">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-grey-500">
                    {" "}
                    of {formatCurrency(budget.maximum)}
                  </span>
                </div>
              </div>
              <p
                className={`mt-1 text-preset-4 text-right ${
                  remaining >= 0 ? "text-secondary-green" : "text-secondary-red"
                }`}
              >
                {remaining >= 0
                  ? `${formatCurrency(remaining)} remaining`
                  : `${formatCurrency(Math.abs(remaining))} over`}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-beige-100">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
