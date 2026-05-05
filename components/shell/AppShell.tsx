import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-start">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-beige-100">
        {children}
      </div>
    </div>
  );
}
