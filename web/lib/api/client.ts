// Thin fetch wrapper around the AKSAM API.
//
// Base URL resolution order:
//   1. Arena/E2B preview environments derive the API host from the page host
//      (the API runs on port 4000 next to the frontend on port 3000).
//   2. NEXT_PUBLIC_API_BASE, baked in at build time (Cloudflare Pages).
//   3. Same origin as a last resort.

"use client";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function resolveApiBase(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const match = host.match(/^(\d+)-([a-z0-9-]+)\.e2b\.app$/i);
    if (match && match[1] === "3000") {
      return `https://4000-${match[2]}.e2b.app`;
    }
  }
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
  isFormData?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, timeoutMs = 9000, isFormData = false } = options;
  const base = resolveApiBase();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${base}${path}`, {
      method,
      headers,
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
      credentials: "include",
      signal: controller.signal
    });

    const text = await res.text();
    const data = (text ? safeParse(text) : {}) as { message?: string; code?: string };

    if (!res.ok) {
      const message = data.message || `Request failed with status ${res.status}`;
      throw new ApiError(res.status, data.code || "error", message);
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new ApiError(0, "timeout", "Request timed out");
    }
    throw new ApiError(0, "network", "Network error");
  } finally {
    clearTimeout(timer);
  }
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
