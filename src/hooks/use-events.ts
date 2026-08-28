import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import { getActivityLogs } from "@/services/log.service";
import { useCurrentUserEmail } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { alertService } from "@/services/alert.service";
import { AlertItem } from "@/lib/types";
import { IPagination } from "@/types/api";

export function useAlerts() {
  const autoRefresh = useThemeStore((s) => s.autoRefresh);
  return useQuery({
    queryKey: QUERY_KEYS.alerts,
    queryFn: alertService.getAlerts,
    select: (data: IPagination<AlertItem>) => data.results,
    refetchInterval: autoRefresh ? 8000 : false,
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  const email = useCurrentUserEmail();
  return useMutation({
    mutationFn: (alertId: string) => alertService.resolveAlert(alertId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
      toast.success("Alert resolved");
    },
    onError: (error: Error) => toast.error("Could not resolve alert", { description: error.message }),
  });
}

export function useActivityLogs() {
  return useQuery({ queryKey: QUERY_KEYS.logs, queryFn: getActivityLogs });
}
