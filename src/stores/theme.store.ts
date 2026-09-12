import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  autoRefresh: boolean;
  refreshIntervalMs: number;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAutoRefresh: (value: boolean) => void;
}

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      autoRefresh: true,
      refreshIntervalMs: 10000,
      setTheme: (theme) => {
        apply(theme);
        set({ theme });
      },
      toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
      setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
    }),
    {
      name: "smartroom-preferences",
      onRehydrateStorage: () => (state) => {
        if (state) apply(state.theme);
      },
    },
  ),
);
