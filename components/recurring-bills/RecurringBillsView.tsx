"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  filterRecurringBillsByStatus,
  getRecurringBillsSummary,
  getRecurringBillsWithStatus,
} from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type {
  FinanceData,
  RecurringBillStatus,
  RecurringBillWithStatus,
} from "@/lib/types";

const AVATAR_ACCENTS: Record<string, string> = {
  emma: "var(--color-secondary-cyan)",
  urban: "var(--color-secondary-green)",
  savory: "var(--color-secondary-yellow)",
  floral: "var(--color-secondary-purple)",
  spark: "var(--color-secondary-yellow)",
  ledger: "var(--color-secondary-navy)",
  trail: "var(--color-extended-brown)",
  north: "var(--color-extended-blue)",
  ember: "var(--color-extended-orange)",
  water: "var(--color-secondary-cyan)",
  net: "var(--color-extended-magenta)",
};

const STATUS_LABEL: Record<RecurringBillStatus, string> = {
  paid: "Paid",
  upcoming: "Upcoming",
  overdue: "Overdue",
};

const STATUS_CLASS: Record<RecurringBillStatus, string> = {
  paid: "bg-secondary-green/15 text-secondary-green",
  upcoming: "bg-secondary-cyan/15 text-secondary-cyan",
  overdue: "bg-secondary-red/15 text-secondary-red",
};

type StatusFilter = RecurringBillStatus | "all";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "upcoming", label: "Upcoming" },
  { value: "overdue", label: "Overdue" },
];

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function BillAvatar({ bill }: { bill: RecurringBillWithStatus }) {
  const accent = AVATAR_ACCENTS[bill.avatar] ?? getThemeColor("navy");
  const initial = bill.name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-preset-3 font-bold text-white"
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initial}
    </div>
  );
}

type RecurringBillsViewProps = {
  data: FinanceData;
};

export function RecurringBillsView({ data }: RecurringBillsViewProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const bills = useMemo(() => getRecurringBillsWithStatus(data), [data]);
  const summary = useMemo(() => getRecurringBillsSummary(data), [data]);
  const visible = useMemo(
    () => filterRecurringBillsByStatus(bills, filter),
    [bills, filter],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="@container min-w-0 overflow-hidden rounded-2xl bg-grey-900 px-6 py-6 text-white">
          <p className="text-preset-4 text-grey-100">Total Bills</p>
          <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums">
            {formatCurrency(summary.totalAmount)}
          </p>
          <p className="mt-2 text-preset-5 text-grey-300">
            {summary.totalCount} bills this month
          </p>
        </div>
        <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
          <p className="text-preset-4 text-grey-500">Paid so far</p>
          <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums text-secondary-green">
            {formatCurrency(summary.paidAmount)}
          </p>
          <p className="mt-2 text-preset-5 text-grey-500">
            {summary.paidCount} paid
          </p>
        </div>
        <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
          <p className="text-preset-4 text-grey-500">Upcoming</p>
          <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums text-secondary-red">
            {formatCurrency(summary.upcomingAmount + summary.overdueAmount)}
          </p>
          <p className="mt-2 text-preset-5 text-grey-500">
            {summary.upcomingCount + summary.overdueCount} remaining
            {summary.overdueCount > 0
              ? ` (${summary.overdueCount} overdue)`
              : ""}
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-preset-2 text-grey-900">Bills</h2>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter bills by status"
          >
            {FILTERS.map(({ value, label }) => {
              const selected = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setFilter(value)}
                  className={`rounded-xl px-4 py-2 text-preset-4-bold transition-colors ${
                    selected
                      ? "bg-grey-900 text-white"
                      : "bg-beige-100 text-grey-500 hover:text-grey-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-8 flex flex-col" aria-label="Recurring bills">
          {visible.length === 0 ? (
            <li className="py-8 text-center text-preset-4 text-grey-500">
              No bills in this status.
            </li>
          ) : (
            visible.map((bill, i) => (
              <li
                key={`${bill.name}-${bill.date}-${bill.status}-${i}`}
                className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0"
              >
                <BillAvatar bill={bill} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-preset-4-bold text-grey-900">
                    {bill.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-preset-5 text-grey-500">
                    <span>Due {formatDisplayDate(bill.date)}</span>
                    <span aria-hidden>•</span>
                    <span
                      className={`inline-flex rounded-lg px-2 py-0.5 text-preset-5 font-semibold ${STATUS_CLASS[bill.status]}`}
                    >
                      {STATUS_LABEL[bill.status]}
                    </span>
                  </div>
                </div>
                <p className="shrink-0 text-preset-4-bold text-grey-900">
                  {formatCurrency(bill.amount)}
                </p>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
