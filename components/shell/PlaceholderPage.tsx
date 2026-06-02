import { DashboardHeader } from "@/components/shell/DashboardHeader";

type PlaceholderPageProps = {
  title: string;
};

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="min-h-0 flex-1 px-10 pb-16 pt-10">
      <DashboardHeader title={title} />
      <p className="mt-4 max-w-md text-preset-4 text-grey-500 dark:text-grey-300">
        This section is a placeholder for the MVP. The Overview page has the
        full dashboard preview with mock data from{" "}
        <code className="rounded bg-beige-100 px-1 text-preset-4-bold text-grey-900 dark:bg-white/10 dark:text-grey-100">
          data/finance.json
        </code>
        .
      </p>
    </main>
  );
}
