import { BudgetsPageContent } from "@/components/budgets/BudgetsPageContent";
import { getFinanceData } from "@/lib/data";

export default function BudgetsPage() {
  const data = getFinanceData();

  return (
    <BudgetsPageContent
      budgets={data.budgets}
      transactions={data.transactions}
    />
  );
}
