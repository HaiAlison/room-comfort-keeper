import api from "@/lib/api";
import type { AlertItem } from "@/lib/types";
import { IPagination } from "@/types/api";

export const alertService = {
  getAlerts: async (): Promise<IPagination<AlertItem>> => {
    const response = await api.get(`/alerts`)
    return response.data
  },
  resolveAlert: async (alertId: string, email: string) => {
    const response = await api.patch(`/alerts/${alertId}/resolve`, { email })
    return response.data
  }
}