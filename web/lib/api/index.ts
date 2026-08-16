// Typed API calls. Public reads fall back to the bundled demo dataset when
// the backend is down, so the site never renders empty. Admin calls throw
// and let the UI show the error state instead.

import { apiFetch, resolveApiBase } from "./client";
export { ApiError } from "./client";
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_SETTINGS
} from "../fallback/data";
import type {
  AdminStatsDto,
  AdminUserDto,
  AuthResponse,
  CategoryDto,
  LeadDto,
  ProductDto,
  PublicSettingsDto,
  VisitorsDto
} from "../types";

// ---------------------------------------------------------------------------
// Server-side reads (build time + ISR)
// ---------------------------------------------------------------------------

const SERVER_TIMEOUT = 4500;

async function serverFetch<T>(path: string): Promise<T> {
  // Server components run next to the API, so they always use the internal
  // address — never the public tunnel URL (avoids a slow hairpin round-trip).
  const base = (process.env.NEXT_API_INTERNAL_BASE ?? "http://localhost:4000").replace(/\/+$/, "");
  // No revalidate option: these pages are force-dynamic, and the edge
  // runtime (Cloudflare Workers) does not support ISR fetch options.
  const res = await fetch(`${base}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(SERVER_TIMEOUT)
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchProductsServer(): Promise<ProductDto[]> {
  try {
    const json = await serverFetch<{ data: ProductDto[] }>("/v1/public/products");
    if (!Array.isArray(json.data) || json.data.length === 0) return DEMO_PRODUCTS;
    return json.data;
  } catch {
    return DEMO_PRODUCTS;
  }
}

export async function fetchCategoriesServer(): Promise<CategoryDto[]> {
  try {
    const json = await serverFetch<{ data: CategoryDto[] }>("/v1/public/categories");
    if (!Array.isArray(json.data) || json.data.length === 0) return DEMO_CATEGORIES;
    return json.data;
  } catch {
    return DEMO_CATEGORIES;
  }
}

export async function fetchSettingsServer(): Promise<PublicSettingsDto> {
  try {
    const json = await serverFetch<{ data: PublicSettingsDto }>("/v1/public/settings");
    if (!json.data?.siteName) return DEMO_SETTINGS;
    return json.data;
  } catch {
    return DEMO_SETTINGS;
  }
}

// ---------------------------------------------------------------------------
// Public browser-side calls
// ---------------------------------------------------------------------------

export async function submitOrder(input: {
  fullName: string;
  phone: string;
  message?: string;
  productSlug?: string;
  productName?: string;
  lang: string;
}): Promise<{ ok: boolean }> {
  return apiFetch("/v1/orders", {
    method: "POST",
    body: { ...input, website: "aksam.uz", honey: "" }
  });
}

export async function submitContact(input: {
  fullName: string;
  phone: string;
  message?: string;
  lang: string;
}): Promise<{ ok: boolean }> {
  return apiFetch("/v1/contact", {
    method: "POST",
    body: { ...input, honey: "" }
  });
}

export async function trackVisit(input: {
  token: string;
  path: string;
  referrer: string;
  lang: string;
}): Promise<void> {
  try {
    const base = resolveApiBase();
    const body = JSON.stringify(input);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(`${base}/v1/track`, new Blob([body], { type: "application/json" }));
    } else {
      await apiFetch("/v1/track", { method: "POST", body: input, timeoutMs: 2500 });
    }
  } catch {
    // Analytics must never disturb the visitor experience.
  }
}

// ---------------------------------------------------------------------------
// Admin calls
// ---------------------------------------------------------------------------

const withAuth = (token: string | null) => ({ token });

export const adminApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/v1/admin/auth/login", {
      method: "POST",
      body: { email, password }
    }),

  refresh: () => apiFetch<AuthResponse>("/v1/admin/auth/refresh", { method: "POST" }),

  logout: () => apiFetch<{ ok: boolean }>("/v1/admin/auth/logout", { method: "POST" }),

  me: (token: string) => apiFetch<{ user: AdminUserDto }>("/v1/admin/auth/me", withAuth(token)),

  listProducts: (token: string) =>
    apiFetch<{ data: ProductDto[] }>("/v1/admin/products", withAuth(token)),

  getProduct: (token: string, id: string) =>
    apiFetch<{ data: ProductDto }>(`/v1/admin/products/${id}`, withAuth(token)),

  createProduct: (token: string, payload: unknown) =>
    apiFetch<{ data: ProductDto }>("/v1/admin/products", {
      method: "POST",
      body: payload,
      ...withAuth(token)
    }),

  updateProduct: (token: string, id: string, payload: unknown) =>
    apiFetch<{ data: ProductDto }>(`/v1/admin/products/${id}`, {
      method: "PATCH",
      body: payload,
      ...withAuth(token)
    }),

  deleteProduct: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/v1/admin/products/${id}`, {
      method: "DELETE",
      ...withAuth(token)
    }),

  listCategories: (token: string) =>
    apiFetch<{ data: CategoryDto[] }>("/v1/admin/categories", withAuth(token)),

  createCategory: (token: string, payload: unknown) =>
    apiFetch<{ data: CategoryDto }>("/v1/admin/categories", {
      method: "POST",
      body: payload,
      ...withAuth(token)
    }),

  updateCategory: (token: string, id: string, payload: unknown) =>
    apiFetch<{ data: CategoryDto }>(`/v1/admin/categories/${id}`, {
      method: "PATCH",
      body: payload,
      ...withAuth(token)
    }),

  deleteCategory: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/v1/admin/categories/${id}`, {
      method: "DELETE",
      ...withAuth(token)
    }),

  listLeads: (token: string, query = "") =>
    apiFetch<{ data: LeadDto[] }>(`/v1/admin/leads${query}`, withAuth(token)),

  updateLead: (token: string, id: string, payload: { status?: string; note?: string }) =>
    apiFetch<{ data: LeadDto }>(`/v1/admin/leads/${id}`, {
      method: "PATCH",
      body: payload,
      ...withAuth(token)
    }),

  deleteLead: (token: string, id: string) =>
    apiFetch<{ ok: boolean }>(`/v1/admin/leads/${id}`, {
      method: "DELETE",
      ...withAuth(token)
    }),

  getSettings: (token: string) =>
    apiFetch<{ data: PublicSettingsDto }>("/v1/admin/settings", withAuth(token)),

  updateSettings: (token: string, payload: unknown) =>
    apiFetch<{ data: PublicSettingsDto }>("/v1/admin/settings", {
      method: "PATCH",
      body: payload,
      ...withAuth(token)
    }),

  uploadImage: (token: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<{ url: string; thumbUrl: string; deleteUrl: string }>("/v1/admin/upload", {
      method: "POST",
      body: form,
      isFormData: true,
      timeoutMs: 60000,
      ...withAuth(token)
    });
  },

  getStats: (token: string) =>
    apiFetch<{ data: AdminStatsDto }>("/v1/admin/stats", withAuth(token)),

  getVisitors: (token: string, days: number) =>
    apiFetch<{ data: VisitorsDto }>(`/v1/admin/visitors?days=${days}`, withAuth(token))
};
