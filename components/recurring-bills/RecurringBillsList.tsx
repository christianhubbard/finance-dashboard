"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { BillAvatar } from "@/components/recurring-bills/BillAvatar";
import {
  STATUS_COLORS,
  STATUS_FILTERS,
  STATUS_LABELS,
  type StatusFilter,
} from "@/components/recurring-bills/statusConfig";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import type { RecurringBillStatus, RecurringBillWithStatus } from "@/lib/types";

type RecurringBillsListProps = {
  bills: RecurringBillWithStatus[];
};

function BillRow({ bill }: { bill: RecurringBillWithStatus }) {
  const colors = STATUS_COLORS[bill.status];

  return (
    <li className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0">
      <BillAvatar bill={bill} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-preset-4-bold truncate text-grey-900">{bill.name}</p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-preset-5 font-medium ${colors.badge}`}
          >
            {STATUS_LABELS[bill.status]}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-preset-5 text-grey-500">
          <span>{bill.category}</span>
          <span aria-hidden>•</span>
          <span>{formatDisplayDate(bill.date)}</span>
        </div>
      </div>
      <p className="text-preset-4-bold shrink-0 text-grey-900">
        {formatCurrency(bill.amount)}
      </p>
    </li>
  );
}

function BillGroup({
  status,
  bills,
}: {
  status: RecurringBillStatus;
  bills: RecurringBillWithStatus[];
}) {
  if (bills.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={`${status}-heading`}>
      <h3
        id={`${status}-heading`}
        className={`text-preset-4-bold ${STATUS_COLORS[status].label}`}
      >
        {STATUS_LABELS[status]}
      </h3>
      <ul className="mt-4 flex flex-col" aria-label={`${STATUS_LABELS[status]} bills`}>
        {bills.map((bill, index) => (
          <BillRow key={`${bill.name}-${bill.date}-${index}`} bill={bill} />
        ))}
      </ul>
    </section>
  );
}

export function RecurringBillsList({ bills }: RecurringBillsListProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filteredBills = useMemo(() => {
    if (filter === "all") {
      return bills;
    }

    return bills.filter((bill) => bill.status === filter);
  }, [bills, filter]);

  const groupedBills = useMemo(() => {
    const groups: Record<RecurringBillStatus, RecurringBillWithStatus[]> = {
      paid: [],
      upcoming: [],
      dueSoon: [],
    };

    for (const bill of filteredBills) {
      groups[bill.status].push(bill);
    }

    return groups;
  }, [filteredBills]);

  return (
    <Card>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-preset-2 text-grey-900">Bills</h2>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter bills by status"
        >
          {STATUS_FILTERS.map(({ value, label }) => {
            const isActive = filter === value;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-preset-5 font-medium transition-colors ${
                  isActive
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

      <div className="mt-8">
        {filteredBills.length === 0 ? (
          <p className="text-preset-4 text-grey-500">No bills in this category.</p>
        ) : filter === "all" ? (
          <div className="flex flex-col gap-8">
            <BillGroup status="paid" bills={groupedBills.paid} />
            <BillGroup status="upcoming" bills={groupedBills.upcoming} />
            <BillGroup status="dueSoon" bills={groupedBills.dueSoon} />
          </div>
        ) : (
          <ul className="flex flex-col" aria-label="Filtered recurring bills">
            {filteredBills.map((bill, index) => (
              <BillRow key={`${bill.name}-${bill.date}-${index}`} bill={bill} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
