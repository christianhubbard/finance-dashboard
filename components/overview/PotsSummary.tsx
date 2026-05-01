import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Pot } from "@/lib/types";

type PotsSummaryProps = {
  pots: Pot[];
};

export function PotsSummary({ pots }: PotsSummaryProps) {
  const totalSaved = pots.reduce((s, p) => s + p.total, 0);

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-preset-2 text-grey-900">Pots</h2>
          <p className="mt-4 text-preset-4 text-grey-500">Total saved</p>
          <p className="mt-2 text-preset-1 font-bold tracking-tight text-grey-900 tabular-nums break-words">
            {formatCurrency(totalSaved)}
          </p>
        </div>
        <Link
          href="/pots"
          className="text-preset-4 font-medium text-grey-500 underline-offset-4 hover:text-grey-900 hover:underline"
        >
          See Details
        </Link>
      </div>
      <ul className="mt-8 flex flex-col gap-4">
        {pots.map((pot) => {
          const pct = pot.target > 0 ? Math.min(100, (pot.total / pot.target) * 100) : 0;
          const barColor = getThemeColor(pot.theme);
          return (
            <li key={pot.name}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-preset-4-bold text-grey-900">{pot.name}</span>
                <div className="text-preset-4 text-left tabular-nums sm:text-right">
                  <span className="font-bold text-secondary-red">
                    {formatCurrency(-pot.total)}
                  </span>
                  <span className="text-grey-500">
                    {" "}
                    of {formatCurrency(pot.target)}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-beige-100">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
