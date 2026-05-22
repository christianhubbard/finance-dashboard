import { BudgetsView } from "@/components/budgets/BudgetsView";
import { getFinanceData } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();

  return <BudgetsView budgets={data.budgets} transactions={data.transactions} />;
}
