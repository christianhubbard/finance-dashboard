import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="relative flex min-h-screen flex-1 flex-col bg-background">
        <div className="absolute right-10 top-10 z-20">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
