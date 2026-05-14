import { PotsDashboard } from "@/components/pots/PotsDashboard";
import { getFinanceData } from "@/lib/data";

export default function PotsPage() {
  const data = getFinanceData();

  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-preset-1 font-bold tracking-tight text-grey-900">
            Pots
          </h1>
          <p className="mt-2 max-w-2xl text-preset-4 text-grey-500">
            Track savings goals, monitor progress, and try add or withdraw
            actions locally.
          </p>
        </div>
      </div>
      <PotsDashboard pots={data.pots} />
    </main>
  );
}
