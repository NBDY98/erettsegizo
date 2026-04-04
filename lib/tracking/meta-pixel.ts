// ─── Meta (Facebook) Pixel — Browser-Side ───────────────────────────────────
// Wrapper for the fbq() function to track events with deduplication support.

import type { TrackingCustomData, TrackingUserData } from './types';
import { trackingLog } from './helpers';

// Extend Window to include fbq
declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) & { loaded?: boolean; version?: string };
    _fbq: typeof window.fbq;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Check if Meta Pixel (fbq) is loaded and ready.
 */
function isFbqReady(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

/**
 * Initialize Meta Pixel. Called once when the tracking script loads.
 * The actual script tag is injected by TrackingScripts.tsx.
 */
export function initMetaPixel(): void {
  if (!PIXEL_ID) {
    trackingLog('Meta', 'Pixel ID not configured — skipping init');
    return;
  }

  if (!isFbqReady()) {
    trackingLog('Meta', 'fbq not loaded yet — skipping init');
    return;
  }

  window.fbq('init', PIXEL_ID);
  trackingLog('Meta', `Pixel initialized: ${PIXEL_ID}`);
}

/**
 * Track a Meta Pixel event with deduplication support.
 *
 * @param eventName - Standard Meta event name (e.g., 'PageView', 'Lead', 'Purchase')
 * @param eventId - Unique ID shared with CAPI for deduplication
 * @param params - Optional event parameters
 */
export function trackMetaEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>
): void {
  if (!PIXEL_ID || !isFbqReady()) {
    trackingLog('Meta', `Pixel not ready — skipping ${eventName}`, { eventId });
    return;
  }

  // fbq('track', eventName, params, { eventID }) — the eventID option enables dedup
  window.fbq('track', eventName, params || {}, { eventID: eventId });
  trackingLog('Meta', `Pixel event: ${eventName}`, { eventId, params });
}

/**
 * Track a PageView event via Meta Pixel.
 */
export function trackMetaPageView(eventId: string): void {
  trackMetaEvent('PageView', eventId);
}

/**
 * Track a Lead event via Meta Pixel.
 * Used when a user submits the order form.
 */
export function trackMetaLead(
  eventId: string,
  customData?: {
    value?: number;
    currency?: string;
    contentName?: string;
  }
): void {
  const params: Record<string, unknown> = {};
  if (customData?.value) params.value = customData.value;
  if (customData?.currency) params.currency = customData.currency;
  if (customData?.contentName) params.content_name = customData.contentName;

  trackMetaEvent('Lead', eventId, params);
}

/**
 * Track a Purchase event via Meta Pixel.
 * Used on the thank-you / confirmation page.
 */
export function trackMetaPurchase(
  eventId: string,
  customData: {
    value: number;
    currency: string;
    contentName?: string;
    contentIds?: string[];
  }
): void {
  const params: Record<string, unknown> = {
    value: customData.value,
    currency: customData.currency,
  };
  if (customData.contentName) params.content_name = customData.contentName;
  if (customData.contentIds) {
    params.content_ids = customData.contentIds;
    params.content_type = 'product';
  }

  trackMetaEvent('Purchase', eventId, params);
}
