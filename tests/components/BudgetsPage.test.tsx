import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetsHeader } from "@/components/budgets/BudgetsHeader";
import type { Budget, FinanceData } from "@/lib/types";

const budget: Budget = {
  category: "Entertainment",
  maximum: 50,
  spent: 50,
  theme: "green",
};

const data = {
  transactions: [
    {
      avatar: "trail",
      name: "Trail Hiking Gear",
      category: "Entertainment",
      date: "2022-11-22",
      amount: -45.99,
      recurring: false,
    },
  ],
} as unknown as FinanceData;

describe("BudgetsHeader", () => {
  it("renders a disabled Add New Budget button", () => {
    render(<BudgetsHeader />);
    const button = screen.getByRole("button", { name: "+ Add New Budget" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});

describe("BudgetCard", () => {
  it("renders a disabled options button", () => {
    render(<BudgetCard budget={budget} data={data} />);
    const button = screen.getByRole("button", {
      name: "Entertainment options",
    });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("links See All to the encoded category query", () => {
    render(<BudgetCard budget={budget} data={data} />);
    const link = screen.getByRole("link", { name: /see all/i });
    expect(link).toHaveAttribute(
      "href",
      "/transactions?category=Entertainment",
    );
  });

  it("encodes category names with spaces in See All href", () => {
    const diningBudget: Budget = {
      category: "Dining Out",
      maximum: 300,
      spent: 120,
      theme: "cyan",
    };
    render(<BudgetCard budget={diningBudget} data={data} />);
    const link = screen.getByRole("link", { name: /see all/i });
    expect(link).toHaveAttribute(
      "href",
      "/transactions?category=Dining%20Out",
    );
  });
});
