// Client-side cache with 7-day expiration for API data.
// When server is unreachable, returns last cached data within TTL.

const CACHE_KEY = "aksam_api_cache";
const CACHE_TIMESTAMP_KEY = "aksam_api_cache_timestamp";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface CachedData {
  products?: unknown[];
  categories?: unknown[];
  settings?: unknown;
}

export function getCachedData(): CachedData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const cachedStr = localStorage.getItem(CACHE_KEY);
    
    if (!timestampStr || !cachedStr) return null;
    
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return null;
    
    const now = Date.now();
    if (now - timestamp > CACHE_TTL_MS) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(cachedStr) as CachedData;
  } catch {
    return null;
  }
}

export function setCachedData(data: CachedData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    // Storage full or unavailable - silently fail
  }
}

export function clearCache(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch {
    // Silently fail
  }
}

export function isCacheValid(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestampStr) return false;
    
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;
    
    const now = Date.now();
    return now - timestamp <= CACHE_TTL_MS;
  } catch {
    return false;
  }
}
