import { ApiError, mockRequest } from "./api";
import { db, pushLog, tick } from "@/lib/mock-data";
import type { HistoryQuery, TemperatureReading, Threshold } from "@/lib/types";

export async function getCurrentTemperature(): Promise<TemperatureReading> {
  return mockRequest(() => tick(), 250);
}

export async function getTemperatureHistory(query: HistoryQuery = {}): Promise<TemperatureReading[]> {
  return mockRequest(() => {
    const now = Date.now();
    let from = now - 24 * 60 * 60 * 1000;
    let to = now;

    if (query.range === "7d") from = now - 7 * 24 * 60 * 60 * 1000;
    if (query.range === "custom") {
      if (query.from) from = new Date(query.from).getTime();
      if (query.to) to = new Date(query.to).getTime();
    }

    return db.readings.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= from && t <= to;
    });
  }, 300);
}

export async function getThreshold(): Promise<Threshold> {
  return mockRequest(() => ({ ...db.threshold }), 200);
}

export async function updateThreshold(next: Threshold, user: string): Promise<Threshold> {
  return mockRequest(() => {
    if (next.min >= next.max) {
      throw new ApiError("Minimum temperature must be lower than maximum temperature");
    }
    db.threshold = { ...next };
    pushLog({ user, action: `Threshold updated to ${next.min}°C / ${next.max}°C`, result: "success" });
    return { ...db.threshold };
  }, 500);
}
