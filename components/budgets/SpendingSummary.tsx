import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Budget } from "@/lib/types";

type SpendingSummaryProps = {
  budgets: Budget[];
};

export function SpendingSummary({ budgets }: SpendingSummaryProps) {
  const spentTotal = budgets.reduce((s, b) => s + b.spent, 0);
  const limitTotal = budgets.reduce((s, b) => s + b.maximum, 0);

  return (
    <Card>
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center">
          <DonutChart budgets={budgets} size={240} strokeWidth={36} />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <p className="text-preset-1 font-bold tracking-tight text-grey-900">
              {formatCurrency(spentTotal)}
            </p>
            <p className="mt-2 text-preset-5 text-grey-500">
              of {formatCurrency(limitTotal)} limit
            </p>
          </div>
        </div>
      </div>
      <h2 className="mt-8 text-preset-2 text-grey-900">Spending Summary</h2>
      <ul className="mt-6 flex flex-col" aria-label="Spending by category">
        {budgets.map((b) => (
          <li
            key={b.category}
            className="flex items-center gap-4 border-b border-beige-100 py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <span
              className="h-5 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: getThemeColor(b.theme) }}
              aria-hidden
            />
            <span className="text-preset-4 flex-1 text-grey-500">
              {b.category}
            </span>
            <span className="text-preset-3 text-grey-900">
              {formatCurrency(b.spent)}
            </span>
            <span className="text-preset-5 text-grey-500">
              of {formatCurrency(b.maximum)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
