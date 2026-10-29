import { describe, expect, it } from "vitest";
import {
  filterTransactions,
  paginate,
  queryTransactions,
  sortTransactions,
} from "@/lib/transactions";
import type { Transaction } from "@/lib/types";

function tx(partial: Partial<Transaction> & Pick<Transaction, "name" | "amount" | "date">): Transaction {
  return {
    avatar: "emma",
    category: "General",
    recurring: false,
    ...partial,
  };
}

const rows: Transaction[] = [
  tx({ name: "Emma Richardson", category: "Bills", date: "2022-11-26", amount: -75.5 }),
  tx({ name: "Urban Ledger", category: "General", date: "2022-11-23", amount: 200 }),
  tx({ name: "Spark Electric", category: "Bills", date: "2022-11-24", amount: -300 }),
  tx({ name: "Ember Coffee Co.", category: "Dining Out", date: "2022-11-20", amount: -6.5 }),
];

describe("filterTransactions", () => {
  it("matches merchant name case-insensitively", () => {
    const found = filterTransactions(rows, { search: "emma", category: "All Transactions" });
    expect(found.map((t) => t.name)).toEqual(["Emma Richardson"]);
  });

  it("filters by category and clears with All Transactions", () => {
    expect(
      filterTransactions(rows, { search: "", category: "Bills" }).map((t) => t.name),
    ).toEqual(["Emma Richardson", "Spark Electric"]);
    expect(
      filterTransactions(rows, { search: "", category: "All Transactions" }),
    ).toHaveLength(rows.length);
  });
});

describe("sortTransactions", () => {
  it("sorts latest and oldest by date", () => {
    expect(sortTransactions(rows, "latest")[0].name).toBe("Emma Richardson");
    expect(sortTransactions(rows, "oldest")[0].name).toBe("Ember Coffee Co.");
  });

  it("sorts names A to Z and Z to A", () => {
    expect(sortTransactions(rows, "a-z")[0].name).toBe("Ember Coffee Co.");
    expect(sortTransactions(rows, "z-a")[0].name).toBe("Urban Ledger");
  });

  it("sorts highest and lowest by absolute amount", () => {
    expect(sortTransactions(rows, "highest")[0].name).toBe("Spark Electric");
    expect(sortTransactions(rows, "lowest")[0].name).toBe("Ember Coffee Co.");
  });

  it("does not mutate the input", () => {
    const snapshot = rows.map((t) => t.name);
    sortTransactions(rows, "a-z");
    expect(rows.map((t) => t.name)).toEqual(snapshot);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it("returns 10 items and clamps the page", () => {
    expect(paginate(items, 1).items).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(paginate(items, 3).page).toBe(3);
    expect(paginate(items, 3).items).toEqual([20, 21, 22, 23, 24]);
    expect(paginate(items, 99).page).toBe(3);
    expect(paginate(items, 0).page).toBe(1);
    expect(paginate([], 1).totalPages).toBe(1);
  });
});

describe("queryTransactions", () => {
  it("filters, sorts, then paginates", () => {
    const result = queryTransactions(rows, {
      search: "",
      category: "Bills",
      sort: "highest",
      page: 1,
      pageSize: 1,
    });
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.items[0].name).toBe("Spark Electric");
  });
});
