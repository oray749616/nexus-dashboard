/**
 * Icon Cache Types
 * LocalStorage-based icon URL caching system
 */

/**
 * Single icon cache entry structure
 */
export interface IconCacheEntry {
  url: string;           // Valid icon URL (verified to load successfully)
  serviceIndex: number;  // Index in fallback chain (0=Google, 1=DuckDuckGo, 2=IconHorse, 3=Origin, 4=Clearbit)
  timestamp: number;     // Cache creation time (Unix timestamp in milliseconds)
  domain: string;        // Domain name (redundant for debugging purposes)
}

/**
 * Icon cache dictionary mapping domains to cache entries
 */
export interface IconCache {
  [domain: string]: IconCacheEntry;
}

/**
 * Cache configuration constants
 */
export const ICON_CACHE_CONFIG = {
  KEY: 'nexus_icon_cache',           // LocalStorage key name
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // Cache expiration: 7 days
  MAX_ENTRIES: 100,                  // Maximum number of cached domains
} as const;
