import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateTime, formatTime } from "@/lib/format";
import type { TemperatureReading, Threshold } from "@/lib/types";

export function TemperatureChart({
  data,
  threshold,
  compact = false,
}: {
  data: TemperatureReading[];
  threshold: Threshold;
  compact?: boolean;
}) {
  const points = data.map((r) => ({
    ...r,
    label: formatTime(r.timestamp),
  }));

  return (
    <div className={compact ? "h-56 w-full" : "h-[22rem] w-full"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={[(min: number) => Math.floor(min - 2), (max: number) => Math.ceil(max + 2)]}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={40}
            unit="°"
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              color: "var(--color-popover-foreground)",
              fontSize: 12,
            }}
            labelFormatter={(_label, payload) => {
              const iso = payload?.[0]?.payload?.timestamp;
              return iso ? formatDateTime(iso as string) : "";
            }}
            formatter={(value: number | string) => [`${value} °C`, "Temperature"]}
          />
          <ReferenceLine y={threshold.max} stroke="var(--color-destructive)" strokeDasharray="4 4" />
          <ReferenceLine y={threshold.min} stroke="var(--color-warning)" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#tempFill)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
