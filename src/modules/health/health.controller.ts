import { NextResponse } from "next/server";

import { ok } from "@/src/lib/http";
import { getHealth } from "@/src/modules/health/health.service";

export async function getHealthHandler() {
  const payload = getHealth();
  return NextResponse.json(ok(payload), { status: 200 });
}
