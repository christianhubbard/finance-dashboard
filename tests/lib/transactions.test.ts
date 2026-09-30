import { describe, expect, it } from "vitest";
import {
  ALL_CATEGORIES,
  PAGE_SIZE,
  filterTransactions,
  paginateTransactions,
  queryTransactions,
  sortTransactions,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

const tx = (
  name: string,
  date: string,
  amount: number,
  category = "General",
): Transaction => ({
  avatar: "emma",
  name,
  category,
  date,
  amount,
  recurring: false,
});

const transactions: Transaction[] = [
  tx("Emma Richardson", "2022-11-28", -100.25, "General"),
  tx("Urban Services Hub", "2022-11-27", -65.5, "Groceries"),
  tx("Spark Electric", "2022-11-24", -250, "Bills"),
  tx("Urban Ledger", "2022-11-23", 1200, "General"),
  tx("Ember Coffee Co.", "2022-11-20", -6.5, "Dining Out"),
];

const names = (list: Transaction[]) => list.map((t) => t.name);

const numbered = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    tx(`Tx ${i + 1}`, `2022-11-${String(i + 1).padStart(2, "0")}`, -i),
  );

describe("filterTransactions", () => {
  it("returns everything for an empty search and All Transactions", () => {
    expect(
      filterTransactions(transactions, { search: "", category: ALL_CATEGORIES }),
    ).toEqual(transactions);
  });

  it("matches merchant names case-insensitively and ignores surrounding whitespace", () => {
    expect(
      names(
        filterTransactions(transactions, {
          search: "  urban ",
          category: ALL_CATEGORIES,
        }),
      ),
    ).toEqual(["Urban Services Hub", "Urban Ledger"]);
  });

  it("does not match on category text", () => {
    expect(
      filterTransactions(transactions, {
        search: "groceries",
        category: ALL_CATEGORIES,
      }),
    ).toEqual([]);
  });

  it("keeps only the selected category", () => {
    expect(
      names(filterTransactions(transactions, { search: "", category: "General" })),
    ).toEqual(["Emma Richardson", "Urban Ledger"]);
  });

  it("returns nothing for a category with no transactions", () => {
    expect(
      filterTransactions(transactions, { search: "", category: "Education" }),
    ).toEqual([]);
  });

  it("applies search and category together", () => {
    expect(
      names(
        filterTransactions(transactions, { search: "urban", category: "General" }),
      ),
    ).toEqual(["Urban Ledger"]);
  });
});

describe("sortTransactions", () => {
  it("sorts Latest by date descending", () => {
    expect(names(sortTransactions(transactions, "Latest"))[0]).toBe(
      "Emma Richardson",
    );
  });

  it("sorts Oldest by date ascending", () => {
    expect(names(sortTransactions(transactions, "Oldest"))[0]).toBe(
      "Ember Coffee Co.",
    );
  });

  it("sorts A to Z and Z to A by merchant name", () => {
    expect(names(sortTransactions(transactions, "A to Z"))).toEqual([
      "Ember Coffee Co.",
      "Emma Richardson",
      "Spark Electric",
      "Urban Ledger",
      "Urban Services Hub",
    ]);
    expect(names(sortTransactions(transactions, "Z to A"))).toEqual([
      "Urban Services Hub",
      "Urban Ledger",
      "Spark Electric",
      "Emma Richardson",
      "Ember Coffee Co.",
    ]);
  });

  it("sorts Highest and Lowest by signed amount", () => {
    expect(sortTransactions(transactions, "Highest").map((t) => t.amount)).toEqual(
      [1200, -6.5, -65.5, -100.25, -250],
    );
    expect(sortTransactions(transactions, "Lowest").map((t) => t.amount)).toEqual(
      [-250, -100.25, -65.5, -6.5, 1200],
    );
  });

  it("does not mutate the input array", () => {
    const original = [...transactions];
    sortTransactions(transactions, "A to Z");
    expect(transactions).toEqual(original);
  });
});

describe("paginateTransactions", () => {
  it("defaults to 10 per page", () => {
    const result = paginateTransactions(numbered(23), 1);
    expect(PAGE_SIZE).toBe(10);
    expect(result.items).toHaveLength(10);
    expect(result.pageCount).toBe(3);
  });

  it("returns the remainder on the last page", () => {
    const result = paginateTransactions(numbered(23), 3);
    expect(names(result.items)).toEqual(["Tx 21", "Tx 22", "Tx 23"]);
    expect(result.page).toBe(3);
  });

  it("clamps out-of-range pages", () => {
    expect(paginateTransactions(numbered(23), 9).page).toBe(3);
    expect(paginateTransactions(numbered(23), 0).page).toBe(1);
  });

  it("reports a single empty page for no transactions", () => {
    expect(paginateTransactions([], 1)).toEqual({
      items: [],
      page: 1,
      pageCount: 1,
    });
  });
});

describe("queryTransactions", () => {
  it("filters, then sorts, then paginates", () => {
    const result = queryTransactions(
      transactions,
      { search: "", category: "General", sort: "Lowest", page: 1 },
      1,
    );
    expect(names(result.items)).toEqual(["Emma Richardson"]);
    expect(result.pageCount).toBe(2);
  });

  it("clamps the page to the filtered result", () => {
    const result = queryTransactions(numbered(23), {
      search: "Tx 1",
      category: ALL_CATEGORIES,
      sort: "Oldest",
      page: 3,
    });
    expect(result.page).toBe(2);
    expect(names(result.items)).toEqual(["Tx 19"]);
  });
});
