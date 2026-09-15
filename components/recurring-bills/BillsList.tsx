import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { RecurringBill } from "@/lib/types";

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

const STATUS_LABEL = {
  paid: "Paid",
  upcoming: "Upcoming",
  dueSoon: "Due Soon",
} as const;

const STATUS_BADGE_CLASS = {
  paid: "bg-secondary-green/10 text-secondary-green",
  upcoming: "bg-secondary-cyan/15 text-secondary-cyan",
  dueSoon: "bg-secondary-yellow/30 text-grey-900",
} as const;

type BillStatus = keyof typeof STATUS_LABEL;

type BillsListProps = {
  bills: {
    paid: RecurringBill[];
    upcoming: RecurringBill[];
    dueSoon: RecurringBill[];
  };
};

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

function BillRow({ bill, status }: { bill: RecurringBill; status: BillStatus }) {
  return (
    <li className="flex items-center gap-4 border-b border-beige-100 py-4 last:border-b-0">
      <BillAvatar bill={bill} />
      <div className="min-w-0 flex-1">
        <p className="text-preset-4-bold text-grey-900 truncate">{bill.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0 text-preset-5 text-grey-500">
          <span>{bill.category}</span>
          <span aria-hidden>•</span>
          <span>{formatDisplayDate(bill.date)}</span>
        </div>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-preset-5 font-bold ${STATUS_BADGE_CLASS[status]}`}
      >
        {STATUS_LABEL[status]}
      </span>
      <p className="text-preset-4-bold shrink-0 text-secondary-red">
        {formatCurrency(bill.amount)}
      </p>
    </li>
  );
}

function BillGroup({
  title,
  status,
  bills,
}: {
  title: string;
  status: BillStatus;
  bills: RecurringBill[];
}) {
  return (
    <section>
      <h3 className="text-preset-3 text-grey-900">{title}</h3>
      {bills.length === 0 ? (
        <p className="mt-3 text-preset-4 text-grey-500">No bills</p>
      ) : (
        <ul className="mt-2 flex flex-col" aria-label={title}>
          {bills.map((bill, i) => (
            <BillRow
              key={`${bill.name}-${bill.date}-${status}-${i}`}
              bill={bill}
              status={status}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export function BillsList({ bills }: BillsListProps) {
  return (
    <Card>
      <h2 className="text-preset-2 text-grey-900">Bills</h2>
      <div className="mt-8 flex flex-col gap-8">
        <BillGroup title="Paid" status="paid" bills={bills.paid} />
        <BillGroup title="Upcoming" status="upcoming" bills={bills.upcoming} />
        <BillGroup title="Due Soon" status="dueSoon" bills={bills.dueSoon} />
      </div>
    </Card>
  );
}
