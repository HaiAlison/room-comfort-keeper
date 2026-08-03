import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Thermometer, TrendingDown, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { StatisticCard } from "@/components/cards/StatisticCard";
import { TemperatureCard } from "@/components/cards/TemperatureCard";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/common/states";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentTemperature, useTemperatureHistory, useThreshold } from "@/hooks/use-monitoring";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/monitoring")({
  head: () => ({
    meta: [
      { title: "Real-time Monitoring — ThermaGuard" },
      { name: "description", content: "Live temperature readings with 24 hour, 7 day and custom range charts." },
      { property: "og:title", content: "Real-time Monitoring — ThermaGuard" },
      { property: "og:description", content: "Track room temperature trends in real time." },
    ],
  }),
  component: MonitoringPage,
});

type Range = "24h" | "7d" | "custom";

function MonitoringPage() {
  const [range, setRange] = useState<Range>("24h");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const current = useCurrentTemperature();
  const threshold = useThreshold();
  const history = useTemperatureHistory(
    range === "custom" ? { range, from: from || undefined, to: to || undefined } : { range },
  );

  const readings = history.data ?? [];
  const temps = readings.map((r) => r.temperature);
  const min = temps.length ? Math.min(...temps) : 0;
  const max = temps.length ? Math.max(...temps) : 0;
  const avgHumidity = readings.length
    ? readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length
    : 0;

  return (
    <PageShell
      title="Real-time monitoring"
      subtitle={current.data ? `Last reading ${formatDateTime(current.data.timestamp)}` : undefined}
    >
      {current.error || threshold.error ? (
        <ErrorState
          message={(current.error ?? threshold.error)?.message}
          onRetry={() => void current.refetch()}
        />
      ) : !current.data || !threshold.data ? (
        <CardsSkeleton count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <TemperatureCard reading={current.data} threshold={threshold.data} />
          <StatisticCard label="Period high" value={max.toFixed(1)} unit="°C" icon={TrendingUp} tone="danger" />
          <StatisticCard label="Period low" value={min.toFixed(1)} unit="°C" icon={TrendingDown} tone="primary" />
          <StatisticCard
            label="Average humidity"
            value={avgHumidity.toFixed(0)}
            unit="%"
            icon={Droplets}
            tone="muted"
          />
        </div>
      )}

      <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
        <CardHeader className="space-y-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <CardTitle>Temperature trend</CardTitle>
              <CardDescription>Dashed lines show the configured safe range</CardDescription>
            </div>
            <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
              <TabsList>
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="7d">7 days</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {range === "custom" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:max-w-lg">
              <div className="space-y-1.5">
                <Label htmlFor="from">From</Label>
                <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="to">To</Label>
                <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          {history.isLoading || !threshold.data ? (
            <Skeleton className="h-[22rem] w-full rounded-xl" />
          ) : history.error ? (
            <ErrorState message={history.error.message} onRetry={() => void history.refetch()} />
          ) : readings.length === 0 ? (
            <EmptyState
              title="No readings in this range"
              description="Pick a different date range to see recorded temperatures."
              icon={<Thermometer className="h-5 w-5" />}
            />
          ) : (
            <TemperatureChart data={readings} threshold={threshold.data} />
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
