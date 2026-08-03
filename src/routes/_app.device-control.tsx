import { createFileRoute } from "@tanstack/react-router";
import { Fan, Loader2, Power, PowerOff } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { FanStatusCard } from "@/components/cards/FanStatusCard";
import { DeviceStatusCard } from "@/components/cards/DeviceStatusCard";
import { CardsSkeleton, ErrorState } from "@/components/common/states";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useDeviceStatus, useFanControl, useFanState } from "@/hooks/use-devices";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/device-control")({
  head: () => ({
    meta: [
      { title: "Device Control — ThermaGuard" },
      { name: "description", content: "Manually turn the cooling fan on or off and review device details." },
      { property: "og:title", content: "Device Control — ThermaGuard" },
      { property: "og:description", content: "Remote fan control for connected IoT room devices." },
    ],
  }),
  component: DeviceControlPage,
});

function DeviceControlPage() {
  const fan = useFanState();
  const device = useDeviceStatus();
  const { power, mode } = useFanControl();

  const busy = power.isPending || mode.isPending;

  return (
    <PageShell title="Device control" subtitle="Send commands to the connected cooling fan">
      {fan.error || device.error ? (
        <ErrorState message={(fan.error ?? device.error)?.message} onRetry={() => void fan.refetch()} />
      ) : !fan.data || !device.data ? (
        <CardsSkeleton count={2} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <FanStatusCard fan={fan.data} />
            <DeviceStatusCard device={device.data} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle>Manual fan control</CardTitle>
                <CardDescription>
                  Manual commands switch the device out of automatic threshold control.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Automatic control</p>
                    <p className="text-xs text-muted-foreground">
                      Let thresholds decide when the fan runs
                    </p>
                  </div>
                  <Switch
                    aria-label="Automatic control"
                    checked={fan.data.mode === "auto"}
                    disabled={busy}
                    onCheckedChange={(checked) => mode.mutate(checked ? "auto" : "manual")}
                  />
                </div>

                <Separator />

                <div className="flex flex-wrap gap-3">
                  <ConfirmationDialog
                    title="Turn the fan ON?"
                    description="This overrides automatic control until you switch it back."
                    confirmLabel="Turn ON"
                    onConfirm={() => power.mutate(true)}
                    trigger={
                      <Button disabled={busy || fan.data.on}>
                        {power.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="mr-2 h-4 w-4" />
                        )}
                        Turn fan ON
                      </Button>
                    }
                  />
                  <ConfirmationDialog
                    title="Turn the fan OFF?"
                    description="The room may warm up above the configured maximum."
                    confirmLabel="Turn OFF"
                    onConfirm={() => power.mutate(false)}
                    trigger={
                      <Button variant="outline" disabled={busy || !fan.data.on}>
                        {power.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <PowerOff className="mr-2 h-4 w-4" />
                        )}
                        Turn fan OFF
                      </Button>
                    }
                  />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Fan className={fan.data.on ? "h-4 w-4 animate-fan text-success" : "h-4 w-4 text-muted-foreground"} />
                  <Label className="text-muted-foreground">
                    Current status: <strong className="text-foreground">{fan.data.on ? "ON" : "OFF"}</strong> ·{" "}
                    {fan.data.reason}
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle>Device details</CardTitle>
                <CardDescription>Hardware reporting into this room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="Device name" value={device.data.name} />
                <Row label="Room" value={device.data.room} />
                <Row
                  label="Connection"
                  value={
                    <Badge
                      variant="outline"
                      className={
                        device.data.online
                          ? "border-success/40 text-success"
                          : "border-destructive/40 text-destructive"
                      }
                    >
                      {device.data.online ? "Online" : "Offline"}
                    </Badge>
                  }
                />
                <Row label="Last seen" value={formatDateTime(device.data.lastSeen)} />
                <Row label="Firmware" value={device.data.firmware} />
                <Row label="Battery" value={`${device.data.battery}%`} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-2 last:border-0">
      <span className="truncate text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
