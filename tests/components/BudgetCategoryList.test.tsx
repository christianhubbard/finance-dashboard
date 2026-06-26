import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BudgetCategoryList } from "@/components/budgets/BudgetCategoryList";
import type { Budget } from "@/lib/types";

const budgets: Budget[] = [
  { category: "Entertainment", maximum: 100, spent: 50, theme: "green" },
  { category: "Dining Out", maximum: 200, spent: 75.5, theme: "yellow" },
  { category: "Bills", maximum: 300, spent: 350, theme: "cyan" },
];

describe("BudgetCategoryList", () => {
  it("renders the section heading and labeled list", () => {
    render(<BudgetCategoryList budgets={budgets} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Categories" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Budget categories" }),
    ).toBeInTheDocument();
  });

  it("renders each category with spent and maximum amounts", () => {
    render(<BudgetCategoryList budgets={budgets} />);
    expect(screen.getByText("Entertainment")).toBeInTheDocument();
    expect(screen.getByText("Dining Out")).toBeInTheDocument();
    expect(screen.getByText("Bills")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("of $100.00")).toBeInTheDocument();
    expect(screen.getByText("of $200.00")).toBeInTheDocument();
    expect(screen.getByText("of $300.00")).toBeInTheDocument();
  });

  it("shows remaining amount when under budget", () => {
    render(<BudgetCategoryList budgets={budgets} />);
    expect(screen.getByText("$50.00 remaining")).toBeInTheDocument();
    expect(screen.getByText("$124.50 remaining")).toBeInTheDocument();
  });

  it("shows over amount when over budget", () => {
    render(<BudgetCategoryList budgets={budgets} />);
    expect(screen.getByText("$50.00 over")).toBeInTheDocument();
  });

  it("renders an empty list when given no budgets", () => {
    render(<BudgetCategoryList budgets={[]} />);
    const list = screen.getByRole("list", { name: "Budget categories" });
    expect(list.children).toHaveLength(0);
  });
});
