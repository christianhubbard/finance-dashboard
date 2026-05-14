import { BalanceCards } from "@/components/overview/BalanceCards";
import { BudgetsCard } from "@/components/overview/BudgetsCard";
import { PotsSummary } from "@/components/overview/PotsSummary";
import { RecurringBillsCard } from "@/components/overview/RecurringBillsCard";
import { TransactionsPreview } from "@/components/overview/TransactionsPreview";
import { getFinanceData, getLatestTransactions } from "@/lib/data";

export default function OverviewPage() {
  const data = getFinanceData();
  const latest = getLatestTransactions(data, 5);

  return (
    <main className="min-h-0 flex-1 bg-sky-200 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Overview
      </h1>
      <div className="mt-6">
        <BalanceCards balance={data.balance} />
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-8">
          <PotsSummary pots={data.pots} />
          <TransactionsPreview transactions={latest} />
        </div>
        <div className="flex flex-col gap-8">
          <BudgetsCard budgets={data.budgets} />
          <RecurringBillsCard data={data} />
        </div>
      </div>
    </main>
  );
}
