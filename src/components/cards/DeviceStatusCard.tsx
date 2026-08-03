import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatisticCard } from "./StatisticCard";
import { formatRelative } from "@/lib/format";
import type { DeviceStatus } from "@/lib/types";

export function DeviceStatusCard({ device }: { device: DeviceStatus }) {
  return (
    <StatisticCard
      label="Device status"
      value={device.online ? "Online" : "Offline"}
      icon={Cpu}
      tone={device.online ? "success" : "danger"}
      hint={`${device.name} · last seen ${formatRelative(device.lastSeen)}`}
      footer={
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">FW {device.firmware}</Badge>
          <Badge variant="secondary">Battery {device.battery}%</Badge>
        </div>
      }
    />
  );
}
