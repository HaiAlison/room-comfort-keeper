import { API_BASE_URL, API_ROUTES, ApiError } from "./api";
import { setAccessToken, removeTokens } from "@/lib/auth-tokens";
import type { Session } from "@/lib/types";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export async function login(payload: LoginPayload): Promise<Session> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${API_ROUTES.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  if (!response.ok) {
    let message = "Invalid email or password";
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      }
    } catch {
      /* keep default message */
    }
    throw new ApiError(message, response.status);
  }

  const session = (await response.json()) as Session;

  // The axios client (src/lib/api.ts) reads the token from localStorage —
  // keep it in sync so alerts/activity-logs requests carry the JWT too.
  setAccessToken(session.token);

  return session;
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
