import type {
  ActivityLog,
  AlertItem,
  DeviceStatus,
  FanState,
  TemperatureReading,
  Threshold,
} from "./types";

/**
 * In-memory mock backend. Everything here is replaced by the NestJS REST API
 * later — only files in src/services/ talk to this module.
 */

const HOUR = 60 * 60 * 1000;

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function baseTemp(date: Date) {
  // Daily sinusoidal curve between ~21 and ~31 degrees.
  const h = date.getHours() + date.getMinutes() / 60;
  return 26 + 5 * Math.sin(((h - 9) / 24) * Math.PI * 2);
}

function seedHistory(days: number, stepMinutes: number): TemperatureReading[] {
  const now = Date.now();
  const step = stepMinutes * 60 * 1000;
  const count = Math.floor((days * 24 * HOUR) / step);
  const out: TemperatureReading[] = [];
  for (let i = count; i >= 0; i--) {
    const d = new Date(now - i * step);
    const t = baseTemp(d) + (Math.random() - 0.5) * 1.6;
    out.push({
      id: id("rd"),
      timestamp: d.toISOString(),
      temperature: Math.round(t * 10) / 10,
      humidity: Math.round((48 + Math.random() * 14) * 10) / 10,
    });
  }
  return out;
}

export const db = {
  threshold: { min: 20, max: 30 } as Threshold,
  readings: seedHistory(7, 15),
  fan: {
    on: false,
    reason: "Temperature normalized",
    mode: "auto",
    updatedAt: new Date().toISOString(),
  } as FanState,
  device: {
    id: "dev_esp32_01",
    name: "Room Sensor · ESP32-A1",
    room: "Bedroom 1",
    online: true,
    lastSeen: new Date().toISOString(),
    firmware: "v2.4.1",
    battery: 87,
  } as DeviceStatus,
  alerts: [] as AlertItem[],
  logs: [] as ActivityLog[],
};

export function pushLog(entry: Omit<ActivityLog, "id" | "timestamp">) {
  db.logs.unshift({ id: id("log"), timestamp: new Date().toISOString(), ...entry });
  db.logs = db.logs.slice(0, 300);
}

export function pushAlert(entry: Omit<AlertItem, "id" | "timestamp" | "status">) {
  db.alerts.unshift({
    id: id("alr"),
    timestamp: new Date().toISOString(),
    status: "active",
    ...entry,
  });
  db.alerts = db.alerts.slice(0, 200);
}

// Seed a little history of alerts/logs so the UI is never empty on first load.
(function seedEvents() {
  const now = Date.now();
  db.alerts = [
    {
      id: id("alr"),
      timestamp: new Date(now - 2 * HOUR).toISOString(),
      severity: "critical",
      message: "Temperature exceeded maximum threshold (31.4°C)",
      status: "resolved",
    },
    {
      id: id("alr"),
      timestamp: new Date(now - 9 * HOUR).toISOString(),
      severity: "warning",
      message: "Sensor reported intermittent readings",
      status: "resolved",
    },
    {
      id: id("alr"),
      timestamp: new Date(now - 26 * HOUR).toISOString(),
      severity: "info",
      message: "Device reconnected to the network",
      status: "resolved",
    },
  ];
  db.logs = [
    {
      id: id("log"),
      timestamp: new Date(now - 2 * HOUR).toISOString(),
      user: "system",
      action: "Fan turned ON (auto) — temperature exceeded threshold",
      result: "success",
    },
    {
      id: id("log"),
      timestamp: new Date(now - 90 * 60 * 1000).toISOString(),
      user: "system",
      action: "Fan turned OFF (auto) — temperature normalized",
      result: "success",
    },
    {
      id: id("log"),
      timestamp: new Date(now - 30 * HOUR).toISOString(),
      user: "caregiver@smartroom.io",
      action: "Threshold updated to 20°C / 30°C",
      result: "success",
    },
  ];
})();

/** Advances the simulation: new reading, auto fan logic, alerts. */
export function tick(): TemperatureReading {
  const last = db.readings[db.readings.length - 1];
  const d = new Date();
  const drift = (baseTemp(d) - (last?.temperature ?? 26)) * 0.25;
  const next = Math.round(((last?.temperature ?? 26) + drift + (Math.random() - 0.5) * 0.6) * 10) / 10;

  const reading: TemperatureReading = {
    id: id("rd"),
    timestamp: d.toISOString(),
    temperature: next,
    humidity: Math.round((48 + Math.random() * 14) * 10) / 10,
  };
  db.readings.push(reading);
  if (db.readings.length > 5000) db.readings.shift();

  db.device.lastSeen = d.toISOString();

  if (db.fan.mode === "auto") {
    if (next > db.threshold.max && !db.fan.on) {
      db.fan = {
        on: true,
        reason: "Temperature exceeded threshold",
        mode: "auto",
        updatedAt: d.toISOString(),
      };
      pushAlert({ severity: "critical", message: `Temperature exceeded maximum threshold (${next}°C)` });
      pushLog({ user: "system", action: "Fan turned ON (auto)", result: "success" });
    } else if (next <= db.threshold.max - 0.5 && db.fan.on) {
      db.fan = {
        on: false,
        reason: "Temperature normalized",
        mode: "auto",
        updatedAt: d.toISOString(),
      };
      pushLog({ user: "system", action: "Fan turned OFF (auto)", result: "success" });
    }
  }

  return reading;
}
