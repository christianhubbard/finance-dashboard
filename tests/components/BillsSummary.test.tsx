import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BillsSummary } from "@/components/recurring-bills/BillsSummary";

const summary = {
  totalCount: 6,
  totalAmount: 2484.99,
  paidCount: 3,
  paidAmount: 1280,
  upcomingCount: 3,
  upcomingAmount: 1204.99,
};

describe("BillsSummary", () => {
  it("renders the three labels and matching formatted values", () => {
    render(<BillsSummary summary={summary} />);

    expect(screen.getByText("Total Bills")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();

    expect(screen.getByText("$2,484.99")).toBeInTheDocument();
    expect(screen.getByText("$1,280.00")).toBeInTheDocument();
    expect(screen.getByText("$1,204.99")).toBeInTheDocument();
  });

  it("shows bill counts for each card", () => {
    render(<BillsSummary summary={summary} />);
    expect(screen.getByText("6 bills")).toBeInTheDocument();
    expect(screen.getAllByText("3 bills")).toHaveLength(2);
  });
});
