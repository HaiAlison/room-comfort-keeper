import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ThresholdForm } from "@/components/forms/ThresholdForm";
import { StatisticCard } from "@/components/cards/StatisticCard";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThreshold, useUpdateThreshold } from "@/hooks/use-monitoring";

export const Route = createFileRoute("/_app/threshold")({
  head: () => ({
    meta: [
      { title: "Threshold Configuration — ThermaGuard" },
      { name: "description", content: "Configure minimum and maximum safe room temperatures for automatic fan control." },
      { property: "og:title", content: "Threshold Configuration — ThermaGuard" },
      { property: "og:description", content: "Set the safe temperature range that drives automatic cooling." },
    ],
  }),
  component: ThresholdPage,
});

function ThresholdPage() {
  const threshold = useThreshold();
  const update = useUpdateThreshold();

  return (
    <PageShell title="Threshold configuration" subtitle="Define the safe temperature range for this room">
      {threshold.error ? (
        <ErrorState message={threshold.error.message} onRetry={() => void threshold.refetch()} />
      ) : !threshold.data ? (
        <CardsSkeleton count={2} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatisticCard
              label="Minimum"
              value={threshold.data.min}
              unit="°C"
              icon={ArrowDownToLine}
              tone="warning"
              hint="Below this a low-temperature alert is raised"
            />
            <StatisticCard
              label="Maximum"
              value={threshold.data.max}
              unit="°C"
              icon={ArrowUpToLine}
              tone="danger"
              hint="Above this the fan turns on automatically"
            />
          </div>

          <Card className="max-w-2xl rounded-2xl shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle>Update thresholds</CardTitle>
              <CardDescription>Changes apply immediately to automatic fan control.</CardDescription>
            </CardHeader>
            <CardContent>
              <ThresholdForm
                defaultValues={threshold.data}
                isSubmitting={update.isPending}
                onSubmit={(values) => update.mutate(values)}
              />
            </CardContent>
          </Card>
        </>
      )}
    </PageShell>
  );
}
