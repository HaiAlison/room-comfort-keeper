import { Fan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatisticCard } from "./StatisticCard";
import { formatRelative } from "@/lib/format";
import type { FanState } from "@/lib/types";

export function FanStatusCard({ fan }: { fan: FanState }) {
  return (
    <StatisticCard
      label="Cooling fan"
      value={fan.on ? "ON" : "OFF"}
      icon={Fan}
      tone={fan.on ? "success" : "muted"}
      iconClassName={fan.on ? "animate-fan" : undefined}
      hint={`Reason: ${fan.reason} · ${formatRelative(fan.updatedAt)}`}
      footer={
        <Badge variant="secondary" className="capitalize">
          {fan.mode} control
        </Badge>
      }
    />
  );
}
