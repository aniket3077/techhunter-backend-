import type { ApiFailure, ApiSuccess } from "@/src/types/api";

export function ok<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

export function fail(code: string, message: string): ApiFailure {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}
