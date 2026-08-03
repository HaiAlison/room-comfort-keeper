import type { ReadingStatus, Severity } from "./types";

export const APP_NAME = "ThermaGuard";
export const APP_TAGLINE = "Smart Room Temperature Monitoring";

export const QUERY_KEYS = {
  currentTemperature: ["temperature", "current"] as const,
  history: (range: string, from?: string, to?: string) =>
    ["temperature", "history", range, from ?? "", to ?? ""] as const,
  threshold: ["threshold"] as const,
  device: ["device", "status"] as const,
  fan: ["device", "fan"] as const,
  alerts: ["alerts"] as const,
  logs: ["logs"] as const,
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  info: "Info",
  warning: "Warning",
  critical: "Critical",
};

export const READING_STATUS_LABEL: Record<ReadingStatus, string> = {
  low: "Below range",
  normal: "Normal",
  high: "Above range",
};
