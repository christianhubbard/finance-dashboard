"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavItemActive, navItems } from "./nav";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around gap-1 rounded-t-2xl bg-grey-900 px-2 pt-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-t-lg border-b-4 px-1 pt-2 pb-2.5 text-preset-5 font-bold transition-colors ${
              active
                ? "border-secondary-green bg-beige-100 text-grey-900"
                : "border-transparent text-grey-300 hover:text-white"
            }`}
          >
            <Icon
              className={`size-5 shrink-0 ${active ? "text-secondary-green" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
            <span className="hidden w-full truncate text-center sm:block">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
