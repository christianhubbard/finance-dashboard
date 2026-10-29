export function formatCurrency(amount: number, sign: "always" | "auto" = "auto"): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (sign === "always") {
    const prefix = amount < 0 ? "-" : "";
    return `${prefix}${formatted}`;
  }

  if (amount < 0) {
    return `-${formatted}`;
  }

  return formatted;
}

/** ISO date (`YYYY-MM-DD`) → `Aug 19, 2024`. Parsed at noon so TZ does not shift the day. */
export function formatDisplayDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
