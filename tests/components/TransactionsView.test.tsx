import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import type { Transaction } from "@/lib/types";

const tx = (
  name: string,
  date: string,
  amount: number,
  category: string,
): Transaction => ({
  avatar: "emma",
  name,
  category,
  date,
  amount,
  recurring: false,
});

const transactions: Transaction[] = [
  tx("Emma Richardson", "2024-08-19", 75.5, "General"),
  tx("Savory Bites Bistro", "2024-08-19", -55.5, "Dining Out"),
  tx("Daniel Carter", "2024-08-18", -42.3, "General"),
  tx("Sun Park", "2024-08-17", 120, "General"),
  tx("Urban Services Hub", "2024-08-17", -65, "Groceries"),
  tx("Liam Hughes", "2024-08-15", 65.75, "Groceries"),
  tx("Lily Ramirez", "2024-08-14", 50, "General"),
  tx("Ethan Clark", "2024-08-13", -32.5, "Dining Out"),
  tx("James Thompson", "2024-08-11", -5, "Entertainment"),
  tx("Pixel Playground", "2024-08-11", -10, "Entertainment"),
  tx("Trail Hiking Gear", "2024-08-10", -45.99, "Entertainment"),
  tx("Northwind Traders", "2024-08-09", -88.1, "Groceries"),
];

function listNames(): string[] {
  const list = screen.getByRole("list", { name: "Transactions" });
  return within(list)
    .getAllByRole("listitem")
    .map((item) => item.querySelector("p")?.textContent ?? "");
}

describe("TransactionsView", () => {
  it("shows the first 10 transactions sorted by latest date", () => {
    render(<TransactionsView transactions={transactions} />);
    expect(listNames()).toEqual([
      "Emma Richardson",
      "Savory Bites Bistro",
      "Daniel Carter",
      "Sun Park",
      "Urban Services Hub",
      "Liam Hughes",
      "Lily Ramirez",
      "Ethan Clark",
      "James Thompson",
      "Pixel Playground",
    ]);
    expect(screen.queryByText("Northwind Traders")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("filters by merchant name", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByPlaceholderText("Search transaction"), {
      target: { value: "emma" },
    });
    expect(listNames()).toEqual(["Emma Richardson"]);
  });

  it("filters by category and shows an empty state when nothing matches", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Bills" },
    });
    expect(screen.queryByRole("list", { name: "Transactions" })).not.toBeInTheDocument();
    expect(
      screen.getByText("No transactions match your filters."),
    ).toBeInTheDocument();
  });

  it("sorts by highest absolute amount", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "Highest" },
    });
    expect(listNames()[0]).toBe("Sun Park");
    expect(listNames()[1]).toBe("Northwind Traders");
  });

  it("paginates with numbered buttons and disables Next on the last page", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(listNames()).toEqual(["Trail Hiking Gear", "Northwind Traders"]);
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("resets to page 1 when search, sort, or category changes", () => {
    render(<TransactionsView transactions={transactions} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(listNames()).toEqual(["Trail Hiking Gear", "Northwind Traders"]);

    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "Oldest" },
    });
    expect(listNames()[0]).toBe("Northwind Traders");
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
  });
});
