// Client-side data cache with 7-day fallback. Pages are prerendered static (instant navigation),
// and this store hydrates fresh products/categories/settings from the API
// once per session. When server is down, uses cached data for up to 7 days.
// Header/footer read settings from here; the catalog and product pages 
// silently adopt fresher data after hydration, so admin edits still appear 
// without a redeploy — but navigation never waits on the API.

"use client";

import { create } from "zustand";
import { apiFetch } from "../api/client";
import { DEMO_SETTINGS } from "../fallback/data";
import { getCachedData, setCachedData } from "../cache";
import type { CategoryDto, ProductDto, PublicSettingsDto } from "../types";

interface DataState {
  products: ProductDto[] | null;
  categories: CategoryDto[] | null;
  settings: PublicSettingsDto;
  hydrated: boolean;
  fromCache: boolean;
}

export const useDataStore = create<DataState>(() => ({
  products: null,
  categories: null,
  settings: DEMO_SETTINGS,
  hydrated: false,
  fromCache: false
}));

let inflight: Promise<void> | null = null;

export function ensureHydrated(): Promise<void> | null {
  const state = useDataStore.getState();
  if (state.hydrated) return null;
  if (inflight) return inflight;

  // Try to load from cache first for instant display
  const cached = getCachedData();
  if (cached) {
    useDataStore.setState({
      products: (cached.products as ProductDto[]) || null,
      categories: (cached.categories as CategoryDto[]) || null,
      settings: (cached.settings as PublicSettingsDto) || DEMO_SETTINGS,
      hydrated: true,
      fromCache: true
    });
  }

  inflight = (async () => {
    try {
      const [p, c, s] = await Promise.all([
        apiFetch<{ data: ProductDto[] }>("/v1/public/products", { timeoutMs: 7000 }),
        apiFetch<{ data: CategoryDto[] }>("/v1/public/categories", { timeoutMs: 7000 }),
        apiFetch<{ data: PublicSettingsDto }>("/v1/public/settings", { timeoutMs: 7000 })
      ]);
      
      const newProducts = Array.isArray(p.data) && p.data.length ? p.data : null;
      const newCategories = Array.isArray(c.data) && c.data.length ? c.data : null;
      const newSettings = s.data?.siteName ? s.data : DEMO_SETTINGS;
      
      useDataStore.setState({
        products: newProducts,
        categories: newCategories,
        settings: newSettings,
        hydrated: true,
        fromCache: false
      });
      
      // Cache the fresh data
      setCachedData({
        products: newProducts || undefined,
        categories: newCategories || undefined,
        settings: newSettings || undefined
      });
    } catch {
      // The API is unreachable — keep using cached data or demo dataset
      if (!cached) {
        useDataStore.setState({ hydrated: true, fromCache: false });
      }
    }
  })();

  return inflight;
}
