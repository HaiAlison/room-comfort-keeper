import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AlertCard } from "@/components/cards/AlertCard";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/common/states";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlerts, useResolveAlert } from "@/hooks/use-events";
import { useAlertStore } from "@/stores/alert.store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — ThermaGuard" },
      { name: "description", content: "Threshold breaches, sensor offline and device disconnection alerts." },
      { property: "og:title", content: "Alerts — ThermaGuard" },
      { property: "og:description", content: "Review and resolve room monitoring alerts." },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const alerts = useAlerts();
  const resolve = useResolveAlert();

  const rows = (alerts.data ?? []).filter((a) => (filter === "all" ? true : a.status === filter));
  const setHasUnread = useAlertStore((s) => s.setHasUnread);

  useEffect(() => {
    setHasUnread(false);
  }, [setHasUnread]);
  return (
    <PageShell title="Alerts" subtitle="Every event that needs caregiver attention">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {alerts.isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : alerts.error ? (
        <ErrorState message={alerts.error.message} onRetry={() => void alerts.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No alerts here"
          description="Everything is within the configured safe range."
          icon={<BellRing className="h-5 w-5" />}
        />
      ) : (
        <div className="grid gap-3">
          {rows.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              resolving={resolve.isPending}
              onResolve={(id) => resolve.mutate(id)}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
