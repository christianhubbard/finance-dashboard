import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="relative flex min-h-screen flex-1 flex-col bg-background">
        <div className="absolute right-10 top-10">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
