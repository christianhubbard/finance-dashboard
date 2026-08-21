import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetsHeader } from "@/components/budgets/BudgetsHeader";
import { SpendingSummary } from "@/components/budgets/SpendingSummary";
import { getFinanceData } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <BudgetsHeader />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,428px)_minmax(0,1fr)] lg:items-start">
        <SpendingSummary budgets={data.budgets} />
        <div className="flex flex-col gap-6">
          {data.budgets.map((budget) => (
            <BudgetCard key={budget.category} budget={budget} data={data} />
          ))}
        </div>
      </div>
    </main>
  );
}
