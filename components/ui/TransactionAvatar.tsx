import { getThemeColor } from "@/lib/theme";
import type { Transaction } from "@/lib/types";

const AVATAR_ACCENTS: Record<string, string> = {
  emma: "var(--color-secondary-cyan)",
  urban: "var(--color-secondary-green)",
  savory: "var(--color-secondary-yellow)",
  floral: "var(--color-secondary-purple)",
  spark: "var(--color-secondary-yellow)",
  ledger: "var(--color-secondary-navy)",
  trail: "var(--color-extended-brown)",
  north: "var(--color-extended-blue)",
  ember: "var(--color-extended-orange)",
  water: "var(--color-secondary-cyan)",
  net: "var(--color-extended-magenta)",
};

type TransactionAvatarProps = {
  tx: Transaction;
  size?: "sm" | "md";
};

export function TransactionAvatar({ tx, size = "md" }: TransactionAvatarProps) {
  const accent = AVATAR_ACCENTS[tx.avatar] ?? getThemeColor("navy");
  const initial = tx.name.trim().charAt(0).toUpperCase();
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${
        size === "sm" ? "size-8 text-preset-4-bold" : "size-10 text-preset-3"
      }`}
      style={{ backgroundColor: accent }}
      aria-hidden
    >
      {initial}
    </div>
  );
}
