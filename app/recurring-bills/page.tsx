import { RecurringBillsDashboard } from "@/components/recurring-bills/RecurringBillsDashboard";
import { getFinanceData } from "@/lib/data";

export default function RecurringBillsPage() {
  const data = getFinanceData();

  return <RecurringBillsDashboard recurringBills={data.recurringBills} />;
}
