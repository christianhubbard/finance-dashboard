import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white px-6 py-6 shadow-none dark:bg-[#1b1913] ${className}`.trim()}
    >
      {children}
    </div>
  );
}
