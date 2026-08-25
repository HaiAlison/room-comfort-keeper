import { create } from "zustand";

interface AlertState {
  hasUnread: boolean;
  setHasUnread: (val: boolean) => void;
}

export const useAlertStore = create<AlertState>()((set) => ({
  hasUnread: false,
  setHasUnread: (val) => set({ hasUnread: val }),
}));
