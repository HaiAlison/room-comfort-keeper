import api from "@/lib/api";
import { mockRequest } from "./api";
import { db, pushLog } from "@/lib/mock-data";
import type { AlertItem } from "@/lib/types";

export const alertService = {
  getAlerts: async () => {
    const response = await api.get(`/alerts`)
    return response.data
  },
  resolveAlert: async (alertId: string, email: string) => {
    const response = await api.post(`/alerts/${alertId}/resolve`, { email })
    return response.data
  }
}