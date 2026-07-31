import { PotsView } from "@/components/pots/PotsView";
import { getFinanceData } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "finance — Pots",
  description: "Savings pots",
};

export default function PotsPage() {
  const data = getFinanceData();

  return <PotsView initialPots={data.pots} />;
}
