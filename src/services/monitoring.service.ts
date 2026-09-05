import api from "@/lib/api";
import type { HistoryQuery, TemperatureReading, Threshold } from "@/lib/types";
import { ApiError } from "./api";

/** BE sensor reading shape (monitoring module). */
export interface BeReading {
  id: string;
  created_at: string;
  temperature: number;
  humidity: number;
}

export function mapReading(data: BeReading): TemperatureReading {
  return {
    id: data.id,
    timestamp: data.created_at,
    temperature: data.temperature,
    humidity: data.humidity,
  };
}

export async function getCurrentTemperature(): Promise<TemperatureReading> {
  const response = await api.get<BeReading | "">("/monitoring/current");

  if (!response.data) {
    throw new ApiError("No sensor reading available", 404);
  }

  return mapReading(response.data);
}

export async function getTemperatureHistory(
  query: HistoryQuery = {},
): Promise<TemperatureReading[]> {
  const now = new Date();
  let from: Date | null = null;
  let to: Date | null = now;

  if (query.range === "24h" || !query.range) {
    from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  if (query.range === "7d") {
    from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  if (query.range === "custom") {
    from = query.from ? new Date(query.from) : null;
    to = query.to ? new Date(query.to) : null;
  }

  const response = await api.get<{ results: BeReading[] }>(
    "/monitoring/history",
    {
      params: {
        ...(from && { from: from.toISOString() }),
        ...(to && { to: to.toISOString() }),
      },
    },
  );

  return response.data.results.map(mapReading);
}

/** BE threshold shape (threshold entity). */
interface BeThreshold {
  minimumTemperature: number;
  maximumTemperature: number;
}

const DEFAULT_THRESHOLD: Threshold = { min: 18, max: 30 };

export async function getThreshold(): Promise<Threshold> {
  const response = await api.get<BeThreshold | "">("/monitoring/threshold");

  // No threshold configured yet on the backend.
  if (!response.data) {
    return { ...DEFAULT_THRESHOLD };
  }

  return {
    min: response.data.minimumTemperature,
    max: response.data.maximumTemperature,
  };
}

export async function updateThreshold(
  next: Threshold,
  _user: string,
): Promise<Threshold> {
  if (next.min >= next.max) {
    throw new ApiError(
      "Minimum temperature must be lower than maximum temperature",
    );
  }

  const response = await api.put<BeThreshold>("/monitoring/threshold", {
    minimumTemperature: next.min,
    maximumTemperature: next.max,
  });

  return {
    min: response.data.minimumTemperature,
    max: response.data.maximumTemperature,
  };
}
