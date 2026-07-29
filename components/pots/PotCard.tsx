"use client";

import { useId, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { getThemeColor } from "@/lib/theme";
import type { Pot } from "@/lib/types";

type PotCardProps = {
  pot: Pot;
  onAddMoney: (amount: number) => void;
  onWithdraw: (amount: number) => void;
};

type ActionMode = "add" | "withdraw" | null;

export function PotCard({ pot, onAddMoney, onWithdraw }: PotCardProps) {
  const inputId = useId();
  const [mode, setMode] = useState<ActionMode>(null);
  const [amount, setAmount] = useState("");

  const pct = pot.target > 0 ? Math.min(100, (pot.total / pot.target) * 100) : 0;
  const barColor = getThemeColor(pot.theme);

  function resetForm() {
    setMode(null);
    setAmount("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number.parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    if (mode === "add") {
      onAddMoney(value);
    } else if (mode === "withdraw") {
      onWithdraw(value);
    }

    resetForm();
  }

  return (
    <Card className="relative flex h-full flex-col overflow-hidden pl-8">
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: barColor }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-preset-2 text-grey-900">{pot.name}</h2>
          <p className="mt-4 text-preset-4 text-grey-500">Total Saved</p>
          <p className="mt-2 text-preset-1 font-bold tracking-tight text-grey-900">
            {formatCurrency(pot.total)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-preset-4 text-grey-500">Target</p>
          <p className="mt-2 text-preset-3 text-grey-900">
            {formatCurrency(pot.target)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4 text-preset-4">
          <span className="font-bold text-secondary-red">
            {formatCurrency(-pot.total)}
          </span>
          <span className="text-grey-500">of {formatCurrency(pot.target)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-beige-100">
          <div
            className="h-full rounded-full transition-[width]"
            style={{
              width: `${pct}%`,
              backgroundColor: barColor,
            }}
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pot.name} progress`}
          />
        </div>
        <p className="mt-2 text-preset-5 text-grey-500">
          {Math.round(pct)}% of target
        </p>
      </div>

      {mode ? (
        <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor={inputId} className="text-preset-4 text-grey-500">
            {mode === "add" ? "Amount to add" : "Amount to withdraw"}
          </label>
          <div className="flex gap-2">
            <input
              id={inputId}
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="min-w-0 flex-1 rounded-lg border border-grey-300 bg-white px-3 py-2 text-preset-4 text-grey-900 outline-none focus:border-grey-900"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-lg bg-grey-900 px-4 py-2 text-preset-4 font-medium text-white hover:bg-grey-500"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-grey-300 px-4 py-2 text-preset-4 text-grey-500 hover:text-grey-900"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => setMode("add")}
            className="flex-1 rounded-lg bg-grey-900 px-4 py-2.5 text-preset-4 font-medium text-white hover:bg-grey-500"
          >
            Add Money
          </button>
          <button
            type="button"
            onClick={() => setMode("withdraw")}
            disabled={pot.total <= 0}
            className="flex-1 rounded-lg border border-grey-300 px-4 py-2.5 text-preset-4 font-medium text-grey-900 hover:border-grey-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Withdraw
          </button>
        </div>
      )}
    </Card>
  );
}
