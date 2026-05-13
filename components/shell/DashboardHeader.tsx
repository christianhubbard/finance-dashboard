import { ThemeToggle } from "@/components/theme/ThemeToggle";

type DashboardHeaderProps = {
  title: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <h1 className="text-preset-1 font-bold tracking-tight text-grey-900 dark:text-grey-100">
        {title}
      </h1>
      <ThemeToggle />
    </header>
  );
}
