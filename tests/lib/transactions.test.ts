import { describe, expect, it } from "vitest";
import type { Transaction } from "@/lib/types";
import {
  filterTransactions,
  paginateTransactions,
  queryTransactions,
  sortTransactions,
} from "@/lib/transactions";

const tx = (
  overrides: Partial<Transaction> & Pick<Transaction, "name" | "date" | "amount">,
): Transaction => ({
  avatar: "x",
  category: "General",
  recurring: false,
  ...overrides,
});

const sample: Transaction[] = [
  tx({ name: "Emma Richardson", date: "2022-11-28", amount: -100.25, category: "General" }),
  tx({ name: "Urban Ledger", date: "2022-11-23", amount: 1200, category: "General" }),
  tx({ name: "Spark Electric", date: "2022-11-24", amount: -250, category: "Bills" }),
  tx({ name: "Ember Coffee Co.", date: "2022-11-20", amount: -6.5, category: "Dining Out" }),
  tx({ name: "Savory Eats", date: "2022-11-26", amount: -17.5, category: "Dining Out" }),
];

describe("filterTransactions", () => {
  it("matches merchant name case-insensitively", () => {
    const result = filterTransactions(sample, { search: "emma" });
    expect(result.map((t) => t.name)).toEqual(["Emma Richardson"]);
  });

  it("ignores surrounding whitespace in the search query", () => {
    const result = filterTransactions(sample, { search: "  ledger  " });
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Urban Ledger");
  });

  it("filters by category and leaves All as a no-op", () => {
    expect(filterTransactions(sample, { category: "Dining Out" })).toHaveLength(2);
    expect(filterTransactions(sample, { category: "all" })).toHaveLength(sample.length);
  });

  it("applies search and category together", () => {
    const result = filterTransactions(sample, {
      search: "e",
      category: "Dining Out",
    });
    expect(result.map((t) => t.name)).toEqual(["Ember Coffee Co.", "Savory Eats"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterTransactions(sample, { search: "zzz" })).toEqual([]);
  });
});

describe("sortTransactions", () => {
  it("sorts latest first by default", () => {
    expect(sortTransactions(sample).map((t) => t.name)).toEqual([
      "Emma Richardson",
      "Savory Eats",
      "Spark Electric",
      "Urban Ledger",
      "Ember Coffee Co.",
    ]);
  });

  it("sorts oldest first", () => {
    expect(sortTransactions(sample, "oldest")[0]?.name).toBe("Ember Coffee Co.");
  });

  it("sorts A to Z and Z to A by merchant name", () => {
    expect(sortTransactions(sample, "nameAsc")[0]?.name).toBe("Ember Coffee Co.");
    expect(sortTransactions(sample, "nameDesc")[0]?.name).toBe("Urban Ledger");
  });

  it("sorts highest and lowest by signed amount", () => {
    expect(sortTransactions(sample, "highest")[0]?.name).toBe("Urban Ledger");
    expect(sortTransactions(sample, "lowest")[0]?.name).toBe("Spark Electric");
  });

  it("does not mutate the input array", () => {
    const original = [...sample];
    sortTransactions(sample, "oldest");
    expect(sample).toEqual(original);
  });
});

describe("paginateTransactions", () => {
  const many = Array.from({ length: 23 }, (_, i) =>
    tx({ name: `Row ${i + 1}`, date: "2022-11-01", amount: -i }),
  );

  it("returns the requested page of 10 by default", () => {
    const page2 = paginateTransactions(many, 2);
    expect(page2).toHaveLength(10);
    expect(page2[0]?.name).toBe("Row 11");
  });

  it("clamps an out-of-range page to the last page", () => {
    const last = paginateTransactions(many, 99);
    expect(last).toHaveLength(3);
    expect(last[0]?.name).toBe("Row 21");
  });

  it("returns an empty list for an empty source", () => {
    expect(paginateTransactions([], 1)).toEqual([]);
  });
});

describe("queryTransactions", () => {
  const many = Array.from({ length: 12 }, (_, i) =>
    tx({
      name: i % 2 === 0 ? `Alpha ${i}` : `Beta ${i}`,
      date: `2022-11-${String(12 - i).padStart(2, "0")}`,
      amount: i === 0 ? 50 : -i,
      category: i % 2 === 0 ? "General" : "Bills",
    }),
  );

  it("filters, sorts, then paginates", () => {
    const result = queryTransactions(many, {
      search: "Beta",
      sort: "latest",
      page: 1,
      pageSize: 3,
    });
    expect(result.total).toBe(6);
    expect(result.pageCount).toBe(2);
    expect(result.rows).toHaveLength(3);
    expect(result.rows.every((t) => t.name.startsWith("Beta"))).toBe(true);
  });

  it("clamps page when filters shrink the result set", () => {
    const result = queryTransactions(many, {
      category: "Bills",
      page: 8,
      pageSize: 10,
    });
    expect(result.total).toBe(6);
    expect(result.page).toBe(1);
    expect(result.pageCount).toBe(1);
  });

  it("returns pageCount 0 for an empty filter result", () => {
    const result = queryTransactions(many, { search: "nope" });
    expect(result).toMatchObject({
      rows: [],
      total: 0,
      page: 1,
      pageCount: 0,
    });
  });
});
