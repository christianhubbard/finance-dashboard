import { BillsList } from "@/components/recurring-bills/BillsList";
import { BillsSummary } from "@/components/recurring-bills/BillsSummary";
import { getFinanceData, getRecurringBillsSummary } from "@/lib/data";

export default function RecurringBillsPage() {
  const data = getFinanceData();
  const summary = getRecurringBillsSummary(data);

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Recurring Bills
      </h1>
      <div className="mt-6">
        <BillsSummary summary={summary} />
      </div>
      <div className="mt-8">
        <BillsList bills={data.recurringBills} />
      </div>
    </main>
  );
}
