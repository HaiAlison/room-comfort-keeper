import { BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatisticCard } from "./StatisticCard";
import { formatDateTime, formatRelative } from "@/lib/format";
import { SEVERITY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AlertItem } from "@/lib/types";

export function severityClasses(severity: AlertItem["severity"]) {
  if (severity === "critical") return "border-destructive/40 bg-destructive/10 text-destructive";
  if (severity === "warning") return "border-warning/50 bg-warning/15 text-warning";
  return "border-primary/30 bg-primary/10 text-primary";
}

export function LatestAlertCard({ alert }: { alert: AlertItem | null | undefined }) {
  if (!alert) {
    return (
      <StatisticCard
        label="Latest alert"
        value="All clear"
        icon={BellRing}
        tone="success"
        hint="No alerts recorded yet"
      />
    );
  }

  return (
    <StatisticCard
      label="Latest alert"
      value={SEVERITY_LABEL[alert.severity]}
      icon={BellRing}
      tone={alert.severity === "critical" ? "danger" : alert.severity === "warning" ? "warning" : "primary"}
      hint={alert.message}
      footer={
        <Badge variant="outline" className="capitalize">
          {alert.status} · {formatRelative(alert.timestamp)}
        </Badge>
      }
    />
  );
}

export function AlertCard({
  alert,
  onResolve,
  resolving,
}: {
  alert: AlertItem;
  onResolve?: (id: string) => void;
  resolving?: boolean;
}) {
  return (
    <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
      <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-5">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("capitalize", severityClasses(alert.severity))}>
              {SEVERITY_LABEL[alert.severity]}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDateTime(alert.timestamp)}</span>
          </div>
          <p className="text-sm font-medium">{alert.message}</p>
          <p className="text-xs capitalize text-muted-foreground">Status: {alert.status}</p>
        </div>
        {alert.status === "active" && onResolve ? (
          <Button size="sm" variant="outline" disabled={resolving} onClick={() => onResolve(alert.id)}>
            Resolve
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
