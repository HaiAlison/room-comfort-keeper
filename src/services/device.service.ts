import { API_BASE_URL, API_ROUTES, ApiError } from "./api";
import type { DeviceStatus, FanState } from "@/lib/types";

/**
 * Devices — real backend integration.
 *
 * Fan state + control:   GET /devices/fan, PUT /devices/fan { on },
 *                        PUT /devices/fan/mode { mode }   (MQTT module)
 * Device info:           GET /devices/:deviceId            (devices module)
 */

const FAN_DEVICE_ID =
  (import.meta.env["VITE_FAN_DEVICE_ID"] as string | undefined) ?? "esp32-room-01-fan";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      }
    } catch {
      /* non-JSON body */
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

/** BE device shape (devices module). */
interface BeDevice {
  id: string;
  deviceId: string;
  roomId: string;
  name: string;
  type: "FAN" | "SENSOR" | "BUZZER";
  status: "ONLINE" | "OFFLINE" | "ERROR";
  isOn: boolean;
  lastSeen: string | null;
  firmwareVersion: string | null;
}

export async function getDeviceStatus(): Promise<DeviceStatus> {
  const d = await http<BeDevice>(`/devices/${FAN_DEVICE_ID}`);
  return {
    id: d.deviceId,
    name: d.name,
    room: d.roomId,
    online: d.status === "ONLINE",
    lastSeen: d.lastSeen ?? new Date(0).toISOString(),
    firmware: d.firmwareVersion ?? "unknown",
    battery: 100, // BE does not track battery yet
  };
}

export async function getFanState(): Promise<FanState> {
  return http<FanState>(API_ROUTES.fan);
}

async function setFan(on: boolean, _user: string): Promise<FanState> {
  return http<FanState>(API_ROUTES.fan, {
    method: "PUT",
    body: JSON.stringify({ on }),
  });
}

export async function turnFanOn(user: string): Promise<FanState> {
  return setFan(true, user);
}

export async function turnFanOff(user: string): Promise<FanState> {
  return setFan(false, user);
}

export async function setFanMode(mode: "auto" | "manual", _user: string): Promise<FanState> {
  return http<FanState>(`${API_ROUTES.fan}/mode`, {
    method: "PUT",
    body: JSON.stringify({ mode }),
  });
}
