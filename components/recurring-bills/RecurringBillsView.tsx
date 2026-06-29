import { Card } from "@/components/ui/Card";
import {
  getRecurringBillGroups,
  getRecurringBillsSummary,
} from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type {
  FinanceData,
  RecurringBill,
  RecurringBillStatus,
} from "@/lib/types";

type RecurringBillsViewProps = {
  data: FinanceData;
};

const statusLabels: Record<RecurringBillStatus, string> = {
  paid: "Paid",
  upcoming: "Upcoming",
  overdue: "Overdue",
};

const statusStyles: Record<RecurringBillStatus, string> = {
  paid: "bg-secondary-green/10 text-secondary-green",
  upcoming: "bg-secondary-cyan/20 text-extended-blue",
  overdue: "bg-secondary-red/10 text-secondary-red",
};

const groupAccent: Record<RecurringBillStatus, string> = {
  paid: "bg-secondary-green",
  upcoming: "bg-secondary-cyan",
  overdue: "bg-secondary-red",
};

const dueDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDueDate(date: string): string {
  return dueDateFormatter.format(new Date(`${date}T00:00:00`));
}

function billAmount(amount: number): string {
  return `-${formatCurrency(Math.abs(amount))}`;
}

function BillRow({
  bill,
  status,
}: {
  bill: RecurringBill;
  status: RecurringBillStatus;
}) {
  return (
    <li className="grid gap-4 py-5 md:grid-cols-[minmax(0,1.2fr)_minmax(9rem,0.6fr)_minmax(8rem,0.4fr)_auto] md:items-center">
      <div className="min-w-0">
        <p className="text-preset-4-bold truncate text-grey-900">
          {bill.name}
        </p>
        <p className="mt-1 text-preset-5 text-grey-500">{bill.category}</p>
      </div>
      <p className="text-preset-4 text-grey-500">
        Due {formatDueDate(bill.date)}
      </p>
      <p className="text-preset-4-bold tabular-nums text-secondary-red">
        {billAmount(bill.amount)}
      </p>
      <span
        className={`w-fit rounded-full px-3 py-1 text-preset-5 font-bold ${
          statusStyles[status]
        }`}
      >
        {statusLabels[status]}
      </span>
    </li>
  );
}

export function RecurringBillsView({ data }: RecurringBillsViewProps) {
  const summary = getRecurringBillsSummary(data);
  const groups = getRecurringBillGroups(data);

  const summaryCards = [
    {
      label: "Total Bills",
      value: billAmount(summary.totalBills),
      detail: `${summary.billCount} bills this month`,
      className: "bg-grey-900 text-white",
      detailClassName: "text-grey-100",
    },
    {
      label: "Paid So Far",
      value: billAmount(summary.paid),
      detail: `${groups.paid.length} paid bills`,
      className: "bg-white text-grey-900",
      detailClassName: "text-grey-500",
    },
    {
      label: "Upcoming",
      value: billAmount(summary.upcoming),
      detail: `${groups.upcoming.length} upcoming bills`,
      className: "bg-white text-grey-900",
      detailClassName: "text-grey-500",
    },
    {
      label: "Overdue",
      value: billAmount(summary.overdue),
      detail: `${groups.overdue.length} overdue bills`,
      className: "bg-white text-grey-900",
      detailClassName: "text-grey-500",
    },
  ];

  const groupOrder: RecurringBillStatus[] = ["paid", "upcoming", "overdue"];

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
          Recurring Bills
        </h1>
        <p className="text-preset-4 text-grey-500">
          Track monthly commitments by due date, amount, and payment status.
        </p>
      </div>

      <section
        className="mt-8 grid gap-6 lg:grid-cols-4"
        aria-label="Monthly recurring bills summary"
      >
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl px-6 py-6 ${card.className}`}
          >
            <p className={`text-preset-4 ${card.detailClassName}`}>
              {card.label}
            </p>
            <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums">
              {card.value}
            </p>
            <p className={`mt-2 text-preset-5 ${card.detailClassName}`}>
              {card.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {groupOrder.map((status) => {
          const bills = groups[status];
          const total = bills.reduce(
            (sum, bill) => sum + Math.abs(bill.amount),
            0,
          );

          return (
            <Card key={status} className="overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-10 w-1.5 rounded-full ${groupAccent[status]}`}
                    aria-hidden
                  />
                  <div>
                    <h2 className="text-preset-2 text-grey-900">
                      {statusLabels[status]}
                    </h2>
                    <p className="mt-1 text-preset-5 text-grey-500">
                      Grouped by {statusLabels[status].toLowerCase()} status
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-preset-4-bold tabular-nums text-secondary-red">
                    {billAmount(total)}
                  </p>
                  <p className="mt-1 text-preset-5 text-grey-500">
                    {bills.length} bills
                  </p>
                </div>
              </div>

              <ul className="mt-6 divide-y divide-beige-100">
                {bills.map((bill) => (
                  <BillRow
                    key={`${status}-${bill.name}-${bill.date}`}
                    bill={bill}
                    status={status}
                  />
                ))}
              </ul>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
