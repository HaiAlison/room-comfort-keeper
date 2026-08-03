import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { HistoryTable } from "@/components/tables/HistoryTable";
import { ErrorState, LoadingSkeleton } from "@/components/common/states";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemperatureHistory, useThreshold } from "@/hooks/use-monitoring";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [
      { title: "Temperature History — ThermaGuard" },
      { name: "description", content: "Search, filter, paginate and export recorded room temperature readings." },
      { property: "og:title", content: "Temperature History — ThermaGuard" },
      { property: "og:description", content: "Full log of recorded room temperature readings." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [range, setRange] = useState<"24h" | "7d">("24h");
  const history = useTemperatureHistory({ range });
  const threshold = useThreshold();

  return (
    <PageShell title="Temperature history" subtitle="Recorded sensor readings with export">
      <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <CardTitle>Readings</CardTitle>
            <CardDescription>Filter by status or search a specific time</CardDescription>
          </div>
          <Tabs value={range} onValueChange={(v) => setRange(v as "24h" | "7d")}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7 days</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {history.isLoading || threshold.isLoading ? (
            <LoadingSkeleton rows={5} />
          ) : history.error ? (
            <ErrorState message={history.error.message} onRetry={() => void history.refetch()} />
          ) : (
            <HistoryTable readings={history.data ?? []} threshold={threshold.data ?? { min: 20, max: 30 }} />
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
