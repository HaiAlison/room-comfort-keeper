import {
  API_BASE_URL,
  API_ROUTES,
  ApiError,
  mockRequest,
} from "./api";
import { db, pushLog, tick } from "@/lib/mock-data";
import type { HistoryQuery, TemperatureReading, Threshold } from "@/lib/types";

export async function getCurrentTemperature(): Promise<TemperatureReading> {
  const response = await fetch(
    `${API_BASE_URL}${API_ROUTES.currentTemperature}`,
  );

  if (!response.ok) {
    throw new ApiError(
      "Could not load current temperature",
      response.status,
    );
  }

  const text = await response.text();

  if (!text) {
    throw new ApiError(
      "No sensor reading available",
      404,
    );
  }

  const data = JSON.parse(text);

  return {
    id: data.id,
    timestamp: data.created_at,
    temperature: data.temperature,
    humidity: data.humidity,
  };
}

export async function getTemperatureHistory(
  query: HistoryQuery = {},
): Promise<TemperatureReading[]> {
  const params = new URLSearchParams();

  const now = new Date();
  let from: Date | null = null;
  let to: Date | null = now;

  if (query.range === "24h" || !query.range) {
    from = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    );
  }

  if (query.range === "7d") {
    from = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
  }

  if (query.range === "custom") {
    from = query.from
      ? new Date(query.from)
      : null;

    to = query.to
      ? new Date(query.to)
      : null;
  }

  if (from) {
    params.set(
      "from",
      from.toISOString(),
    );
  }

  if (to) {
    params.set(
      "to",
      to.toISOString(),
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${API_ROUTES.temperatureHistory}?${params.toString()}`,
  );

  if (!response.ok) {
    throw new ApiError(
      "Could not load temperature history",
      response.status,
    );
  }

  const data = await response.json();

  return data.results.map(
    (reading: {
      id: string;
      created_at: string;
      temperature: number;
      humidity: number;
    }): TemperatureReading => ({
      id: reading.id,
      timestamp: reading.created_at,
      temperature: reading.temperature,
      humidity: reading.humidity,
    }),
  );
}

export async function getThreshold(): Promise<Threshold> {
  const response = await fetch(
    `${API_BASE_URL}${API_ROUTES.threshold}`,
  );

  if (!response.ok) {
    throw new ApiError(
      "Could not load threshold",
      response.status,
    );
  }

  const data = await response.json();

  return {
    min: data.minimumTemperature,
    max: data.maximumTemperature,
  };
}

export async function updateThreshold(
  next: Threshold,
  _user: string,
): Promise<Threshold> {
  const response = await fetch(
    `${API_BASE_URL}${API_ROUTES.threshold}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        minimumTemperature: next.min,
        maximumTemperature: next.max,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => null);

    throw new ApiError(
      errorData?.message ??
        "Could not update threshold",
      response.status,
    );
  }

  const data = await response.json();

  return {
    min: data.minimumTemperature,
    max: data.maximumTemperature,
  };
}
