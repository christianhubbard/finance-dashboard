import type { Metadata } from "next";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { SpendingSummary } from "@/components/budgets/SpendingSummary";
import { getFinanceData, getLatestTransactionsForCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "finance — Budgets",
};

export default function BudgetsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:pb-16 md:pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Budgets
      </h1>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="lg:sticky lg:top-10">
          <SpendingSummary budgets={data.budgets} />
        </div>
        <div className="flex flex-col gap-6">
          {data.budgets.map((budget) => (
            <BudgetCard
              key={budget.category}
              budget={budget}
              latestSpending={getLatestTransactionsForCategory(
                data,
                budget.category,
              )}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
