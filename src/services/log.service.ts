import { mockRequest } from "./api";
import { db } from "@/lib/mock-data";
import type { ActivityLog } from "@/lib/types";

export async function getActivityLogs(): Promise<ActivityLog[]> {
  return mockRequest(() => db.logs.map((l) => ({ ...l })), 300);
}
