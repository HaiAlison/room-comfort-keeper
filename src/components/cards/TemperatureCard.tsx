import { Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatisticCard } from "./StatisticCard";
import { formatRelative, readingStatus } from "@/lib/format";
import { READING_STATUS_LABEL } from "@/lib/constants";
import type { TemperatureReading, Threshold } from "@/lib/types";

export function TemperatureCard({
  reading,
  threshold,
}: {
  reading: TemperatureReading;
  threshold: Threshold;
}) {
  const status = readingStatus(reading.temperature, threshold);
  const tone = status === "high" ? "danger" : status === "low" ? "warning" : "success";

  return (
    <StatisticCard
      label="Room temperature"
      value={reading.temperature.toFixed(1)}
      unit="°C"
      icon={Thermometer}
      tone={tone}
      hint={`Humidity ${reading.humidity}% · updated ${formatRelative(reading.timestamp)}`}
      footer={
        <Badge
          variant="outline"
          className={
            status === "high"
              ? "border-destructive/40 text-destructive"
              : status === "low"
                ? "border-warning/50 text-warning"
                : "border-success/40 text-success"
          }
        >
          {READING_STATUS_LABEL[status]} · {threshold.min}°C – {threshold.max}°C
        </Badge>
      }
    />
  );
}
