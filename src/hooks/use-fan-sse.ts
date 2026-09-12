import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { useRealtimeStore } from "@/stores/realtime.store";
import type { FanState } from "@/lib/types";

/**
 * Real-time fan state over SSE (`GET /devices/fan/events`).
 *
 * BE push mỗi khi quạt đổi trạng thái — lệnh tay, đổi mode, hoặc auto
 * bật/tắt theo ngưỡng — nên FE không cần poll để thấy quạt tự chạy.
 * Trạng thái được ghi thẳng vào cache của useFanState(), kèm refresh
 * activity logs vì mỗi lần quạt đổi đều sinh log mới.
 *
 * Readings đi đường riêng, xem use-monitoringlive (LIVE mode).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFanSSE() {
  const queryClient = useQueryClient();
  const setFanLive = useRealtimeStore((s) => s.setFanLive);

  useEffect(() => {
    const sse = new EventSource(`${BASE_URL}/devices/fan/events`);

    sse.onopen = () => setFanLive(true);

    sse.onmessage = (event) => {
      try {
        const state = JSON.parse(event.data) as FanState;
        queryClient.setQueryData(QUERY_KEYS.fan, state);
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
      } catch (error) {
        console.error("SSE /devices/fan/events: bad payload", error);
      }
    };

    // EventSource tự reconnect; trong lúc đó polling làm fallback.
    sse.onerror = () => setFanLive(false);

    return () => {
      setFanLive(false);
      sse.close();
    };
  }, [queryClient, setFanLive]);
}
