import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { RecurringBillsDashboard } from "@/components/recurring-bills/RecurringBillsDashboard";
import type { FinanceData, RecurringBill } from "@/lib/types";

const bill = (
  name: string,
  amount: number,
  date: string,
  category = "Bills",
): RecurringBill => ({
  avatar: "x",
  name,
  category,
  date,
  amount,
  recurring: true,
});

const recurringBills: FinanceData["recurringBills"] = {
  paid: [
    bill("Water Works", -30, "2024-01-01", "Water"),
    bill("Power Company", -70, "2024-01-05", "Electric"),
  ],
  upcoming: [bill("Rent", -1200, "2024-02-01", "Rent")],
  dueSoon: [bill("Internet Provider", -45, "2024-01-20", "Internet")],
};

describe("RecurringBillsDashboard", () => {
  it("renders the recurring bills page heading and monthly summary totals", () => {
    render(<RecurringBillsDashboard recurringBills={recurringBills} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Recurring Bills" }),
    ).toBeInTheDocument();
    expect(screen.getByText("4 total bills")).toBeInTheDocument();
    expect(screen.getByText("Total Bills")).toBeInTheDocument();
    expect(screen.getByText("-$1,345.00")).toBeInTheDocument();
    expect(screen.getByText("Paid So Far")).toBeInTheDocument();
    expect(screen.getByText("-$100.00")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("-$1,200.00")).toBeInTheDocument();
  });

  it("groups bills by paid, upcoming, and overdue status", () => {
    render(<RecurringBillsDashboard recurringBills={recurringBills} />);

    const paidList = screen.getByRole("list", { name: "Paid bills" });
    expect(within(paidList).getByText("Water Works")).toBeInTheDocument();
    expect(within(paidList).getByText("Power Company")).toBeInTheDocument();

    const upcomingList = screen.getByRole("list", { name: "Upcoming bills" });
    expect(within(upcomingList).getByText("Rent")).toBeInTheDocument();

    const overdueList = screen.getByRole("list", { name: "Overdue bills" });
    expect(within(overdueList).getByText("Internet Provider")).toBeInTheDocument();
  });

  it("shows due dates, categories, amounts, and status labels for each bill", () => {
    render(<RecurringBillsDashboard recurringBills={recurringBills} />);

    const overdueList = screen.getByRole("list", { name: "Overdue bills" });
    expect(within(overdueList).getByText("Internet")).toBeInTheDocument();
    expect(within(overdueList).getByText("Due Jan 20, 2024")).toBeInTheDocument();
    expect(within(overdueList).getByText("-$45.00")).toBeInTheDocument();
    expect(within(overdueList).getByText("Overdue")).toBeInTheDocument();
  });
});
