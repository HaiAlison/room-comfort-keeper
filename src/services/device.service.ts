import api from "@/lib/api";
import type { DeviceStatus, FanState } from "@/lib/types";

/**
 * Devices — real backend integration (axios client from lib/api,
 * carries the JWT and refresh logic automatically).
 *
 * Fan state + control:   GET /devices/fan, PUT /devices/fan { on },
 *                        PUT /devices/fan/mode { mode }   (MQTT module)
 * Device info:           GET /devices/:deviceId            (devices module)
 */

const FAN_DEVICE_ID =
  (import.meta.env["VITE_FAN_DEVICE_ID"] as string | undefined) ?? "esp32-room-01-fan";

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
  const response = await api.get<BeDevice>(`/devices/${FAN_DEVICE_ID}`);
  const d = response.data;
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
  const response = await api.get<FanState>("/devices/fan");
  return response.data;
}

async function setFan(on: boolean, _user: string): Promise<FanState> {
  const response = await api.put<FanState>("/devices/fan", { on });
  return response.data;
}

export async function turnFanOn(user: string): Promise<FanState> {
  return setFan(true, user);
}

export async function turnFanOff(user: string): Promise<FanState> {
  return setFan(false, user);
}

export async function setFanMode(mode: "auto" | "manual", _user: string): Promise<FanState> {
  const response = await api.put<FanState>("/devices/fan/mode", { mode });
  return response.data;
}
