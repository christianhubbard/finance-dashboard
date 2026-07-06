import {
  ArrowLeftRight,
  LayoutGrid,
  PieChart,
  PiggyBank,
  Receipt,
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/pots", label: "Pots", icon: PiggyBank },
  { href: "/recurring-bills", label: "Recurring Bills", icon: Receipt },
] as const;

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
