/**
 * Icon Cache Utilities
 * LocalStorage-based icon URL caching system
 */

import { IconCache, IconCacheEntry, ICON_CACHE_CONFIG } from '@/lib/types/iconCache';

/**
 * Check if LocalStorage is available and functional
 * @returns true if LocalStorage can be used
 */
export const isIconCacheAvailable = (): boolean => {
  try {
    const testKey = '__nexus_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Load complete cache from LocalStorage
 * @returns Icon cache object or empty object if unavailable/corrupted
 */
const loadCache = (): IconCache => {
  if (!isIconCacheAvailable()) return {};

  try {
    const raw = localStorage.getItem(ICON_CACHE_CONFIG.KEY);
    if (!raw) return {};

    const cache = JSON.parse(raw) as IconCache;

    // Validate data structure
    if (typeof cache !== 'object' || Array.isArray(cache)) {
      console.warn('[IconCache] Cache data corrupted, resetting');
      return {};
    }

    return cache;
  } catch (error) {
    console.error('[IconCache] Failed to load cache:', error);
    return {};
  }
};

/**
 * Save complete cache to LocalStorage
 * @param cache Icon cache object to save
 * @returns true if save succeeded
 */
const saveCache = (cache: IconCache): boolean => {
  if (!isIconCacheAvailable()) return false;

  try {
    localStorage.setItem(ICON_CACHE_CONFIG.KEY, JSON.stringify(cache));
    return true;
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('[IconCache] Storage quota exceeded, cleaning old cache...');

      // Remove oldest 20% of entries
      const entries = Object.entries(cache);
      const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const keepCount = Math.floor(entries.length * 0.8);

      const cleanedCache: IconCache = {};
      sortedEntries.slice(-keepCount).forEach(([domain, entry]) => {
        cleanedCache[domain] = entry;
      });

      // Retry recursively
      return saveCache(cleanedCache);
    }

    console.error('[IconCache] Failed to save cache:', error);
    return false;
  }
};

/**
 * Get icon information from cache
 * @param domain Domain name (e.g., "github.com")
 * @returns Cached entry or null if not found/expired
 */
export const getIconFromCache = (domain: string): IconCacheEntry | null => {
  const cache = loadCache();
  const entry = cache[domain];

  if (!entry) return null;

  // Check if expired
  const now = Date.now();
  const age = now - entry.timestamp;

  if (age > ICON_CACHE_CONFIG.MAX_AGE) {
    console.log(`[IconCache] Cache expired: ${domain} (${Math.floor(age / 86400000)} days)`);

    // Asynchronously delete expired entry (non-blocking)
    setTimeout(() => {
      const freshCache = loadCache();
      delete freshCache[domain];
      saveCache(freshCache);
    }, 0);

    return null;
  }

  return entry;
};

/**
 * Save icon to cache
 * @param domain Domain name
 * @param url Valid icon URL
 * @param serviceIndex Fallback chain index
 */
export const saveIconToCache = (
  domain: string,
  url: string,
  serviceIndex: number
): void => {
  const cache = loadCache();

  // Check capacity limit
  if (Object.keys(cache).length >= ICON_CACHE_CONFIG.MAX_ENTRIES && !cache[domain]) {
    // Remove oldest entry
    const entries = Object.entries(cache);
    const oldest = entries.reduce((min, [d, entry]) =>
      entry.timestamp < min[1].timestamp ? [d, entry] : min
    );
    delete cache[oldest[0]];
    console.log(`[IconCache] Capacity full, removed oldest: ${oldest[0]}`);
  }

  // Save new entry
  cache[domain] = {
    url,
    serviceIndex,
    timestamp: Date.now(),
    domain, // Redundant for debugging
  };

  saveCache(cache);
  console.log(`[IconCache] Cached icon: ${domain} (service index: ${serviceIndex})`);
};

/**
 * Clean all expired cache entries (can be called on app startup)
 * @returns Number of entries cleaned
 */
export const cleanExpiredCache = (): number => {
  const cache = loadCache();
  const now = Date.now();
  let cleanedCount = 0;

  Object.keys(cache).forEach(domain => {
    const age = now - cache[domain].timestamp;
    if (age > ICON_CACHE_CONFIG.MAX_AGE) {
      delete cache[domain];
      cleanedCount++;
    }
  });

  if (cleanedCount > 0) {
    saveCache(cache);
    console.log(`[IconCache] Cleaned ${cleanedCount} expired entries`);
  }

  return cleanedCount;
};

/**
 * Clear all icon cache (for debugging)
 */
export const clearIconCache = (): void => {
  if (!isIconCacheAvailable()) return;
  localStorage.removeItem(ICON_CACHE_CONFIG.KEY);
  console.log('[IconCache] Cleared all icon cache');
};

/**
 * Get cache statistics (for debugging)
 * @returns Cache statistics object
 */
export const getIconCacheStats = () => {
  const cache = loadCache();
  const entries = Object.values(cache);

  return {
    totalEntries: entries.length,
    oldestTimestamp: entries.length > 0
      ? Math.min(...entries.map(e => e.timestamp))
      : null,
    newestTimestamp: entries.length > 0
      ? Math.max(...entries.map(e => e.timestamp))
      : null,
    serviceDistribution: entries.reduce((acc, entry) => {
      acc[entry.serviceIndex] = (acc[entry.serviceIndex] || 0) + 1;
      return acc;
    }, {} as Record<number, number>),
  };
};
