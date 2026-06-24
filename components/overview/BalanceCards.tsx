import { formatCurrency } from "@/lib/format";
import type { Balance } from "@/lib/types";

type BalanceCardsProps = {
  balance: Balance;
};

export function BalanceCards({ balance }: BalanceCardsProps) {
  const currentBalanceColor =
    balance.current >= 0 ? "text-secondary-green" : "text-secondary-red";

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-grey-500">Current Balance</p>
        <p
          className={`mt-4 text-balance-amount font-bold tracking-tight tabular-nums ${currentBalanceColor}`}
        >
          {formatCurrency(balance.current)}
        </p>
      </div>
      <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-grey-500">Income</p>
        <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums text-secondary-green">
          +{formatCurrency(balance.income)}
        </p>
      </div>
      <div className="@container min-w-0 overflow-hidden rounded-2xl bg-white px-6 py-6">
        <p className="text-preset-4 text-grey-500">Expenses</p>
        <p className="mt-4 text-balance-amount font-bold tracking-tight tabular-nums text-secondary-red">
          -{formatCurrency(balance.expenses)}
        </p>
      </div>
    </div>
  );
}
