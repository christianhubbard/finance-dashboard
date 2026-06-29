import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecurringBillsView } from "@/components/recurring-bills/RecurringBillsView";
import type { FinanceData, RecurringBill } from "@/lib/types";

const bill = (
  name: string,
  category: string,
  date: string,
  amount: number,
): RecurringBill => ({
  avatar: "x",
  name,
  category,
  date,
  amount,
  recurring: true,
});

const data: FinanceData = {
  balance: { current: 0, income: 0, expenses: 0 },
  pots: [],
  transactions: [],
  budgets: [],
  recurringBills: {
    paid: [
      bill("City Water Works", "Water", "2022-11-01", -30),
      bill("Spark Electric", "Electric", "2022-11-05", -100),
    ],
    upcoming: [bill("NetStream Plus", "Streaming", "2022-12-01", -9.99)],
    dueSoon: [bill("Urban Services Hub", "Internet", "2022-12-08", -45)],
  },
};

describe("RecurringBillsView", () => {
  it("renders monthly summary totals", () => {
    render(<RecurringBillsView data={data} />);

    expect(screen.getByText("Total Bills")).toBeInTheDocument();
    expect(screen.getByText("-$184.99")).toBeInTheDocument();
    expect(screen.getByText("Paid So Far")).toBeInTheDocument();
    expect(screen.getAllByText("-$130.00")).toHaveLength(2);
    expect(screen.getAllByText("Upcoming")).toHaveLength(3);
    expect(screen.getByText("1 bill upcoming")).toBeInTheDocument();
    expect(screen.getAllByText("-$9.99")).toHaveLength(3);
  });

  it("groups bills by status and shows due date, amount, and status", () => {
    render(<RecurringBillsView data={data} />);

    expect(screen.getByRole("heading", { name: "Paid" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Upcoming" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Overdue" })).toBeInTheDocument();

    expect(screen.getByText("City Water Works")).toBeInTheDocument();
    expect(screen.getByText("Due Nov 1, 2022")).toBeInTheDocument();
    expect(screen.getAllByText("-$30.00")).toHaveLength(1);

    expect(screen.getByText("Urban Services Hub")).toBeInTheDocument();
    expect(screen.getByText("Due Dec 8, 2022")).toBeInTheDocument();
    expect(screen.getAllByText("Overdue")).toHaveLength(3);
  });
});
