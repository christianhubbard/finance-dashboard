"use client";

import { useState } from "react";
import { PotCard } from "@/components/pots/PotCard";
import { formatCurrency } from "@/lib/format";
import type { Pot } from "@/lib/types";

type PotsViewProps = {
  initialPots: Pot[];
};

export function PotsView({ initialPots }: PotsViewProps) {
  const [pots, setPots] = useState(initialPots);
  const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);

  function updatePotTotal(name: string, delta: number) {
    setPots((current) =>
      current.map((pot) =>
        pot.name === name
          ? {
              ...pot,
              total: Math.max(0, Math.round((pot.total + delta) * 100) / 100),
            }
          : pot,
      ),
    );
  }

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
          Pots
        </h1>
        <div className="text-right">
          <p className="text-preset-4 text-grey-500">
            Total saved across all pots
          </p>
          <p className="text-preset-2 text-grey-900">
            {formatCurrency(totalSaved)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {pots.map((pot) => (
          <PotCard
            key={pot.name}
            pot={pot}
            onAddMoney={(amount) => updatePotTotal(pot.name, amount)}
            onWithdraw={(amount) => updatePotTotal(pot.name, -amount)}
          />
        ))}
      </div>
    </main>
  );
}
