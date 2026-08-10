import { BudgetsView } from "@/components/budgets/BudgetsView";
import { getFinanceData } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">Budgets</h1>
      <BudgetsView budgets={data.budgets} transactions={data.transactions} />
    </main>
  );
}
