// ─── Google Analytics (GA4) — Browser-Side ────────────────────────────────────
// Wrapper for the gtag() function to track events.

import { trackingLog } from './helpers';

// Extend Window to include gtag and dataLayer
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Check if Google Analytics (gtag) is loaded and ready.
 */
function isGtagReady(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Initialize Google Analytics. Called once when the tracking script loads.
 * The actual script tag is injected by TrackingScripts.tsx.
 */
export function initGAPixel(): void {
  if (!MEASUREMENT_ID) {
    trackingLog('GA4', 'Measurement ID not configured — skipping init');
    return;
  }

  if (!isGtagReady()) {
    trackingLog('GA4', 'gtag not loaded yet — skipping init');
    return;
  }

  // GA4 auto-initializes if the script is loaded with the ID, 
  // but we can manually set config if needed.
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false, // We handle PageView manually in useTracking
  });
  trackingLog('GA4', `Pixel initialized: ${MEASUREMENT_ID}`);
}

/**
 * Track a Google Analytics event.
 *
 * @param eventName - GA4 event name (e.g., 'page_view', 'generate_lead', 'purchase')
 * @param params - Optional event parameters
 */
export function trackGAEvent(
  eventName: string,
  params?: Record<string, unknown>,
  retries = 0
): void {
  if (!MEASUREMENT_ID) {
    if (retries === 0) trackingLog('GA4', `Measurement ID not configured — skipping ${eventName}`);
    return;
  }

  if (!isGtagReady()) {
    if (retries < 10) {
      setTimeout(() => trackGAEvent(eventName, params, retries + 1), 500);
    } else {
      trackingLog('GA4', `Pixel not ready after 10 retries — skipping ${eventName}`);
    }
    return;
  }

  window.gtag('event', eventName, params || {});
  trackingLog('GA4', `Pixel event: ${eventName}`, { params });
}

/**
 * Track a PageView event via GA4.
 */
export function trackGAPageView(eventId: string): void {
  trackGAEvent('page_view', {
    event_id: eventId, // For deduplication if using MP
    page_location: window.location.href,
    page_title: document.title,
  });
}

/**
 * Track a Lead event via GA4.
 * Standard GA4 event name: 'generate_lead'
 */
export function trackGALead(
  eventId: string,
  customData?: {
    value?: number;
    currency?: string;
    contentName?: string;
  }
): void {
  trackGAEvent('generate_lead', {
    event_id: eventId,
    value: customData?.value,
    currency: customData?.currency || 'HUF',
    content_name: customData?.contentName,
  });
}

/**
 * Track a Purchase event via GA4.
 * Standard GA4 event name: 'purchase'
 */
export function trackGAPurchase(
  eventId: string,
  customData: {
    value: number;
    currency: string;
    contentName?: string;
    contentIds?: string[];
  }
): void {
  trackGAEvent('purchase', {
    event_id: eventId,
    transaction_id: eventId, // GA4 uses transaction_id for purchase deduplication
    value: customData.value,
    currency: customData.currency,
    items: [
      {
        item_id: customData.contentIds?.[0] || 'default_product',
        item_name: customData.contentName || 'Product',
        price: customData.value,
        quantity: 1,
      },
    ],
  });
}
