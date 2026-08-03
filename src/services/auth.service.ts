import { ApiError, mockRequest } from "./api";
import { pushLog } from "@/lib/mock-data";
import type { Session } from "@/lib/types";

const DEMO_EMAIL = "caregiver@smartroom.io";
const DEMO_PASSWORD = "smartroom";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export async function login(payload: LoginPayload): Promise<Session> {
  return mockRequest(() => {
    if (payload.email.trim().toLowerCase() !== DEMO_EMAIL || payload.password !== DEMO_PASSWORD) {
      throw new ApiError("Invalid email or password", 401);
    }
    pushLog({ user: payload.email, action: "User signed in", result: "success" });
    return {
      token: `mock.${btoa(payload.email)}.token`,
      user: {
        id: "usr_1",
        name: "Amina Caregiver",
        email: DEMO_EMAIL,
        role: "Caregiver",
      },
    } satisfies Session;
  }, 600);
}

export async function logout(email: string): Promise<void> {
  return mockRequest(() => {
    pushLog({ user: email, action: "User signed out", result: "success" });
  }, 200);
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
