import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { sumAmounts } from "@/lib/data";
import type { FinanceData } from "@/lib/types";

type RecurringBillsCardProps = {
  data: FinanceData;
};

export function RecurringBillsCard({ data }: RecurringBillsCardProps) {
  const { paid, upcoming, dueSoon } = data.recurringBills;
  const paidTotal = sumAmounts(
    paid.map((t) => ({ amount: Math.abs(t.amount) })),
  );
  const upcomingTotal = sumAmounts(
    upcoming.map((t) => ({ amount: Math.abs(t.amount) })),
  );

  const paidDisplay = `-${formatCurrency(paidTotal)}`;
  const upcomingDisplay = `-${formatCurrency(upcomingTotal)}`;

  return (
    <Card>
      <h2 className="text-preset-2 text-grey-900">Recurring Bills</h2>
      <ul className="mt-6 flex flex-col gap-3">
        <li className="flex items-center justify-between gap-4 rounded-xl border border-beige-100 bg-beige-100/60 px-4 py-4">
          <div>
            <p className="text-preset-4-bold text-secondary-green">Paid Bills</p>
            <p className="text-preset-5 text-grey-500">
              {paid.length} bills
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
              {upcoming.length} bills
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
              {dueSoon.length} bills
            </p>
          </div>
          <p className="text-preset-1 font-bold tracking-tight text-grey-900">
            {dueSoon.length}
          </p>
        </li>
      </ul>
    </Card>
  );
}
