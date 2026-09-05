import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import type { HistoryQuery, Threshold } from "@/lib/types";
import {
  getCurrentTemperature,
  getTemperatureHistory,
  getThreshold,
  updateThreshold,
} from "@/services/monitoring.service";
import { useCurrentUserEmail } from "@/stores/auth.store";
import { useRealtimeStore } from "@/stores/realtime.store";
import { useThemeStore } from "@/stores/theme.store";

export function useCurrentTemperature() {
  const autoRefresh = useThemeStore((s) => s.autoRefresh);
  const interval = useThemeStore((s) => s.refreshIntervalMs);
  // SSE pushes readings straight into this query's cache — no need to
  // poll while the stream is connected (see use-monitoring-sse).
  const sseLive = useRealtimeStore((s) => s.monitoringLive);
  return useQuery({
    queryKey: QUERY_KEYS.currentTemperature,
    queryFn: getCurrentTemperature,
    refetchInterval: autoRefresh && !sseLive ? interval : false,
  });
}

export function useTemperatureHistory(query: HistoryQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.history(query.range ?? "24h", query.from, query.to),
    queryFn: () => getTemperatureHistory(query),
  });
}

export function useThreshold() {
  return useQuery({ queryKey: QUERY_KEYS.threshold, queryFn: getThreshold });
}

export function useUpdateThreshold() {
  const queryClient = useQueryClient();
  const email = useCurrentUserEmail();
  return useMutation({
    mutationFn: (next: Threshold) => updateThreshold(next, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.threshold });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
      toast.success("Threshold saved", { description: "Automatic fan control updated." });
    },
    onError: (error: Error) => toast.error("Could not save threshold", { description: error.message }),
  });
}
