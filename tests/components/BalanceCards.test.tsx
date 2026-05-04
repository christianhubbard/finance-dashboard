import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BalanceCards } from "@/components/overview/BalanceCards";

describe("BalanceCards", () => {
  it("renders the three labels and matching formatted values", () => {
    render(
      <BalanceCards
        balance={{ current: 4836.0, income: 3814.25, expenses: 1700.5 }}
      />,
    );

    expect(screen.getByText("Current Balance")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();

    expect(screen.getByText("$4,836.00")).toBeInTheDocument();
    expect(screen.getByText("+$3,814.25")).toBeInTheDocument();
    expect(screen.getByText("-$1,700.50")).toBeInTheDocument();
  });
});
