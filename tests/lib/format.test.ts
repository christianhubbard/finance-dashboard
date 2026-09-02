import { describe, expect, it } from "vitest";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats positive amounts with no leading sign by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("prefixes negative amounts with a minus sign", () => {
    expect(formatCurrency(-50)).toBe("-$50.00");
  });

  it("does not add a sign for zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it('respects sign="always" for negatives but does not add + for positives', () => {
    expect(formatCurrency(-12, "always")).toBe("-$12.00");
    expect(formatCurrency(12, "always")).toBe("$12.00");
  });

  it("always shows two fraction digits", () => {
    expect(formatCurrency(7)).toBe("$7.00");
    expect(formatCurrency(7.1)).toBe("$7.10");
  });
});

describe("formatDisplayDate", () => {
  it("formats a date-only ISO string as a short US date", () => {
    expect(formatDisplayDate("2024-08-19")).toBe("Aug 19, 2024");
  });

  it("does not shift the calendar day around UTC midnight", () => {
    expect(formatDisplayDate("2022-11-28")).toBe("Nov 28, 2022");
  });
});
