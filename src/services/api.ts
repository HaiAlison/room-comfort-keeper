/**
 * Single integration point for the future NestJS REST API.
 * Swap `mockRequest` for a real fetch wrapper and the rest of the app is unchanged.
 */
export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "/api";

export const API_ROUTES = {
  login: "/auth/login",
  me: "/auth/me",
  currentTemperature: "/monitoring/current",
  temperatureHistory: "/monitoring/history",
  threshold: "/monitoring/threshold",
  device: "/devices/status",
  fan: "/devices/fan",
  alerts: "/alerts",
  logs: "/activity-logs",
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Simulates network latency; replace with `fetch` when the backend lands. */
export function mockRequest<T>(resolver: () => T, delay = 350): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(resolver());
      } catch (error) {
        reject(error instanceof Error ? error : new ApiError("Unexpected error"));
      }
    }, delay);
  });
}
