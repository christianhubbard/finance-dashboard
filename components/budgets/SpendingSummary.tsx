import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import {
  getBudgetsLimitTotal,
  getBudgetsSpentTotal,
} from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget } from "@/lib/types";

type SpendingSummaryProps = {
  budgets: Budget[];
};

export function SpendingSummary({ budgets }: SpendingSummaryProps) {
  const spentTotal = getBudgetsSpentTotal(budgets);
  const limitTotal = getBudgetsLimitTotal(budgets);

  return (
    <Card className="w-full lg:max-w-[428px]">
      <div className="relative flex items-center justify-center py-2">
        <DonutChart budgets={budgets} size={240} strokeWidth={32} />
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <p className="text-preset-1 font-bold tracking-tight text-grey-900">
            {formatCurrency(spentTotal)}
          </p>
          <p className="text-preset-5 text-grey-500">
            of {formatCurrency(limitTotal)} limit
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
        <ul className="mt-6 flex flex-col gap-4">
          {budgets.map((b, i) => (
            <li key={b.category}>
              {i > 0 ? (
                <div
                  className="mb-4 border-t border-beige-100"
                  aria-hidden
                />
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span
                    className="h-5 w-1 shrink-0 rounded-sm"
                    style={{ backgroundColor: getThemeColor(b.theme) }}
                    aria-hidden
                  />
                  <span className="text-preset-4 text-grey-500 truncate">
                    {b.category}
                  </span>
                </div>
                <div className="flex shrink-0 items-baseline gap-2">
                  <span className="text-preset-3 font-bold text-grey-900">
                    {formatCurrency(b.spent)}
                  </span>
                  <span className="text-preset-5 text-grey-500">
                    of {formatCurrency(b.maximum)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
