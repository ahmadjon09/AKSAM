// Typed API calls. Public reads fall back to the bundled demo dataset when
// the backend is down, so the site never renders empty. Admin calls throw
// and let the UI show the error state instead.

import { apiFetch, resolveApiBase } from "./client";
export { ApiError } from "./client";

import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_SETTINGS,
} from "../fallback/data";

import type {
  AdminStatsDto,
  AdminUserDto,
  AuthResponse,
  CategoryDto,
  LeadDto,
  ProductDto,
  PublicSettingsDto,
  VisitorsDto,
} from "../types";
import { unstable_cache } from "next/cache";

// ---------------------------------------------------------------------------
// Server-side reads (build time + ISR)
// ---------------------------------------------------------------------------

const SERVER_TIMEOUT = 4500;

async function serverFetch<T>(path: string): Promise<T> {
  const bases = [
    process.env.NEXT_API_INTERNAL_BASE,
    process.env.NEXT_PUBLIC_API_BASE,
  ]
    .filter((v): v is string => !!v)
    .map((v) => v.replace(/\/+$/, ""));

  for (const base of bases) {
    try {
      const res = await fetch(`${base}${path}`, {
        cache: "force-cache",
      });

      if (res.ok) {
        return (await res.json()) as T;
      }
    } catch {
      // Try the next base.
    }
  }

  throw new Error("API unreachable");
}

// ---------------------------------------------------------------------------
// Live fetch for dynamic endpoints (sitemap)
// ---------------------------------------------------------------------------

export async function fetchProductsLive(): Promise<ProductDto[]> {
  const bases = [
    process.env.NEXT_API_INTERNAL_BASE,
    process.env.NEXT_PUBLIC_API_BASE,
  ]
    .filter((v): v is string => !!v)
    .map((v) => v.replace(/\/+$/, ""));

  for (const base of bases) {
    try {
      const res = await fetch(`${base}/v1/public/products`, {
        cache: "no-store",
        signal: AbortSignal.timeout(SERVER_TIMEOUT),
      });

      if (res.ok) {
        const json = (await res.json()) as {
          data: ProductDto[];
        };

        if (
          Array.isArray(json.data) &&
          json.data.length
        ) {
          return json.data;
        }
      }
    } catch {
      // Try the next base.
    }
  }

  return DEMO_PRODUCTS;
}

export const fetchProductsServer = unstable_cache(
  async (): Promise<ProductDto[]> => {
    try {
      const json = await serverFetch<{
        data: ProductDto[];
      }>("/v1/public/products");

      if (!Array.isArray(json.data) || json.data.length === 0) {
        return DEMO_PRODUCTS;
      }

      return json.data;
    } catch {
      return DEMO_PRODUCTS;
    }
  },
  ["public-products"],
  {
    revalidate: 300,
  }
);


export const fetchCategoriesServer = unstable_cache(
  async (): Promise<CategoryDto[]> => {
    try {
      const json = await serverFetch<{
        data: CategoryDto[];
      }>("/v1/public/categories");

      if (
        !Array.isArray(json.data) ||
        json.data.length === 0
      ) {
        return DEMO_CATEGORIES;
      }

      return json.data;
    } catch {
      return DEMO_CATEGORIES;
    }
  },
  ["public-categories"],
  {
    revalidate: 300,
    tags: ["public-categories"],
  }
);

export const fetchSettingsServer = unstable_cache(
  async (): Promise<PublicSettingsDto> => {
    try {
      const json = await serverFetch<{
        data: PublicSettingsDto;
      }>("/v1/public/settings");

      if (!json.data?.siteName) {
        return DEMO_SETTINGS;
      }

      return json.data;
    } catch {
      return DEMO_SETTINGS;
    }
  },
  ["public-settings"],
  {
    revalidate: 300,
    tags: ["public-settings"],
  }
);

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
    body: {
      ...input,
      website: "aksam.uz",
      honey: "",
    },
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
    body: {
      ...input,
      honey: "",
    },
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

    if (
      typeof navigator !== "undefined" &&
      navigator.sendBeacon
    ) {
      navigator.sendBeacon(
        `${base}/v1/track`,
        new Blob([body], {
          type: "application/json",
        })
      );
    } else {
      await apiFetch("/v1/track", {
        method: "POST",
        body: input,
        timeoutMs: 2500,
      });
    }
  } catch {
    // Analytics must never disturb the visitor experience.
  }
}

// ---------------------------------------------------------------------------
// Admin calls
// ---------------------------------------------------------------------------

const withAuth = (token: string | null) => ({
  token,
});

export const adminApi = {
  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/v1/admin/auth/login", {
      method: "POST",
      body: {
        email,
        password,
      },
    }),

  refresh: () =>
    apiFetch<AuthResponse>(
      "/v1/admin/auth/refresh",
      {
        method: "POST",
      }
    ),

  logout: () =>
    apiFetch<{ ok: boolean }>(
      "/v1/admin/auth/logout",
      {
        method: "POST",
      }
    ),

  me: (token: string) =>
    apiFetch<{ user: AdminUserDto }>(
      "/v1/admin/auth/me",
      withAuth(token)
    ),

  // -------------------------------------------------------------------------
  // Products
  // -------------------------------------------------------------------------

  listProducts: (token: string) =>
    apiFetch<{ data: ProductDto[] }>(
      "/v1/admin/products",
      withAuth(token)
    ),

  getProduct: (token: string, id: string) =>
    apiFetch<{ data: ProductDto }>(
      `/v1/admin/products/${id}`,
      withAuth(token)
    ),

  createProduct: (
    token: string,
    payload: unknown
  ) =>
    apiFetch<{ data: ProductDto }>(
      "/v1/admin/products",
      {
        method: "POST",
        body: payload,
        ...withAuth(token),
      }
    ),

  updateProduct: (
    token: string,
    id: string,
    payload: unknown
  ) =>
    apiFetch<{ data: ProductDto }>(
      `/v1/admin/products/${id}`,
      {
        method: "PATCH",
        body: payload,
        ...withAuth(token),
      }
    ),

  deleteProduct: (
    token: string,
    id: string
  ) =>
    apiFetch<{ ok: boolean }>(
      `/v1/admin/products/${id}`,
      {
        method: "DELETE",
        ...withAuth(token),
      }
    ),

  // -------------------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------------------

  listCategories: (token: string) =>
    apiFetch<{ data: CategoryDto[] }>(
      "/v1/admin/categories",
      withAuth(token)
    ),

  createCategory: (
    token: string,
    payload: unknown
  ) =>
    apiFetch<{ data: CategoryDto }>(
      "/v1/admin/categories",
      {
        method: "POST",
        body: payload,
        ...withAuth(token),
      }
    ),

  updateCategory: (
    token: string,
    id: string,
    payload: unknown
  ) =>
    apiFetch<{ data: CategoryDto }>(
      `/v1/admin/categories/${id}`,
      {
        method: "PATCH",
        body: payload,
        ...withAuth(token),
      }
    ),

  deleteCategory: (
    token: string,
    id: string
  ) =>
    apiFetch<{ ok: boolean }>(
      `/v1/admin/categories/${id}`,
      {
        method: "DELETE",
        ...withAuth(token),
      }
    ),

  // -------------------------------------------------------------------------
  // Leads
  // -------------------------------------------------------------------------

  listLeads: (
    token: string,
    query = ""
  ) =>
    apiFetch<{ data: LeadDto[] }>(
      `/v1/admin/leads${query}`,
      withAuth(token)
    ),

  updateLead: (
    token: string,
    id: string,
    payload: {
      status?: string;
      note?: string;
    }
  ) =>
    apiFetch<{ data: LeadDto }>(
      `/v1/admin/leads/${id}`,
      {
        method: "PATCH",
        body: payload,
        ...withAuth(token),
      }
    ),

  deleteLead: (
    token: string,
    id: string
  ) =>
    apiFetch<{ ok: boolean }>(
      `/v1/admin/leads/${id}`,
      {
        method: "DELETE",
        ...withAuth(token),
      }
    ),

  // -------------------------------------------------------------------------
  // Settings
  // -------------------------------------------------------------------------

  getSettings: (token: string) =>
    apiFetch<{ data: PublicSettingsDto }>(
      "/v1/admin/settings",
      withAuth(token)
    ),

  updateSettings: (
    token: string,
    payload: unknown
  ) =>
    apiFetch<{ data: PublicSettingsDto }>(
      "/v1/admin/settings",
      {
        method: "PATCH",
        body: payload,
        ...withAuth(token),
      }
    ),

  // -------------------------------------------------------------------------
  // Upload
  // -------------------------------------------------------------------------

  uploadImage: (
    token: string,
    file: File
  ) => {
    const form = new FormData();

    form.append("file", file);

    return apiFetch<{
      url: string;
      thumbUrl: string;
      deleteUrl: string;
    }>("/v1/admin/upload", {
      method: "POST",
      body: form,
      isFormData: true,
      timeoutMs: 60000,
      ...withAuth(token),
    });
  },

  getStats: (token: string) =>
    apiFetch<{ data: AdminStatsDto }>(
      "/v1/admin/stats",
      withAuth(token)
    ),

  getVisitors: (
    token: string,
    days: number
  ) =>
    apiFetch<{ data: VisitorsDto }>(
      `/v1/admin/visitors?days=${days}`,
      withAuth(token)
    ),
};