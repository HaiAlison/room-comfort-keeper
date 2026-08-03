import { LogOut, Moon, RefreshCw, Sun, User2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useThemeStore } from "@/stores/theme.store";

export function Navbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, signOut } = useAuth();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const autoRefresh = useThemeStore((s) => s.autoRefresh);
  const setAutoRefresh = useThemeStore((s) => s.setAutoRefresh);
  const queryClient = useQueryClient();

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="shrink-0" />
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
          {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 lg:flex">
          <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          <Label htmlFor="auto-refresh" className="text-xs text-muted-foreground">
            Live
          </Label>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Refresh data"
          onClick={() => queryClient.invalidateQueries()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Account menu">
              <User2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user?.name ?? "Signed in"}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
