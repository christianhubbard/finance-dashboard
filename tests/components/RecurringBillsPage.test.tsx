import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RecurringBillsList } from "@/components/recurring-bills/RecurringBillsList";
import { RecurringBillsSummary } from "@/components/recurring-bills/RecurringBillsSummary";
import type { RecurringBillWithStatus, RecurringBillsSummary as Summary } from "@/lib/types";

const bills: RecurringBillWithStatus[] = [
  {
    avatar: "water",
    name: "City Water Works",
    category: "Water",
    date: "2022-11-01",
    amount: -30,
    recurring: true,
    status: "paid",
  },
  {
    avatar: "net",
    name: "NetStream Plus",
    category: "Streaming",
    date: "2022-12-01",
    amount: -9.99,
    recurring: true,
    status: "upcoming",
  },
  {
    avatar: "urban",
    name: "Urban Services Hub",
    category: "Internet",
    date: "2022-12-08",
    amount: -45,
    recurring: true,
    status: "dueSoon",
  },
];

const summary: Summary = {
  totalCount: 3,
  paidCount: 1,
  upcomingCount: 1,
  dueSoonCount: 1,
  paidTotal: 30,
  upcomingTotal: 9.99,
  dueSoonTotal: 45,
};

describe("RecurringBillsSummary", () => {
  it("renders monthly summary totals", () => {
    render(<RecurringBillsSummary summary={summary} />);

    expect(screen.getByText("Total Bills")).toBeInTheDocument();
    expect(screen.getByText("Paid So Far")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Due Soon")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("-$30.00")).toBeInTheDocument();
    expect(screen.getByText("-$9.99")).toBeInTheDocument();
    expect(screen.getByText("-$45.00")).toBeInTheDocument();
  });
});

describe("RecurringBillsList", () => {
  it("renders grouped bills by default", () => {
    render(<RecurringBillsList bills={bills} />);

    expect(screen.getByText("City Water Works")).toBeInTheDocument();
    expect(screen.getByText("NetStream Plus")).toBeInTheDocument();
    expect(screen.getByText("Urban Services Hub")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Paid" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Upcoming" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Due Soon" })).toBeInTheDocument();
  });

  it("filters bills by status", () => {
    render(<RecurringBillsList bills={bills} />);

    fireEvent.click(screen.getByRole("tab", { name: "Paid" }));

    expect(screen.getByText("City Water Works")).toBeInTheDocument();
    expect(screen.queryByText("NetStream Plus")).not.toBeInTheDocument();
    expect(screen.queryByText("Urban Services Hub")).not.toBeInTheDocument();
  });
});
