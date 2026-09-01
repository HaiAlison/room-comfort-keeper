import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicUser } from "@/types/auth";

interface AuthState {
  user: PublicUser | null;
  hydrated: boolean;
  signIn: (user: PublicUser) => void;
  signOut: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "smartroom-auth",
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const useCurrentUserEmail = () => useAuthStore((s) => s.user?.email ?? "unknown");
