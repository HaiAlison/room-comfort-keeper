import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuthStore } from "@/stores/auth.store";
import { useAlertsSSE } from "@/hooks/use-alerts-sse";
import { useFanSSE } from "@/hooks/use-fan-sse";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [ready, setReady] = useState(false);
  
  useAlertsSSE();
  useFanSSE();

  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !token) navigate({ to: "/", replace: true });
  }, [ready, token, navigate]);

  if (!ready || !token) {
    return (
      <div className="grid min-h-svh place-items-center bg-background text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
