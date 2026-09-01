import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAlertsSSE } from "@/hooks/use-alerts-sse";
import ProtectedRoute from "@/auth/ProtectedRoute";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  useAlertsSSE();

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-svh w-full bg-background">
          <AppSidebar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
