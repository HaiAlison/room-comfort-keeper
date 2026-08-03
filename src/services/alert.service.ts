import { mockRequest } from "./api";
import { db, pushLog } from "@/lib/mock-data";
import type { AlertItem } from "@/lib/types";

export async function getAlerts(): Promise<AlertItem[]> {
  return mockRequest(() => db.alerts.map((a) => ({ ...a })), 300);
}

export async function getLatestAlert(): Promise<AlertItem | null> {
  return mockRequest(() => (db.alerts[0] ? { ...db.alerts[0] } : null), 200);
}

export async function resolveAlert(alertId: string, user: string): Promise<AlertItem[]> {
  return mockRequest(() => {
    db.alerts = db.alerts.map((a) => (a.id === alertId ? { ...a, status: "resolved" } : a));
    pushLog({ user, action: `Alert ${alertId} marked as resolved`, result: "success" });
    return db.alerts.map((a) => ({ ...a }));
  }, 400);
}
