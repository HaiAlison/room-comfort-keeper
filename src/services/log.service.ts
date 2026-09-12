import api from "@/lib/api";
import type { ActivityLog } from "@/lib/types";
import type { ActivityLogsQuery, IPagination } from "@/types/api";

export async function getActivityLogs(
  query: ActivityLogsQuery = {},
): Promise<IPagination<ActivityLog>> {
  const response = await api.get<IPagination<ActivityLog>>("/activity-logs", {
    params: {
      offset: query.offset ?? 1,
      limit: query.limit ?? 10,
      ...(query.result !== undefined && { result: query.result }),
      ...(query.from !== undefined && { from: query.from }),
      ...(query.to !== undefined && { to: query.to }),
    },
  });
  return response.data;
}
