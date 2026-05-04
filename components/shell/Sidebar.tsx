"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  LayoutGrid,
  Minimize2,
  PieChart,
  PiggyBank,
  Receipt,
  Wallet,
} from "lucide-react";

const STORAGE_KEY = "finance-sidebar-collapsed";

const nav = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/pots", label: "Pots", icon: PiggyBank },
  { href: "/recurring-bills", label: "Recurring Bills", icon: Receipt },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap client-only preference after SSR
      setCollapsed(saved === "true");
    } catch {
      // ignore (e.g. privacy mode)
    }
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <aside
      className={`flex h-full shrink-0 flex-col bg-grey-900 text-white transition-[width] duration-200 ease-out ${
        collapsed ? "w-[90px]" : "w-[300px]"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-8 pt-10 pb-8 ${collapsed ? "flex-col justify-center px-0" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Wallet className="size-4 text-secondary-green" strokeWidth={2} />
          </div>
          {!collapsed ? (
            <span className="text-preset-2 font-bold tracking-tight">
              finance
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={toggle}
          className={`flex shrink-0 items-center justify-center rounded-lg p-2 text-grey-300 transition-colors hover:bg-white/5 hover:text-white ${
            collapsed ? "mt-2" : "ml-auto"
          }`}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand menu" : "Minimize menu"}
        >
          <Minimize2
            className={`size-5 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="Primary">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-preset-4 font-medium transition-colors ${
                active
                  ? "border border-white/10 bg-grey-500/30 text-white"
                  : "text-grey-300 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              {!collapsed ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
