import { BudgetCategoryCard } from "@/components/budgets/BudgetCategoryCard";
import { SpendingSummary } from "@/components/budgets/SpendingSummary";
import { getFinanceData, getLatestTransactionsByCategory } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Budgets
      </h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:items-start">
        <div className="lg:sticky lg:top-10">
          <SpendingSummary budgets={data.budgets} />
        </div>
        <div className="flex flex-col gap-6">
          {data.budgets.map((budget) => (
            <BudgetCategoryCard
              key={budget.category}
              budget={budget}
              transactions={getLatestTransactionsByCategory(
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
