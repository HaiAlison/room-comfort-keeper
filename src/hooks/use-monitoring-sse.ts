import { useEffect } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { mapReading, type BeReading } from "@/services/monitoring.service";
import { useRealtimeStore } from "@/stores/realtime.store";
import type { FanState } from "@/lib/types";

/**
 * Real-time dashboard data over SSE (no polling while connected).
 *
 * - `GET /monitoring/events`  → new sensor reading saved from MQTT
 *   → pushed straight into the `currentTemperature` query cache.
 * - `GET /devices/fan/events` → fan state changed (manual / mode / auto)
 *   → pushed into the `fan` query cache + refreshes activity logs.
 *
 * While a stream is connected the matching polling interval is paused
 * (see realtime.store); if the stream drops, EventSource auto-reconnects
 * and polling resumes as a fallback in the meantime.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function connectStream(
  path: string,
  onData: (data: unknown, queryClient: QueryClient) => void,
  setLive: (live: boolean) => void,
  queryClient: QueryClient,
): () => void {
  const sse = new EventSource(`${BASE_URL}${path}`);

  sse.onopen = () => setLive(true);

  sse.onmessage = (event) => {
    try {
      onData(JSON.parse(event.data), queryClient);
    } catch (error) {
      console.error(`SSE ${path}: bad payload`, error);
    }
  };

  // EventSource reconnects on its own; while it does, fall back to polling.
  sse.onerror = () => setLive(false);

  return () => {
    setLive(false);
    sse.close();
  };
}

export function useMonitoringSSE() {
  const queryClient = useQueryClient();
  const setMonitoringLive = useRealtimeStore((s) => s.setMonitoringLive);
  const setFanLive = useRealtimeStore((s) => s.setFanLive);

  useEffect(() => {
    const closeReadings = connectStream(
      "/monitoring/events",
      (data, qc) => {
        qc.setQueryData(
          QUERY_KEYS.currentTemperature,
          mapReading(data as BeReading),
        );
      },
      setMonitoringLive,
      queryClient,
    );

    const closeFan = connectStream(
      "/devices/fan/events",
      (data, qc) => {
        qc.setQueryData(QUERY_KEYS.fan, data as FanState);
        // Fan flips (especially AUTO ones) create activity-log entries.
        void qc.invalidateQueries({ queryKey: QUERY_KEYS.logs });
      },
      setFanLive,
      queryClient,
    );

    return () => {
      closeReadings();
      closeFan();
    };
  }, [queryClient, setMonitoringLive, setFanLive]);
}
