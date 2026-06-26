import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetsPage from "@/app/budgets/page";

describe("BudgetsPage", () => {
  it("renders the page heading", () => {
    render(<BudgetsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Budgets" }),
    ).toBeInTheDocument();
  });

  it("renders summary and category sections", () => {
    render(<BudgetsPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Spending Summary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Categories" }),
    ).toBeInTheDocument();
  });

  it("renders budget categories from finance data", () => {
    render(<BudgetsPage />);
    expect(screen.getByText("Entertainment")).toBeInTheDocument();
    expect(screen.getByText("Bills")).toBeInTheDocument();
    expect(screen.getByText("Dining Out")).toBeInTheDocument();
    expect(screen.getByText("Personal Care")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("computes totals from finance data", () => {
    render(<BudgetsPage />);
    expect(screen.getByText("$715.00")).toBeInTheDocument();
    expect(screen.getByText("$1,600.00")).toBeInTheDocument();
  });
});
