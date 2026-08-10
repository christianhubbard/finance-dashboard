import { BudgetCategoryCard } from "@/components/budgets/BudgetCategoryCard";
import { BudgetsSummary } from "@/components/budgets/BudgetsSummary";
import type { Budget, Transaction } from "@/lib/types";

type BudgetsViewProps = {
  budgets: Budget[];
  transactions: Transaction[];
};

export function BudgetsView({ budgets, transactions }: BudgetsViewProps) {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
      <BudgetsSummary budgets={budgets} />
      <div className="flex flex-col gap-6">
        {budgets.map((budget) => (
          <BudgetCategoryCard
            key={budget.category}
            budget={budget}
            transactions={transactions}
          />
        ))}
      </div>
    </div>
  );
}
