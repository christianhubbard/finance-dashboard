import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { getThemeColor } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import type { Budget } from "@/lib/types";

type SpendingSummaryProps = {
  budgets: Budget[];
};

export function SpendingSummary({ budgets }: SpendingSummaryProps) {
  const spentTotal = budgets.reduce((s, b) => s + b.spent, 0);
  const maximumTotal = budgets.reduce((s, b) => s + b.maximum, 0);

  return (
    <Card className="px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center py-2">
          <DonutChart budgets={budgets} size={240} strokeWidth={34} />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <p className="text-preset-1 font-bold tracking-tight text-grey-900">
              {formatCurrency(spentTotal)}
            </p>
            <p className="mt-1 text-preset-5 text-grey-500">
              of {formatCurrency(maximumTotal)} limit
            </p>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
          <ul className="mt-6 flex flex-col">
            {budgets.map((b) => (
              <li
                key={b.category}
                className="flex items-center gap-4 border-b border-grey-100 py-4 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span
                  className="h-6 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: getThemeColor(b.theme) }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-preset-4 text-grey-500">
                  {b.category}
                </span>
                <span className="shrink-0 text-preset-3 text-grey-900">
                  {formatCurrency(b.spent)}
                </span>
                <span className="shrink-0 text-preset-5 text-grey-500">
                  of {formatCurrency(b.maximum)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
