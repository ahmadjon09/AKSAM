// Admin request helper: every call goes through the access token from the
// auth store. On a 401 it silently tries one refresh-token rotation and
// retries the call; if that fails too, the session is cleared and the user
// is sent back to the login screen.

"use client";

import { adminApi, ApiError } from "./api";
import { useAuthStore } from "./store/auth";

export async function adminCall<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const state = useAuthStore.getState();
  if (!state.token) throw new ApiError(401, "unauthorized", "Not signed in");

  try {
    return await fn(state.token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      try {
        const res = await adminApi.refresh();
        state.setSession(res.accessToken, res.user);
        return await fn(res.accessToken);
      } catch {
        await state.logout();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
          window.location.href = "/admin/login";
        }
        throw err;
      }
    }
    throw err;
  }
}

export function adminErrorMessage(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 0) return t("errors.network");
    if (err.status === 429) return t("errors.rateLimited");
    if (err.status === 403) return t("errors.forbidden");
    if (err.status === 404) return t("errors.notFound");
    if (err.code === "validation_error" || err.code === "bad_request") return t("errors.validation");
    if (err.status === 401) return t("errors.unauthorized");
  }
  return t("errors.generic");
}
