import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function PageShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <Navbar title={title} subtitle={subtitle} />
      <main className="animate-rise flex-1 space-y-6 p-4 sm:p-6">
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        {children}
      </main>
    </div>
  );
}
