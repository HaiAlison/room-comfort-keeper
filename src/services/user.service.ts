import api from "@/lib/api";
import type { PublicUser } from "@/types/auth";

export const userService = {
  /** GET /auth/me — returns the authenticated user's public profile */
  me: async (): Promise<PublicUser> => {
    const res = await api.get<PublicUser>("/auth/me");
    return res.data;
  },
};