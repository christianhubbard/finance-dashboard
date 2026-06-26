import type { RecurringBillStatus } from "@/lib/types";

export type StatusFilter = "all" | RecurringBillStatus;

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Bills" },
  { value: "paid", label: "Paid" },
  { value: "upcoming", label: "Upcoming" },
  { value: "dueSoon", label: "Due Soon" },
];

export const STATUS_LABELS: Record<RecurringBillStatus, string> = {
  paid: "Paid",
  upcoming: "Upcoming",
  dueSoon: "Due Soon",
};

export const STATUS_COLORS: Record<
  RecurringBillStatus,
  { label: string; badge: string }
> = {
  paid: {
    label: "text-secondary-green",
    badge: "bg-secondary-green/10 text-secondary-green",
  },
  upcoming: {
    label: "text-secondary-cyan",
    badge: "bg-secondary-cyan/10 text-secondary-cyan",
  },
  dueSoon: {
    label: "text-secondary-yellow",
    badge: "bg-secondary-yellow/10 text-secondary-yellow",
  },
};
