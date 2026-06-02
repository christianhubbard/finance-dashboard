"use client";

import { useMemo, useState } from "react";
import { Plus, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Pot } from "@/lib/types";

type EditablePot = Pot & {
  amount: string;
};

type PotsDashboardProps = {
  pots: Pot[];
};

function getProgress(total: number, target: number): number {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (total / target) * 100));
}

function getPotAmountId(name: string): string {
  return `pot-amount-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function formatPotCount(count: number): string {
  return `${count} ${count === 1 ? "pot" : "pots"}`;
}

export function PotsDashboard({ pots }: PotsDashboardProps) {
  const [editablePots, setEditablePots] = useState<EditablePot[]>(
    () => pots.map((pot) => ({ ...pot, amount: "" })),
  );

  const summary = useMemo(() => {
    const totalSaved = editablePots.reduce((sum, pot) => sum + pot.total, 0);
    const totalTarget = editablePots.reduce((sum, pot) => sum + pot.target, 0);
    const progress = getProgress(totalSaved, totalTarget);

    return { totalSaved, totalTarget, progress };
  }, [editablePots]);

  const updateAmount = (name: string, amount: string) => {
    setEditablePots((current) =>
      current.map((pot) => (pot.name === name ? { ...pot, amount } : pot)),
    );
  };

  const applyTransaction = (name: string, direction: "add" | "withdraw") => {
    setEditablePots((current) =>
      current.map((pot) => {
        if (pot.name !== name) {
          return pot;
        }

        const amount = Number.parseFloat(pot.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
          return pot;
        }

        const total =
          direction === "add"
            ? pot.total + amount
            : Math.max(0, pot.total - amount);

        return { ...pot, total, amount: "" };
      }),
    );
  };

  return (
    <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:items-start">
      <Card className="bg-grey-900 text-white">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
            <WalletCards className="size-6 text-secondary-green" aria-hidden />
          </div>
          <div>
            <p className="text-preset-4 text-grey-100">Total saved</p>
            <p className="mt-2 text-preset-1 font-bold tracking-tight">
              {formatCurrency(summary.totalSaved)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-preset-5 text-grey-100">
              Overall progress
            </span>
            <span className="text-preset-4-bold">
              {summary.progress.toFixed(1)}%
            </span>
          </div>
          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Overall pots progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Number(summary.progress.toFixed(1))}
          >
            <div
              className="h-full rounded-full bg-secondary-green transition-[width]"
              style={{ width: `${summary.progress}%` }}
            />
          </div>
          <p className="mt-3 text-preset-4 text-grey-100">
            {formatCurrency(summary.totalSaved)} saved toward{" "}
            {formatCurrency(summary.totalTarget)} across{" "}
            {formatPotCount(editablePots.length)}.
          </p>
        </div>
      </Card>

      <section aria-labelledby="pots-list-heading">
        <h2 id="pots-list-heading" className="sr-only">
          Savings pots
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {editablePots.map((pot) => {
            const progress = getProgress(pot.total, pot.target);
            const themeColor = getThemeColor(pot.theme);
            const amountId = getPotAmountId(pot.name);

            return (
              <li key={pot.name}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="size-4 rounded-full"
                        style={{ backgroundColor: themeColor }}
                        aria-hidden
                      />
                      <h3 className="text-preset-2 text-grey-900">
                        {pot.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-beige-100 px-3 py-1 text-preset-5 text-grey-500">
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-preset-5 text-grey-500">
                          Current balance
                        </p>
                        <p className="mt-1 text-preset-1 font-bold tracking-tight text-grey-900">
                          {formatCurrency(pot.total)}
                        </p>
                      </div>
                      <p className="text-preset-4 text-grey-500">
                        Target:{" "}
                        <span className="text-preset-4-bold text-grey-900">
                          {formatCurrency(pot.target)}
                        </span>
                      </p>
                    </div>

                    <div
                      className="mt-4 h-2 overflow-hidden rounded-full bg-beige-100"
                      role="progressbar"
                      aria-label={`${pot.name} progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Number(progress.toFixed(1))}
                    >
                      <div
                        className="h-full rounded-full transition-[width]"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: themeColor,
                        }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-preset-5 text-grey-500">
                      <span>{formatCurrency(0)}</span>
                      <span>{formatCurrency(pot.target)}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <label
                      htmlFor={amountId}
                      className="text-preset-4-bold text-grey-900"
                    >
                      Amount for {pot.name}
                    </label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <input
                        id={amountId}
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={pot.amount}
                        onChange={(event) =>
                          updateAmount(pot.name, event.target.value)
                        }
                        placeholder="0.00"
                        className="min-w-0 flex-1 rounded-xl border border-grey-300 bg-white px-4 py-3 text-preset-4 text-grey-900 outline-none transition-colors placeholder:text-grey-300 focus:border-grey-900"
                      />
                      <div className="grid grid-cols-2 gap-3 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => applyTransaction(pot.name, "add")}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-grey-900 px-4 py-3 text-preset-4-bold text-white transition-colors hover:bg-grey-500"
                        >
                          <Plus className="size-4" aria-hidden />
                          Add Money
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            applyTransaction(pot.name, "withdraw")
                          }
                          className="rounded-xl bg-beige-100 px-4 py-3 text-preset-4-bold text-grey-900 transition-colors hover:bg-grey-100"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
