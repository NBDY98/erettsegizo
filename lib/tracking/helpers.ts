// ─── Tracking Helpers ────────────────────────────────────────────────────────
// Shared utilities for event ID generation, hashing, and click ID management.

/**
 * Generate a unique event ID for deduplication.
 * The same ID is used for both browser-side pixel and server-side API calls,
 * so Meta/TikTok can deduplicate and count the event only once.
 */
export function generateEventId(): string {
  // Use crypto.randomUUID if available (modern browsers + Node 19+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random string
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get current Unix timestamp in seconds (required by Meta CAPI and TikTok Events API).
 */
export function getUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// ─── SHA-256 Hashing ─────────────────────────────────────────────────────────

/**
 * Hash a value with SHA-256 for server-side API calls.
 * Meta and TikTok both require: lowercase → trim → SHA-256 hex digest.
 *
 * This function works in both browser (Web Crypto API) and Node.js environments.
 */
export async function hashForTracking(value: string | undefined): Promise<string | undefined> {
  if (!value || value.trim() === '') return undefined;

  const normalized = value.toLowerCase().trim();

  // Server-side (Node.js)
  if (typeof globalThis.process !== 'undefined') {
    try {
      const { createHash } = await import('crypto');
      return createHash('sha256').update(normalized).digest('hex');
    } catch {
      // Fall through to Web Crypto API
    }
  }

  // Browser-side (Web Crypto API)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  console.warn('[Tracking] SHA-256 hashing not available in this environment');
  return undefined;
}

// ─── Cookie Helpers (browser-only) ───────────────────────────────────────────

/**
 * Read a cookie value by name. Returns empty string if not found.
 * Only works in browser context.
 */
export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
}

/**
 * Set a cookie with the given name, value, and expiry in days.
 * Only works in browser context.
 */
export function setCookie(name: string, value: string, days: number = 90): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

// ─── Meta (Facebook) Click ID Helpers ────────────────────────────────────────

/**
 * Extract `fbclid` from the current URL and convert it to `fbc` cookie format.
 * Format: `fb.1.{timestamp_ms}.{fbclid}`
 *
 * If fbclid is present in the URL, it is also stored in a `_fbc` cookie
 * so it persists across page navigations.
 */
export function captureFbclid(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');

  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    setCookie('_fbc', fbc, 90);
    return fbc;
  }

  // If no fbclid in URL, try reading from existing cookie
  const existingFbc = getCookie('_fbc');
  return existingFbc || undefined;
}

/**
 * Read the `_fbp` cookie set by Meta Pixel.
 * This is the browser ID that Meta Pixel automatically creates.
 */
export function getFbp(): string | undefined {
  const fbp = getCookie('_fbp');
  return fbp || undefined;
}

// ─── TikTok Click ID Helpers ─────────────────────────────────────────────────

/**
 * Extract `ttclid` from the current URL and store in a cookie.
 * TikTok uses this for attribution.
 */
export function captureTtclid(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  const ttclid = params.get('ttclid');

  if (ttclid) {
    setCookie('_ttclid', ttclid, 90);
    return ttclid;
  }

  // If no ttclid in URL, try reading from existing cookie
  const existingTtclid = getCookie('_ttclid');
  return existingTtclid || undefined;
}

/**
 * Read the `_ttp` cookie set by TikTok Pixel.
 * This is the browser ID that TikTok Pixel automatically creates.
 */
export function getTtp(): string | undefined {
  const ttp = getCookie('_ttp');
  return ttp || undefined;
}

// ─── Debug Logging ───────────────────────────────────────────────────────────

const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Log tracking events in development mode for debugging.
 * Prefixed with [Tracking] for easy filtering in console.
 */
export function trackingLog(
  platform: 'Meta' | 'TikTok' | 'SAPI' | 'General',
  action: string,
  data?: unknown
): void {
  if (!IS_DEV) return;
  const prefix = `[Tracking:${platform}]`;
  if (data) {
    console.log(prefix, action, data);
  } else {
    console.log(prefix, action);
  }
}
