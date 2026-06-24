import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { getRecurringBillsSummary } from "@/lib/recurring-bills";
import type { FinanceData } from "@/lib/types";

type RecurringBillsCardProps = {
  data: FinanceData;
};

export function RecurringBillsCard({ data }: RecurringBillsCardProps) {
  const summary = getRecurringBillsSummary(data);

  const paidDisplay = `-${formatCurrency(summary.paidTotal)}`;
  const upcomingDisplay = `-${formatCurrency(summary.upcomingTotal)}`;

  return (
    <Card className="shadow-lg shadow-grey-900/10">
      <h2 className="text-preset-2 text-grey-900">Recurring Bills</h2>
      <ul className="mt-6 flex flex-col gap-3">
        <li className="flex items-center justify-between gap-4 rounded-xl border border-beige-100 bg-beige-100/60 px-4 py-4">
          <div>
            <p className="text-preset-4-bold text-secondary-green">Paid Bills</p>
            <p className="text-preset-5 text-grey-500">
              {summary.paidCount} bills
            </p>
          </div>
          <p className="text-preset-2 font-bold text-secondary-red">
            {paidDisplay}
          </p>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-xl border border-beige-100 bg-beige-100/60 px-4 py-4">
          <div>
            <p className="text-preset-4-bold text-secondary-cyan">
              Total Upcoming
            </p>
            <p className="text-preset-5 text-grey-500">
              {summary.upcomingCount} bills
            </p>
          </div>
          <p className="text-preset-2 font-bold text-secondary-red">
            {upcomingDisplay}
          </p>
        </li>
        <li className="flex items-center justify-between gap-4 rounded-xl border border-beige-100 bg-beige-100/60 px-4 py-4">
          <div>
            <p className="text-preset-4-bold text-secondary-yellow">Due Soon</p>
            <p className="text-preset-5 text-grey-500">
              {summary.dueSoonCount} bills
            </p>
          </div>
          <p className="text-preset-1 font-bold tracking-tight text-grey-900">
            {summary.dueSoonCount}
          </p>
        </li>
      </ul>
    </Card>
  );
}
