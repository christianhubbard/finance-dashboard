import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import { totalLimit, totalSpent } from "@/lib/budgets";
import type { Budget } from "@/lib/types";

type BudgetsSummaryProps = {
  budgets: Budget[];
};

export function BudgetsSummary({ budgets }: BudgetsSummaryProps) {
  const spentTotal = totalSpent(budgets);
  const limitTotal = totalLimit(budgets);

  return (
    <Card>
      <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
      <div className="mt-6 flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex items-center justify-center">
          <DonutChart budgets={budgets} size={220} strokeWidth={32} />
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
        <ul className="flex w-full max-w-xs flex-col gap-3 lg:w-auto">
          {budgets.map((b) => (
            <li key={b.category} className="flex items-center gap-3">
              <span
                className="h-5 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: getThemeColor(b.theme) }}
                aria-hidden
              />
              <span className="text-preset-4 flex-1 text-grey-500">
                {b.category}
              </span>
              <span className="text-preset-4-bold text-grey-900">
                {formatCurrency(b.spent)} of {formatCurrency(b.maximum)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
