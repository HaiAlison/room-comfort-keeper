import api from "@/lib/api";
import { setAccessToken, setRefreshToken, removeTokens } from "@/lib/auth-tokens";
import type { AuthResponse, LoginCredentials, PublicUser, RefreshResponse, RegisterCredentials } from "@/types/auth";

export const authService = {
  /** POST /auth/login */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", credentials);
    return res.data;
  },

  /** POST /auth/register */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", credentials);
    return res.data;
  },

  /** POST /auth/refresh */
  refresh: async (refresh_token: string): Promise<RefreshResponse> => {
    const res = await api.post<RefreshResponse>("/auth/refresh", { refresh_token });
    return res.data;
  },

  /** GET /auth/me */
  me: async (): Promise<PublicUser> => {
    const res = await api.get<PublicUser>("/auth/me");
    return res.data;
  },

  /** Persist tokens to localStorage then return the user */
  persistSession: (data: AuthResponse): PublicUser => {
    setAccessToken(data.tokens.access_token);
    setRefreshToken(data.tokens.refresh_token);
    return data.user;
  },

  /** Clear all stored tokens */
  clearSession: (): void => {
    removeTokens();
  },
};
