import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { ActivityTable } from "@/components/tables/ActivityTable";
import { ErrorState, LoadingSkeleton } from "@/components/common/states";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivityLogs } from "@/hooks/use-events";

export const Route = createFileRoute("/_app/activity-logs")({
  head: () => ({
    meta: [
      { title: "Activity Logs — ThermaGuard" },
      { name: "description", content: "Audit trail of fan commands, threshold updates, logins and alerts." },
      { property: "og:title", content: "Activity Logs — ThermaGuard" },
      { property: "og:description", content: "Full audit trail of system and caregiver actions." },
    ],
  }),
  component: ActivityLogsPage,
});

function ActivityLogsPage() {
  const logs = useActivityLogs();

  return (
    <PageShell title="Activity logs" subtitle="System and caregiver actions">
      <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>Fan commands, threshold changes, sign-ins and generated alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.isLoading ? (
            <LoadingSkeleton rows={5} />
          ) : logs.error ? (
            <ErrorState message={logs.error.message} onRetry={() => void logs.refetch()} />
          ) : (
            <ActivityTable logs={logs.data ?? []} />
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
