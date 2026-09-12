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
import {
  useLiveTemperature,
} from "@/hooks/use-monitoringlive";

export function useCurrentTemperature() {
  const isLive =
    useThemeStore(
      (s) => s.autoRefresh,
    );

  // LIVE ON: nhận reading real-time qua SSE (/monitoring/events)
  useLiveTemperature(
    isLive,
  );

  // SSE đang nối thì khỏi poll — reading tự được ghi vào cache.
  const sseLive =
    useRealtimeStore(
      (s) => s.monitoringLive,
    );

  return useQuery({
    queryKey:
      QUERY_KEYS.currentTemperature,

    queryFn:
      getCurrentTemperature,

    // LUÔN fetch 1 lần khi mở trang, kể cả LIVE mode.
    //
    // Trước đây LIVE mode không fetch và cũng không poll, nên
    // dashboard trống cho tới lần thiết bị publish kế tiếp (15s+,
    // và nếu thiết bị đang ngủ thì trống vô hạn) — đúng hiện tượng
    // "mở dashboard chờ một lúc mới thấy số".
    // Giờ: hiện ngay reading cuối trong DB, rồi SSE đẩy số mới lên.

    // Poll chỉ còn là fallback khi SSE chưa/không nối được.
    refetchInterval:
      isLive && sseLive
        ? false
        : 10_000,

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
