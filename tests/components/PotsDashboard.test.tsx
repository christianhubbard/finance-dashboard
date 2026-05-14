import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PotsDashboard } from "@/components/pots/PotsDashboard";
import type { Pot } from "@/lib/types";

const pots: Pot[] = [
  { name: "Savings", target: 2000, total: 159, theme: "green" },
  { name: "Gift", target: 1000, total: 110, theme: "cyan" },
];

describe("PotsDashboard", () => {
  it("renders each pot with current balance, target, and progress", () => {
    render(<PotsDashboard pots={pots} />);

    for (const pot of pots) {
      expect(
        screen.getByRole("heading", { level: 3, name: pot.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("progressbar", { name: `${pot.name} progress` }),
      ).toHaveAttribute("aria-valuenow");
    }

    expect(screen.getByText("$159.00")).toBeInTheDocument();
    expect(screen.getByText("$110.00")).toBeInTheDocument();
    expect(screen.getAllByText("$2,000.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$1,000.00").length).toBeGreaterThan(0);
  });

  it("summarizes saved and target totals", () => {
    render(<PotsDashboard pots={pots} />);

    expect(screen.getByText("$269.00")).toBeInTheDocument();
    expect(
      screen.getByText("$269.00 saved toward $3,000.00 across 2 pots."),
    ).toBeInTheDocument();
  });

  it("updates a pot balance locally when adding money", () => {
    render(
      <PotsDashboard
        pots={[{ name: "Savings", target: 500, total: 100, theme: "green" }]}
      />,
    );

    fireEvent.change(screen.getByLabelText("Amount for Savings"), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Money" }));

    expect(screen.getAllByText("$150.00")).toHaveLength(2);
    expect(
      screen.getByText("$150.00 saved toward $500.00 across 1 pot."),
    ).toBeInTheDocument();
  });

  it("prevents withdrawals from dropping a pot below zero", () => {
    render(
      <PotsDashboard
        pots={[{ name: "Gift", target: 500, total: 100, theme: "cyan" }]}
      />,
    );

    fireEvent.change(screen.getByLabelText("Amount for Gift"), {
      target: { value: "125" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Withdraw" }));

    expect(
      screen.getByText("$0.00 saved toward $500.00 across 1 pot."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Gift progress" }),
    ).toHaveAttribute("aria-valuenow", "0");
  });
});
