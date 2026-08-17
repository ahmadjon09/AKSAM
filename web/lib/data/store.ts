// Client-side data cache. Pages are prerendered static (instant navigation),
// and this store hydrates fresh products/categories/settings from the API
// once per session. Header/footer read settings from here; the catalog and
// product pages silently adopt fresher data after hydration, so admin edits
// still appear without a redeploy — but navigation never waits on the API.

"use client";

import { create } from "zustand";
import { apiFetch } from "../api/client";
import { DEMO_SETTINGS } from "../fallback/data";
import type { CategoryDto, ProductDto, PublicSettingsDto } from "../types";

interface DataState {
  products: ProductDto[] | null;
  categories: CategoryDto[] | null;
  settings: PublicSettingsDto;
  hydrated: boolean;
}

export const useDataStore = create<DataState>(() => ({
  products: null,
  categories: null,
  settings: DEMO_SETTINGS,
  hydrated: false
}));

let inflight: Promise<void> | null = null;

export function ensureHydrated(): Promise<void> | null {
  const state = useDataStore.getState();
  if (state.hydrated) return null;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const [p, c, s] = await Promise.all([
        apiFetch<{ data: ProductDto[] }>("/v1/public/products", { timeoutMs: 7000 }),
        apiFetch<{ data: CategoryDto[] }>("/v1/public/categories", { timeoutMs: 7000 }),
        apiFetch<{ data: PublicSettingsDto }>("/v1/public/settings", { timeoutMs: 7000 })
      ]);
      useDataStore.setState({
        products: Array.isArray(p.data) && p.data.length ? p.data : null,
        categories: Array.isArray(c.data) && c.data.length ? c.data : null,
        settings: s.data?.siteName ? s.data : DEMO_SETTINGS,
        hydrated: true
      });
    } catch {
      // The API is unreachable — the site keeps running on the bundled demo
      // dataset and the header/footer defaults.
      useDataStore.setState({ hydrated: true });
    }
  })();

  return inflight;
}
