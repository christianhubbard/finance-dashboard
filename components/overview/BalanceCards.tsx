import { formatCurrency } from "@/lib/format";
import type { Balance } from "@/lib/types";

type BalanceCardsProps = {
  balance: Balance;
};

export function BalanceCards({ balance }: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-grey-900 px-5 py-6 text-white sm:px-6">
        <p className="text-preset-4 text-grey-100">Current Balance</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight tabular-nums break-words">
          {formatCurrency(balance.current)}
        </p>
      </div>
      <div className="rounded-2xl bg-white px-5 py-6 sm:px-6">
        <p className="text-preset-4 text-grey-500">Income</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight text-secondary-green tabular-nums break-words">
          +{formatCurrency(balance.income)}
        </p>
      </div>
      <div className="rounded-2xl bg-white px-5 py-6 sm:px-6">
        <p className="text-preset-4 text-grey-500">Expenses</p>
        <p className="mt-4 text-preset-1 font-bold tracking-tight text-secondary-red tabular-nums break-words">
          -{formatCurrency(balance.expenses)}
        </p>
      </div>
    </div>
  );
}
