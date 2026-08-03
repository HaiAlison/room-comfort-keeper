import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, User } from "@/lib/types";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  signIn: (session: Session, remember: boolean) => void;
  signOut: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      signIn: (session, remember) => {
        if (!remember && typeof window !== "undefined") {
          sessionStorage.setItem("smartroom-session-only", "1");
        }
        set({ token: session.token, user: session.user });
      },
      signOut: () => set({ token: null, user: null }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "smartroom-auth",
      partialize: (s) => ({ token: s.token, user: s.user }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const useCurrentUserEmail = () => useAuthStore((s) => s.user?.email ?? "unknown");
