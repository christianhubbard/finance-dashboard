import { formatCurrency } from "@/lib/format";
import type { RecurringBillsSummary as RecurringBillsSummaryData } from "@/lib/types";

type RecurringBillsSummaryProps = {
  summary: RecurringBillsSummaryData;
};

export function RecurringBillsSummary({ summary }: RecurringBillsSummaryProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-grey-500">Total Bills</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight text-grey-900">
          {summary.totalCount}
        </p>
        <p className="mt-1 text-preset-5 text-grey-500">This month</p>
      </div>
      <div className="rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-secondary-green">Paid So Far</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight text-secondary-red">
          -{formatCurrency(summary.paidTotal)}
        </p>
        <p className="mt-1 text-preset-5 text-grey-500">
          {summary.paidCount} bills
        </p>
      </div>
      <div className="rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-secondary-cyan">Upcoming</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight text-secondary-red">
          -{formatCurrency(summary.upcomingTotal)}
        </p>
        <p className="mt-1 text-preset-5 text-grey-500">
          {summary.upcomingCount} bills
        </p>
      </div>
      <div className="rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-secondary-yellow">Due Soon</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight text-secondary-red">
          -{formatCurrency(summary.dueSoonTotal)}
        </p>
        <p className="mt-1 text-preset-5 text-grey-500">
          {summary.dueSoonCount} bills
        </p>
      </div>
    </div>
  );
}
