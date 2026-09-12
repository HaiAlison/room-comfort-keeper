import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants";
import { mapReading, type BeReading } from "@/services/monitoring.service";
import { useRealtimeStore } from "@/stores/realtime.store";

/**
 * LIVE mode transport.
 *
 * Trước đây hook này nối MQTT over WebSocket trực tiếp từ browser.
 * Cách đó không dùng được: broker 70.153.80.10 chưa bật listener
 * WebSocket (9001/8083/8084 đều đóng, nginx /mqtt trả 502), và nó
 * đẩy luôn username/password MQTT xuống client.
 *
 * Thay bằng SSE qua backend: BE đã subscribe MQTT rồi, mỗi reading
 * lưu xong được push ngay qua `GET /monitoring/events` — cùng độ trễ
 * (~ thời điểm thiết bị publish), không cần mở port broker, không lộ
 * credentials, và tự đi qua cùng origin/proxy như các API khác.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useLiveTemperature(enabled: boolean) {
  const queryClient = useQueryClient();
  const setMonitoringLive = useRealtimeStore((s) => s.setMonitoringLive);

  useEffect(() => {
    if (!enabled) {
      setMonitoringLive(false);
      return;
    }

    const sse = new EventSource(`${BASE_URL}/monitoring/events`);

    sse.onopen = () => setMonitoringLive(true);

    sse.onmessage = (event) => {
      try {
        const reading = JSON.parse(event.data) as BeReading;

        // Ghi trực tiếp vào cache mà useCurrentTemperature() đang dùng
        queryClient.setQueryData(
          QUERY_KEYS.currentTemperature,
          mapReading(reading),
        );
      } catch (error) {
        console.error("SSE /monitoring/events: bad payload", error);
      }
    };

    // EventSource tự reconnect; trong lúc đó rơi về polling (non-live).
    sse.onerror = () => setMonitoringLive(false);

    return () => {
      setMonitoringLive(false);
      sse.close();
    };
  }, [enabled, queryClient, setMonitoringLive]);
}
