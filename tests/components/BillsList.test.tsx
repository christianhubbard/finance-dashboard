import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BillsList } from "@/components/recurring-bills/BillsList";
import type { RecurringBill } from "@/lib/types";

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

const bills = {
  paid: [bill("Netflix", -15, "2022-11-01", "Streaming")],
  upcoming: [bill("Rent", -1200, "2022-12-01", "Housing")],
  dueSoon: [bill("Power", -80, "2022-12-08", "Electric")],
};

describe("BillsList", () => {
  it("renders grouped headings", () => {
    render(<BillsList bills={bills} />);
    expect(screen.getByRole("heading", { level: 2, name: "Bills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Paid" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Upcoming" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Due Soon" })).toBeInTheDocument();
  });

  it("renders one row per status with date, amount, and badge", () => {
    render(<BillsList bills={bills} />);

    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Streaming")).toBeInTheDocument();
    expect(screen.getByText("Nov 1, 2022")).toBeInTheDocument();
    expect(screen.getByText("-$15.00")).toBeInTheDocument();

    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Dec 1, 2022")).toBeInTheDocument();
    expect(screen.getByText("-$1,200.00")).toBeInTheDocument();

    expect(screen.getByText("Power")).toBeInTheDocument();
    expect(screen.getByText("Dec 8, 2022")).toBeInTheDocument();
    expect(screen.getByText("-$80.00")).toBeInTheDocument();

    expect(screen.getAllByText("Paid")).toHaveLength(2);
    expect(screen.getAllByText("Upcoming")).toHaveLength(2);
    expect(screen.getAllByText("Due Soon")).toHaveLength(2);
  });

  it("shows an empty state when a bucket has no bills", () => {
    render(
      <BillsList
        bills={{ paid: [], upcoming: bills.upcoming, dueSoon: bills.dueSoon }}
      />,
    );
    expect(screen.getByText("No bills")).toBeInTheDocument();
  });
});
