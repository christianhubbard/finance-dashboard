import { formatCurrency } from "@/lib/format";
import type { RecurringBillsSummary } from "@/lib/data";

type BillsSummaryProps = {
  summary: RecurringBillsSummary;
};

export function BillsSummary({ summary }: BillsSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="@container min-w-0 overflow-hidden rounded-2xl bg-grey-900 px-6 py-6 text-white">
        <p className="text-preset-4 text-grey-100">Total Bills</p>
        <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums">
          {formatCurrency(summary.totalAmount)}
        </p>
        <p className="mt-2 text-preset-5 text-grey-300">
          {summary.totalCount} bills
        </p>
      </div>
      <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-grey-500">Paid</p>
        <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums text-secondary-green">
          {formatCurrency(summary.paidAmount)}
        </p>
        <p className="mt-2 text-preset-5 text-grey-500">
          {summary.paidCount} bills
        </p>
      </div>
      <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-grey-500">Upcoming</p>
        <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums text-secondary-cyan">
          {formatCurrency(summary.upcomingAmount)}
        </p>
        <p className="mt-2 text-preset-5 text-grey-500">
          {summary.upcomingCount} bills
        </p>
      </div>
    </div>
  );
}
