import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecurringBillsCard } from "@/components/overview/RecurringBillsCard";
import type { FinanceData, RecurringBill } from "@/lib/types";

const bill = (name: string, amount: number): RecurringBill => ({
  avatar: "x",
  name,
  category: "Bills",
  date: "2024-01-01",
  amount,
  recurring: true,
});

const data: FinanceData = {
  balance: { current: 0, income: 0, expenses: 0 },
  pots: [],
  transactions: [],
  budgets: [],
  recurringBills: {
    paid: [bill("Netflix", -15), bill("Spotify", -10)],
    upcoming: [bill("Rent", -1200)],
    dueSoon: [bill("Power", -80), bill("Water", -45), bill("Gas", -60)],
  },
};

describe("RecurringBillsCard", () => {
  it("renders the section heading", () => {
    render(<RecurringBillsCard data={data} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Recurring Bills" }),
    ).toBeInTheDocument();
  });

  it("computes the paid total as a negative dollar amount", () => {
    render(<RecurringBillsCard data={data} />);
    expect(screen.getByText("-$25.00")).toBeInTheDocument();
  });

  it("computes the upcoming total as a negative dollar amount", () => {
    render(<RecurringBillsCard data={data} />);
    expect(screen.getByText("-$1,200.00")).toBeInTheDocument();
  });

  it("renders bill counts for each section", () => {
    render(<RecurringBillsCard data={data} />);
    expect(screen.getByText("2 bills")).toBeInTheDocument();
    expect(screen.getByText("1 bills")).toBeInTheDocument();
    expect(screen.getByText("3 bills")).toBeInTheDocument();
  });
});
