import { mockRequest } from "./api";
import { db, pushLog } from "@/lib/mock-data";
import type { DeviceStatus, FanState } from "@/lib/types";

export async function getDeviceStatus(): Promise<DeviceStatus> {
  return mockRequest(() => ({ ...db.device }), 250);
}

export async function getFanState(): Promise<FanState> {
  return mockRequest(() => ({ ...db.fan }), 200);
}

async function setFan(on: boolean, user: string): Promise<FanState> {
  return mockRequest(() => {
    db.fan = {
      on,
      reason: "Manual override",
      mode: "manual",
      updatedAt: new Date().toISOString(),
    };
    pushLog({ user, action: `Fan turned ${on ? "ON" : "OFF"} (manual)`, result: "success" });
    return { ...db.fan };
  }, 800);
}

export async function turnFanOn(user: string): Promise<FanState> {
  return setFan(true, user);
}

export async function turnFanOff(user: string): Promise<FanState> {
  return setFan(false, user);
}

export async function setFanMode(mode: "auto" | "manual", user: string): Promise<FanState> {
  return mockRequest(() => {
    db.fan = { ...db.fan, mode, updatedAt: new Date().toISOString() };
    pushLog({ user, action: `Fan control mode set to ${mode}`, result: "success" });
    return { ...db.fan };
  }, 400);
}
