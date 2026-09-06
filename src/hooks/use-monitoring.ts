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
import { useThemeStore } from "@/stores/theme.store";
import {
  useLiveTemperature,
} from "@/hooks/use-monitoringlive";

export function useCurrentTemperature() {
  const isLive =
    useThemeStore(
      (s) => s.autoRefresh,
    );

  // LIVE ON:
  // kết nối trực tiếp MQTT WS
  useLiveTemperature(
    isLive,
  );

  return useQuery({
    queryKey:
      QUERY_KEYS.currentTemperature,

    queryFn:
      getCurrentTemperature,

    // LIVE:
    // không gọi API current
    //
    // NON-LIVE:
    // lấy reading cuối từ DB
    enabled:
      !isLive,

    // NON-LIVE poll 30s.
    // DB có thể lưu 60s/lần,
    // nhưng poll 30s giúp tránh lệch nhịp.
    refetchInterval:
      !isLive
        ? 30_000
        : false,

    refetchOnWindowFocus:
      false,
  });
}

export function useTemperatureHistory(query: HistoryQuery) {
  return useQuery({
    queryKey: QUERY_KEYS.history(query.range ?? "24h", query.from, query.to),
    queryFn: () => getTemperatureHistory(query), refetchInterval: 60_000, refetchOnWindowFocus: false,
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
