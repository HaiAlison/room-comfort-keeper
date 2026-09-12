import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BellRing,
  Fan,
  Gauge,
  LayoutDashboard,
  ScrollText,
  SlidersHorizontal,
  Thermometer,
} from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAlertStore } from "@/stores/alert.store";

const monitoring = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Monitoring", url: "/monitoring", icon: Thermometer },
  { title: "History", url: "/history", icon: Activity },
] as const;

const control = [
  { title: "Device Control", url: "/device-control", icon: Fan },
  { title: "Threshold", url: "/threshold", icon: SlidersHorizontal },
] as const;

const records = [
  { title: "Alerts", url: "/alerts", icon: BellRing },
  { title: "Activity Logs", url: "/activity-logs", icon: ScrollText },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const hasUnreadAlerts = useAlertStore((s) => s.hasUnread);

  const renderGroup = (label: string, items: readonly { title: string; url: string; icon: typeof Gauge }[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link to={item.url} className="relative flex items-center w-full">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                  {item.url === '/alerts' && hasUnreadAlerts && (
                    <div className="absolute right-2 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex min-w-0 items-center gap-2 px-1 py-1.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Gauge className="h-5 w-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">{APP_NAME}</p>
            <p className="truncate text-xs text-muted-foreground">{APP_TAGLINE}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Monitoring", monitoring)}
        {renderGroup("Control", control)}
        {renderGroup("Records", records)}
      </SidebarContent>
      <SidebarFooter>
        <p className="px-2 pb-1 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          Mock data · NestJS API ready
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
