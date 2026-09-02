import api from "@/lib/api";
import { setAccessToken, removeTokens } from "@/lib/auth-tokens";
import type { Session } from "@/lib/types";
import { isAxiosError } from "axios";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export async function login(payload: LoginPayload): Promise<Session> {
  try {
    const response = await api.post<Session>("/auth/login", {
      email: payload.email,
      password: payload.password,
    });

    const session = response.data;

    // The axios client (src/lib/api.ts) reads the token from localStorage —
    // keep it in sync so alerts/activity-logs requests carry the JWT too.
    setAccessToken(session.token);

    return session;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message) {
        throw new Error(Array.isArray(message) ? message.join(", ") : message);
      }
    }
    throw error;
  }
}

export async function logout(_email: string): Promise<void> {
  // Stateless JWT — clearing client-side tokens is enough.
  removeTokens();
  return Promise.resolve();
}

export const DEMO_CREDENTIALS = {
  email: "caregiver@smartroom.io",
  password: "smartroom",
};
