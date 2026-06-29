import { RecurringBillsView } from "@/components/recurring-bills/RecurringBillsView";
import { getFinanceData } from "@/lib/data";

export default function RecurringBillsPage() {
  const data = getFinanceData();

  return <RecurringBillsView data={data} />;
}
