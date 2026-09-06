import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import { getDeviceStatus, getFanState, setFanMode, turnFanOff, turnFanOn } from "@/services/device.service";
import { useCurrentUserEmail } from "@/stores/auth.store";
import { useRealtimeStore } from "@/stores/realtime.store";
import { useThemeStore } from "@/stores/theme.store";

export function useDeviceStatus() {
  const autoRefresh = useThemeStore((s) => s.autoRefresh);
  return useQuery({
    queryKey: QUERY_KEYS.device,
    queryFn: getDeviceStatus,
    refetchInterval: autoRefresh ? 10000 : false,
  });
}

export function useFanState() {
  const autoRefresh = useThemeStore((s) => s.autoRefresh);
  const interval = useThemeStore((s) => s.refreshIntervalMs);
  // SSE (use-fan-sse) ghi trạng thái quạt thẳng vào cache này —
  // đang nối stream thì khỏi poll, rớt stream thì poll làm fallback.
  const sseLive = useRealtimeStore((s) => s.fanLive);
  return useQuery({
    queryKey: QUERY_KEYS.fan,
    queryFn: getFanState,
    refetchInterval: autoRefresh && !sseLive ? interval : false,
  });
}

export function useFanControl() {
  const queryClient = useQueryClient();
  const email = useCurrentUserEmail();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fan });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.logs });
  };

  const power = useMutation({
    mutationFn: (on: boolean) => (on ? turnFanOn(email) : turnFanOff(email)),
    onSuccess: (state) => {
      invalidate();
      toast.success(`Fan turned ${state.on ? "ON" : "OFF"}`, { description: "Command delivered to the device." });
    },
    onError: (error: Error) => toast.error("Command failed", { description: error.message }),
  });

  const mode = useMutation({
    mutationFn: (next: "auto" | "manual") => setFanMode(next, email),
    onSuccess: (state) => {
      invalidate();
      toast.success(`Control mode: ${state.mode}`);
    },
    onError: (error: Error) => toast.error("Command failed", { description: error.message }),
  });

  return { power, mode };
}
