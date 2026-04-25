import { getHealthHandler } from "@/src/modules/health/health.controller";

export async function GET() {
  return getHealthHandler();
}
