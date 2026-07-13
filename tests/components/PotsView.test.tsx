import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { PotCard } from "@/components/pots/PotCard";
import { PotsView } from "@/components/pots/PotsView";
import type { Pot } from "@/lib/types";

const samplePot: Pot = {
  name: "Savings",
  target: 2000,
  total: 159,
  theme: "green",
};

const samplePots: Pot[] = [
  samplePot,
  {
    name: "Gift",
    target: 1000,
    total: 110,
    theme: "cyan",
  },
];

describe("PotCard", () => {
  it("renders pot name, balance, target, and progress", () => {
    render(
      <PotCard pot={samplePot} onAddMoney={vi.fn()} onWithdraw={vi.fn()} />,
    );

    expect(screen.getByRole("heading", { name: "Savings" })).toBeInTheDocument();
    expect(screen.getByText("$159.00")).toBeInTheDocument();
    expect(screen.getByText("$2,000.00")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Savings progress" })).toHaveAttribute(
      "aria-valuenow",
      "8",
    );
  });

  it("calls onAddMoney when confirming an add action", () => {
    const onAddMoney = vi.fn();

    render(
      <PotCard pot={samplePot} onAddMoney={onAddMoney} onWithdraw={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add Money" }));
    fireEvent.change(screen.getByLabelText("Amount to add"), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onAddMoney).toHaveBeenCalledWith(25);
  });

  it("calls onWithdraw when confirming a withdraw action", () => {
    const onWithdraw = vi.fn();

    render(
      <PotCard pot={samplePot} onAddMoney={vi.fn()} onWithdraw={onWithdraw} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Withdraw" }));
    fireEvent.change(screen.getByLabelText("Amount to withdraw"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onWithdraw).toHaveBeenCalledWith(10);
  });
});

describe("PotsView", () => {
  it("renders all pots and updates balance locally when money is added", () => {
    render(<PotsView initialPots={samplePots} />);

    expect(screen.getByRole("heading", { name: "Pots" })).toBeInTheDocument();
    expect(screen.getByText("$269.00")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gift" })).toBeInTheDocument();

    const addButtons = screen.getAllByRole("button", { name: "Add Money" });
    fireEvent.click(addButtons[0]);
    fireEvent.change(screen.getByLabelText("Amount to add"), {
      target: { value: "41" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(screen.getByText("$200.00")).toBeInTheDocument();
    expect(screen.getByText("$310.00")).toBeInTheDocument();
  });

  it("does not let a pot balance go below zero on withdraw", () => {
    render(<PotsView initialPots={samplePots} />);

    const withdrawButtons = screen.getAllByRole("button", { name: "Withdraw" });
    fireEvent.click(withdrawButtons[1]);
    fireEvent.change(screen.getByLabelText("Amount to withdraw"), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    const giftCard = screen.getByRole("heading", { name: "Gift" }).closest("div.rounded-2xl");
    expect(giftCard).toHaveTextContent("$0.00");

    const totalHeader = screen.getByText("Total saved across all pots").parentElement;
    expect(within(totalHeader!).getByText("$159.00")).toBeInTheDocument();
  });
});
