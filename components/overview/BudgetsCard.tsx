import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { getThemeColor } from "@/lib/theme";
import type { Budget } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type BudgetsCardProps = {
  budgets: Budget[];
};

export function BudgetsCard({ budgets }: BudgetsCardProps) {
  const spentTotal = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-preset-2 text-grey-900">Budgets</h2>
        <Link
          href="/budgets"
          className="text-preset-4 font-medium text-grey-500 underline-offset-4 hover:text-grey-900 hover:underline"
        >
          See Details
        </Link>
      </div>
      <div className="mt-6 flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex items-center justify-center">
          <DonutChart budgets={budgets} size={220} strokeWidth={32} />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <p className="text-preset-5 text-grey-500">Spent</p>
            <p className="text-preset-1 font-bold tracking-tight text-grey-900 tabular-nums">
              {formatCurrency(spentTotal)}
            </p>
          </div>
        </div>
        <ul className="flex w-full max-w-xs flex-col gap-3 lg:w-auto">
          {budgets.map((b) => (
            <li key={b.category} className="flex items-center gap-3">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: getThemeColor(b.theme) }}
                aria-hidden
              />
              <span className="text-preset-4 flex-1 text-grey-500">
                {b.category}
              </span>
              <span className="text-preset-4-bold tabular-nums text-grey-900">
                {formatCurrency(b.spent)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
