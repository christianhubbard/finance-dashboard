import { describe, expect, it } from "vitest";
import {
  ALL_TRANSACTIONS,
  filterTransactions,
  getTransactionsPage,
  paginateTransactions,
  parseTransactionCategory,
  parseTransactionSort,
  sortTransactions,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const tx = (
  name: string,
  date: string,
  amount: number,
  category = "General",
): Transaction => ({
  avatar: "x",
  name,
  category,
  date,
  amount,
  recurring: false,
});

const sample: Transaction[] = [
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

describe("parseTransactionCategory", () => {
  it("accepts the ticket category list and rejects unknown values", () => {
    expect(parseTransactionCategory("All Transactions")).toBe(ALL_TRANSACTIONS);
    expect(parseTransactionCategory("Transportation")).toBe("Transportation");
    expect(parseTransactionCategory("Rent")).toBeUndefined();
  });
});

describe("parseTransactionSort", () => {
  it("accepts the six sort modes and rejects unknown values", () => {
    expect(parseTransactionSort("Latest")).toBe("Latest");
    expect(parseTransactionSort("Z to A")).toBe("Z to A");
    expect(parseTransactionSort("Newest")).toBeUndefined();
  });
});

describe("filterTransactions", () => {
  it("returns all transactions when filters are empty", () => {
    expect(
      filterTransactions(sample, { search: "", category: ALL_TRANSACTIONS }),
    ).toHaveLength(12);
  });

  it("filters by merchant name case-insensitively and trims whitespace", () => {
    const result = filterTransactions(sample, {
      search: "  EMMA  ",
      category: ALL_TRANSACTIONS,
    });
    expect(result.map((t) => t.name)).toEqual(["Emma Richardson"]);
  });

  it("does not match category text in search", () => {
    const result = filterTransactions(sample, {
      search: "groceries",
      category: ALL_TRANSACTIONS,
    });
    expect(result).toHaveLength(0);
  });

  it("filters by category", () => {
    const result = filterTransactions(sample, {
      search: "",
      category: "Groceries",
    });
    expect(result.map((t) => t.name)).toEqual([
      "Urban Services Hub",
      "Liam Hughes",
      "Northwind Traders",
    ]);
  });

  it("applies search and category together", () => {
    const result = filterTransactions(sample, {
      search: "urban",
      category: "Groceries",
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Urban Services Hub");
  });

  it("does not mutate the input array", () => {
    const original = [...sample];
    filterTransactions(sample, { search: "emma", category: "General" });
    expect(sample).toEqual(original);
  });
});

describe("sortTransactions", () => {
  it("sorts by latest date first", () => {
    const names = sortTransactions(sample, "Latest").map((t) => t.name);
    expect(names[0]).toBe("Emma Richardson");
    expect(names[names.length - 1]).toBe("Northwind Traders");
  });

  it("sorts by oldest date first", () => {
    const names = sortTransactions(sample, "Oldest").map((t) => t.name);
    expect(names[0]).toBe("Northwind Traders");
    expect(names[names.length - 1]).toBe("Savory Bites Bistro");
  });

  it("sorts A to Z by merchant name", () => {
    const names = sortTransactions(sample, "A to Z").map((t) => t.name);
    expect(names[0]).toBe("Daniel Carter");
    expect(names[names.length - 1]).toBe("Urban Services Hub");
  });

  it("sorts Z to A by merchant name", () => {
    const names = sortTransactions(sample, "Z to A").map((t) => t.name);
    expect(names[0]).toBe("Urban Services Hub");
    expect(names[names.length - 1]).toBe("Daniel Carter");
  });

  it("sorts by highest absolute amount", () => {
    const amounts = sortTransactions(sample, "Highest").map((t) => t.amount);
    expect(amounts[0]).toBe(120);
    expect(amounts[1]).toBe(-88.1);
  });

  it("sorts by lowest absolute amount", () => {
    const amounts = sortTransactions(sample, "Lowest").map((t) => t.amount);
    expect(amounts[0]).toBe(-5);
    expect(amounts[1]).toBe(-10);
  });

  it("ranks a large debit above a smaller credit for Highest", () => {
    const mixed = [tx("Credit", "2024-01-02", 100), tx("Debit", "2024-01-01", -250)];
    expect(sortTransactions(mixed, "Highest").map((t) => t.name)).toEqual([
      "Debit",
      "Credit",
    ]);
  });

  it("does not mutate the input array", () => {
    const original = [...sample];
    sortTransactions(sample, "A to Z");
    expect(sample).toEqual(original);
  });
});

describe("paginateTransactions", () => {
  it("returns the first page of 10 items", () => {
    const result = paginateTransactions(sample, 1, 10);
    expect(result.items).toHaveLength(10);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(2);
    expect(result.total).toBe(12);
  });

  it("returns the remaining items on the second page", () => {
    const result = paginateTransactions(sample, 2, 10);
    expect(result.items).toHaveLength(2);
    expect(result.page).toBe(2);
  });

  it("clamps page to the valid range", () => {
    expect(paginateTransactions(sample, 99, 10).page).toBe(2);
    expect(paginateTransactions(sample, 0, 10).page).toBe(1);
  });

  it("returns one empty page when there are no transactions", () => {
    const result = paginateTransactions([], 3, 10);
    expect(result.totalPages).toBe(1);
    expect(result.page).toBe(1);
    expect(result.items).toHaveLength(0);
  });
});

describe("getTransactionsPage", () => {
  it("composes filter, sort, and pagination", () => {
    const result = getTransactionsPage(sample, {
      search: "",
      category: "Entertainment",
      sort: "Highest",
      page: 1,
    });
    expect(result.items.map((t) => t.name)).toEqual([
      "Trail Hiking Gear",
      "Pixel Playground",
      "James Thompson",
    ]);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(1);
  });
});
