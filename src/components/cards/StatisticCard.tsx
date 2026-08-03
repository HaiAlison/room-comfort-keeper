import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export type StatTone = "primary" | "success" | "warning" | "danger" | "muted";

const toneRing: Record<StatTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

export function StatisticCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "primary",
  footer,
  iconClassName,
}: {
  label: string;
  value: ReactNode;
  unit?: string | undefined;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: StatTone;
  footer?: ReactNode;
  iconClassName?: string | undefined;
}) {
  return (
    <Card className="rounded-2xl shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5">
      <CardContent className="space-y-3 p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", toneRing[tone])}>
            <Icon className={cn("h-4.5 w-4.5", iconClassName)} />
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight">{value}</span>
          {unit ? <span className="text-base text-muted-foreground">{unit}</span> : null}
        </div>
        {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
        {footer}
      </CardContent>
    </Card>
  );
}
