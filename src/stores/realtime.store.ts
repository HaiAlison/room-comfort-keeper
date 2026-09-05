import { create } from "zustand";

/**
 * Tracks which SSE streams are currently connected.
 * While a stream is live, the matching React Query polling is paused —
 * polling only resumes as a fallback when the stream drops.
 */
interface RealtimeState {
  monitoringLive: boolean;
  fanLive: boolean;
  setMonitoringLive: (live: boolean) => void;
  setFanLive: (live: boolean) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  monitoringLive: false,
  fanLive: false,
  setMonitoringLive: (live) => set({ monitoringLive: live }),
  setFanLive: (live) => set({ fanLive: live }),
}));
