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
