import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { FinanceData, RecurringBill } from "@/lib/types";

type RecurringBills = FinanceData["recurringBills"];
type BillStatus = "paid" | "upcoming" | "overdue";

type StatusGroup = {
  key: BillStatus;
  title: string;
  description: string;
  bills: RecurringBill[];
  accentClass: string;
  badgeClass: string;
};

type SummaryStat = {
  label: string;
  amount: number;
  count: number;
  accentClass: string;
};

type RecurringBillsDashboardProps = {
  recurringBills: RecurringBills;
};

const AVATAR_ACCENTS: Record<string, string> = {
  emma: "var(--color-secondary-cyan)",
  spark: "var(--color-secondary-yellow)",
  urban: "var(--color-secondary-green)",
  water: "var(--color-secondary-cyan)",
  net: "var(--color-extended-magenta)",
};

function getBillTotal(bills: RecurringBill[]): number {
  return bills.reduce((sum, bill) => sum + Math.abs(bill.amount), 0);
}

function formatExpenseTotal(amount: number): string {
  return formatCurrency(-amount, "always");
}

function formatDueDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function BillAvatar({ bill }: { bill: RecurringBill }) {
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

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-preset-5 font-bold ${className}`}
    >
      {label}
    </span>
  );
}

function SummaryCard({ stat }: { stat: SummaryStat }) {
  return (
    <Card className="relative overflow-hidden">
      <span
        className={`absolute inset-y-0 left-0 w-1.5 ${stat.accentClass}`}
        aria-hidden
      />
      <p className="text-preset-5 text-grey-500">{stat.label}</p>
      <p className="mt-3 text-preset-1 font-bold tracking-tight text-grey-900">
        {formatExpenseTotal(stat.amount)}
      </p>
      <p className="mt-2 text-preset-5 text-grey-500">
        {stat.count} {stat.count === 1 ? "bill" : "bills"}
      </p>
    </Card>
  );
}

function BillsGroup({ group }: { group: StatusGroup }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-preset-2 text-grey-900">{group.title}</h2>
          <p className="mt-1 text-preset-4 text-grey-500">
            {group.description}
          </p>
        </div>
        <p className="text-preset-2 font-bold text-secondary-red">
          {formatExpenseTotal(getBillTotal(group.bills))}
        </p>
      </div>

      <ul className="mt-6 flex flex-col" aria-label={`${group.title} bills`}>
        {group.bills.map((bill) => (
          <li
            key={`${group.key}-${bill.name}-${bill.date}`}
            className="flex flex-col gap-4 border-b border-beige-100 py-4 last:border-b-0 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <BillAvatar bill={bill} />
              <div className="min-w-0">
                <p className="truncate text-preset-4-bold text-grey-900">
                  {bill.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-preset-5 text-grey-500">
                  <span>{bill.category}</span>
                  <span aria-hidden>•</span>
                  <span>Due {formatDueDate(bill.date)}</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
              <StatusBadge label={group.title} className={group.badgeClass} />
              <p className="min-w-24 text-right text-preset-4-bold text-grey-900">
                {formatCurrency(bill.amount, "always")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RecurringBillsDashboard({
  recurringBills,
}: RecurringBillsDashboardProps) {
  const paidTotal = getBillTotal(recurringBills.paid);
  const upcomingTotal = getBillTotal(recurringBills.upcoming);
  const overdueTotal = getBillTotal(recurringBills.dueSoon);
  const totalBills =
    recurringBills.paid.length +
    recurringBills.upcoming.length +
    recurringBills.dueSoon.length;

  const summaryStats: SummaryStat[] = [
    {
      label: "Total Bills",
      amount: paidTotal + upcomingTotal + overdueTotal,
      count: totalBills,
      accentClass: "bg-grey-900",
    },
    {
      label: "Paid So Far",
      amount: paidTotal,
      count: recurringBills.paid.length,
      accentClass: "bg-secondary-green",
    },
    {
      label: "Upcoming",
      amount: upcomingTotal,
      count: recurringBills.upcoming.length,
      accentClass: "bg-secondary-cyan",
    },
  ];

  const statusGroups: StatusGroup[] = [
    {
      key: "paid",
      title: "Paid",
      description: "Bills already settled this month.",
      bills: recurringBills.paid,
      accentClass: "text-secondary-green",
      badgeClass: "bg-secondary-green/10 text-secondary-green",
    },
    {
      key: "upcoming",
      title: "Upcoming",
      description: "Scheduled bills still ahead.",
      bills: recurringBills.upcoming,
      accentClass: "text-secondary-cyan",
      badgeClass: "bg-secondary-cyan/10 text-secondary-cyan",
    },
    {
      key: "overdue",
      title: "Overdue",
      description: "Bills needing attention soon.",
      bills: recurringBills.dueSoon,
      accentClass: "text-secondary-yellow",
      badgeClass: "bg-secondary-yellow/20 text-grey-900",
    },
  ];

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
            Recurring Bills
          </h1>
          <p className="mt-2 max-w-2xl text-preset-4 text-grey-500">
            Track monthly commitments by due date, amount, and payment status.
          </p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-preset-4-bold text-grey-900">
          {totalBills} total bills
        </p>
      </div>

      <section aria-labelledby="monthly-summary-heading" className="mt-6">
        <h2 id="monthly-summary-heading" className="sr-only">
          Monthly summary
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {summaryStats.map((stat) => (
            <SummaryCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="status-summary-heading"
        className="mt-8 grid gap-8 lg:grid-cols-[minmax(260px,0.45fr)_minmax(0,1fr)] lg:items-start"
      >
        <Card>
          <h2
            id="status-summary-heading"
            className="text-preset-2 text-grey-900"
          >
            Bills by Status
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {statusGroups.map((group) => (
              <li
                key={group.key}
                className="flex items-center justify-between gap-4 border-b border-beige-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className={`text-preset-4-bold ${group.accentClass}`}>
                    {group.title}
                  </p>
                  <p className="mt-1 text-preset-5 text-grey-500">
                    {group.bills.length}{" "}
                    {group.bills.length === 1 ? "bill" : "bills"}
                  </p>
                </div>
                <p className="text-preset-4-bold text-grey-900">
                  {formatExpenseTotal(getBillTotal(group.bills))}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-8">
          {statusGroups.map((group) => (
            <BillsGroup key={group.key} group={group} />
          ))}
        </div>
      </section>
    </main>
  );
}
