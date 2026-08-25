import { useEffect } from "react";
import { toast } from "sonner";
import { useAlertStore } from "@/stores/alert.store";

export function useAlertsSSE() {
  const setHasUnread = useAlertStore((s) => s.setHasUnread);

  useEffect(() => {
    const sse = new EventSource(`${import.meta.env.VITE_API_URL}/alerts/events`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setHasUnread(true);

      switch (data.severity) {
        case 'critical':
          toast.error(data.message);
          break;
        case 'warning':
          toast.warning(data.message);
          break;
        case 'info':
          toast.info(data.message);
          break;
        default:
          toast(data.message);
          break;
      }
    };

    sse.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    return () => {
      sse.close();
    };
  }, [setHasUnread]);
}
