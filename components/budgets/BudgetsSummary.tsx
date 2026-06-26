import { Card } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";
import { formatCurrency } from "@/lib/format";
import type { Budget } from "@/lib/types";

type BudgetsSummaryProps = {
  budgets: Budget[];
};

export function BudgetsSummary({ budgets }: BudgetsSummaryProps) {
  const spentTotal = budgets.reduce((s, b) => s + b.spent, 0);
  const limitTotal = budgets.reduce((s, b) => s + b.maximum, 0);

  return (
    <Card>
      <h2 className="text-preset-2 text-grey-900">Spending Summary</h2>
      <div className="mt-6 flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <DonutChart budgets={budgets} size={240} strokeWidth={36} />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <p className="text-preset-5 text-grey-500">Spent</p>
            <p className="text-preset-1 font-bold tracking-tight text-grey-900">
              {formatCurrency(spentTotal)}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 text-center">
          <p className="text-preset-4 text-grey-500">Total budget limit</p>
          <p className="text-preset-1 font-bold tracking-tight text-grey-900">
            {formatCurrency(limitTotal)}
          </p>
        </div>
      </div>
    </Card>
  );
}
