import { BudgetCategoryList } from "@/components/budgets/BudgetCategoryList";
import { BudgetsSummary } from "@/components/budgets/BudgetsSummary";
import { getFinanceData } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Budgets
      </h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        <BudgetsSummary budgets={data.budgets} />
        <BudgetCategoryList budgets={data.budgets} />
      </div>
    </main>
  );
}
