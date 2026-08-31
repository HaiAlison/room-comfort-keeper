import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { ActivityTable } from "@/components/tables/ActivityTable";
import { ErrorState, LoadingSkeleton } from "@/components/common/states";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useActivityLogs } from "@/hooks/use-events";
import type { ActivityLogsQuery } from "@/types/api";

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

const LIMIT = 10;

function ActivityLogsPage() {
  const [offset, setOffset] = useState(1);
  const [result, setResult] = useState<ActivityLogsQuery["result"]>(undefined);

  const query: ActivityLogsQuery = {
    offset,
    limit: LIMIT,
    ...(result !== undefined && { result }),
  };

  const logs = useActivityLogs(query);
  const totalPages = logs.data?.totalPages ?? 1;
  const totalItems = logs.data?.totalItems ?? 0;

  function handleResultChange(value: string) {
    setResult(value === "all" ? undefined : (value as ActivityLogsQuery["result"]));
    setOffset(1);
  }

  return (
    <PageShell title="Activity logs" subtitle="System and caregiver actions">
      <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>Fan commands, threshold changes, sign-ins and generated alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <Select onValueChange={handleResultChange} defaultValue="all">
              <SelectTrigger className="w-36" id="filter-result" aria-label="Filter by result">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {logs.isLoading ? (
            <LoadingSkeleton rows={LIMIT} />
          ) : logs.error ? (
            <ErrorState message={logs.error.message} onRetry={() => void logs.refetch()} />
          ) : (
            <ActivityTable logs={logs.data?.results ?? []} />
          )}

          {/* Pagination */}
          {!logs.isLoading && !logs.error && totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {totalItems} total entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset <= 1}
                  onClick={() => setOffset((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums">
                  Page {offset} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset >= totalPages}
                  onClick={() => setOffset((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
