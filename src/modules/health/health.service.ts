import { env } from "@/src/config/env";

export type HealthPayload = {
  status: "ok";
  service: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
};

export function getHealth(): HealthPayload {
  return {
    status: "ok",
    service: env.APP_NAME,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  };
}
