import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RecurringBillsView } from "@/components/recurring-bills/RecurringBillsView";
import type { FinanceData, RecurringBill } from "@/lib/types";

const bill = (
  name: string,
  amount: number,
  date: string,
): RecurringBill => ({
  avatar: "emma",
  name,
  category: "Bills",
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
    paid: [bill("Netflix", -15, "2024-01-01")],
    upcoming: [bill("Rent", -1200, "2024-01-20")],
    dueSoon: [bill("Power", -80, "2024-01-12")],
  },
};

describe("RecurringBillsView", () => {
  it("renders monthly summary totals", () => {
    render(<RecurringBillsView data={data} />);
    expect(screen.getByText("Total Bills")).toBeInTheDocument();
    expect(screen.getByText("Paid so far")).toBeInTheDocument();
    expect(screen.getByText("$1,295.00")).toBeInTheDocument();
    expect(screen.getByText("$15.00")).toBeInTheDocument();
    expect(screen.getByText("$1,280.00")).toBeInTheDocument();
    expect(screen.getByText("3 bills this month")).toBeInTheDocument();
    expect(screen.getByText(/2 remaining/)).toBeInTheDocument();
  });

  it("lists bills with due date, amount, and status", () => {
    render(<RecurringBillsView data={data} />);
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Power")).toBeInTheDocument();
    expect(screen.getByText("-$15.00")).toBeInTheDocument();
    expect(screen.getByText("-$80.00")).toBeInTheDocument();
    expect(screen.getByText("-$1,200.00")).toBeInTheDocument();
    expect(screen.getAllByText(/Due /)).toHaveLength(3);
    const list = screen.getByRole("list", { name: "Recurring bills" });
    expect(list).toHaveTextContent("Paid");
    expect(list).toHaveTextContent("Upcoming");
    expect(list).toHaveTextContent("Overdue");
  });

  it("filters the list by status", () => {
    render(<RecurringBillsView data={data} />);

    fireEvent.click(screen.getByRole("tab", { name: "Paid" }));
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.queryByText("Rent")).not.toBeInTheDocument();
    expect(screen.queryByText("Power")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Overdue" }));
    expect(screen.getByText("Power")).toBeInTheDocument();
    expect(screen.queryByText("Netflix")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "All" }));
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Power")).toBeInTheDocument();
  });
});
