import { RecurringBillsView } from "@/components/recurring-bills/RecurringBillsView";
import { getFinanceData } from "@/lib/data";

export default function RecurringBillsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
        Recurring Bills
      </h1>
      <RecurringBillsView data={data} />
    </main>
  );
}
