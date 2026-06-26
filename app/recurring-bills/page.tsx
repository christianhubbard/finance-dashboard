import { RecurringBillsList } from "@/components/recurring-bills/RecurringBillsList";
import { RecurringBillsSummary } from "@/components/recurring-bills/RecurringBillsSummary";
import {
  getFinanceData,
  getRecurringBillsSummary,
  getRecurringBillsWithStatus,
} from "@/lib/data";

export default function RecurringBillsPage() {
  const data = getFinanceData();
  const summary = getRecurringBillsSummary(data);
  const bills = getRecurringBillsWithStatus(data);

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Recurring Bills
      </h1>
      <div className="mt-6">
        <RecurringBillsSummary summary={summary} />
      </div>
      <div className="mt-10">
        <RecurringBillsList bills={bills} />
      </div>
    </main>
  );
}
