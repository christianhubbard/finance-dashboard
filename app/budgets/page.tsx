import { BudgetsView } from "@/components/budgets/BudgetsView";
import { getBudgetDetails, getFinanceData } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();
  const budgets = getBudgetDetails(data);

  return <BudgetsView budgets={budgets} />;
}
