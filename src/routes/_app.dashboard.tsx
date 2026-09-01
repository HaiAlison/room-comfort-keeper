import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Fan, Gauge, ThermometerSun } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { TemperatureCard } from "@/components/cards/TemperatureCard";
import { FanStatusCard } from "@/components/cards/FanStatusCard";
import { DeviceStatusCard } from "@/components/cards/DeviceStatusCard";
import { LatestAlertCard } from "@/components/cards/AlertCard";
import { StatisticCard } from "@/components/cards/StatisticCard";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentTemperature, useTemperatureHistory, useThreshold } from "@/hooks/use-monitoring";
import { useDeviceStatus, useFanState } from "@/hooks/use-devices";
import { useAlerts } from "@/hooks/use-events";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ThermaGuard Room Monitoring" },
      { name: "description", content: "Live room temperature, fan status, device health and latest alerts." },
      { property: "og:title", content: "Dashboard — ThermaGuard" },
      { property: "og:description", content: "Live room temperature, fan status and alerts at a glance." },
    ],
  }),
  component: DashboardPage,
});

export function DashboardPage() {
  const current = useCurrentTemperature();
  const threshold = useThreshold();
  const fan = useFanState();
  const device = useDeviceStatus();
  const alerts = useAlerts();
  const history = useTemperatureHistory({ range: "24h" });

  const loading = current.isLoading || threshold.isLoading || fan.isLoading || device.isLoading;
  const error = current.error ?? threshold.error ?? fan.error ?? device.error;

  return (
    <PageShell
      title="Dashboard"
      subtitle={
        current.data ? `Last updated ${formatDateTime(current.data.timestamp)}` : "Loading live sensor data"
      }
    >
      {error ? (
        <ErrorState message={error.message} onRetry={() => void current.refetch()} />
      ) : loading || !current.data || !threshold.data || !fan.data || !device.data ? (
        <CardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <TemperatureCard reading={current.data} threshold={threshold.data} />
          <FanStatusCard fan={fan.data} />
          <DeviceStatusCard device={device.data} />
          <LatestAlertCard alert={alerts.data?.[0] ?? null} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-[var(--shadow-soft)] lg:col-span-2">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <CardTitle>Temperature trend</CardTitle>
              <CardDescription>Last 24 hours vs configured thresholds</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/monitoring">
                Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {history.isLoading || !threshold.data ? (
              <Skeleton className="h-56 w-full rounded-xl" />
            ) : (
              <TemperatureChart data={history.data ?? []} threshold={threshold.data} compact />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <StatisticCard
            label="Active alerts"
            value={alerts.data?.filter((a) => a.status === "active").length ?? 0}
            icon={Gauge}
            tone="warning"
            hint="Alerts awaiting caregiver action"
            footer={
              <Button asChild variant="outline" size="sm">
                <Link to="/alerts">Review alerts</Link>
              </Button>
            }
          />
          <StatisticCard
            label="Quick actions"
            value={fan.data?.on ? "Fan running" : "Fan idle"}
            icon={fan.data?.on ? Fan : ThermometerSun}
            tone={fan.data?.on ? "success" : "muted"}
            hint="Control the fan or adjust thresholds"
            footer={
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/device-control">Fan control</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/threshold">Threshold</Link>
                </Button>
              </div>
            }
          />
        </div>
      </div>
    </PageShell>
  );
}
