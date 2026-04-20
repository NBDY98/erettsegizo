// ─── TikTok Pixel — Browser-Side ─────────────────────────────────────────────
// Wrapper for the ttq object to track events with deduplication support.

import { trackingLog } from './helpers';

// Extend Window to include TikTok Pixel
declare global {
  interface Window {
    TiktokAnalyticsObject: string;
    ttq: {
      load: (pixelId: string) => void;
      page: () => void;
      track: (
        eventName: string,
        params?: Record<string, unknown>,
        options?: { event_id?: string }
      ) => void;
      identify: (params: Record<string, unknown>) => void;
      instances: unknown[];
      _i: unknown[];
    };
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '';

/**
 * Check if TikTok Pixel (ttq) is loaded and ready.
 */
function isTtqReady(): boolean {
  return typeof window !== 'undefined' && typeof window.ttq !== 'undefined' && typeof window.ttq.track === 'function';
}

/**
 * Initialize TikTok Pixel. Called once when the tracking script loads.
 * The actual script tag is injected by TrackingScripts.tsx.
 */
export function initTikTokPixel(): void {
  if (!PIXEL_ID) {
    trackingLog('TikTok', 'Pixel ID not configured — skipping init');
    return;
  }

  if (!isTtqReady()) {
    trackingLog('TikTok', 'ttq not loaded yet — skipping init');
    return;
  }

  window.ttq.load(PIXEL_ID);
  window.ttq.page();
  trackingLog('TikTok', `Pixel initialized: ${PIXEL_ID}`);
}

/**
 * Track a TikTok Pixel event with deduplication support.
 *
 * @param eventName - TikTok event name (e.g., 'Pageview', 'SubmitForm', 'CompletePayment')
 * @param eventId - Unique ID shared with Events API for deduplication
 * @param params - Optional event parameters
 */
export function trackTikTokEvent(
  eventName: string,
  eventId: string,
  params?: Record<string, unknown>,
  retries = 0
): void {
  if (!PIXEL_ID) {
    if (retries === 0) trackingLog('TikTok', `Pixel ID not configured — skipping ${eventName}`);
    return;
  }

  if (!isTtqReady()) {
    if (retries < 30) {
      setTimeout(() => trackTikTokEvent(eventName, eventId, params, retries + 1), 500);
    } else {
      trackingLog('TikTok', `Pixel not ready after 30 retries — skipping ${eventName}`, { eventId });
    }
    return;
  }

  // ttq.track(eventName, params, { event_id }) — the event_id option enables dedup
  window.ttq.track(eventName, params || {}, { event_id: eventId });
  trackingLog('TikTok', `Pixel event: ${eventName}`, { eventId, params });
}

/**
 * Track a PageView event via TikTok Pixel.
 * Note: TikTok Pixel already fires a pageview on init via ttq.page(),
 * but this allows explicit tracking with a dedup event_id.
 */
export function trackTikTokPageView(eventId: string): void {
  trackTikTokEvent('Pageview', eventId);
}

/**
 * Track a Lead/SubmitForm event via TikTok Pixel.
 */
export function trackTikTokLead(eventId: string): void {
  trackTikTokEvent('SubmitForm', eventId);
}

/**
 * Track a Purchase/CompletePayment event via TikTok Pixel.
 */
export function trackTikTokPurchase(
  eventId: string,
  customData?: {
    value?: number;
    currency?: string;
    contentName?: string;
  }
): void {
  const params: Record<string, unknown> = {};
  if (customData?.value !== undefined) params.value = customData.value;
  if (customData?.currency) params.currency = customData.currency;
  if (customData?.contentName) {
    params.content_name = customData.contentName;
    params.content_type = 'product';
    params.contents = [
      {
        content_id: customData.contentName,
        content_name: customData.contentName,
        quantity: 1,
        price: customData.value || 0,
      },
    ];
  }

  trackTikTokEvent('CompletePayment', eventId, params);
}

/**
 * Identify user for TikTok Advanced Matching.
 * TikTok automatically hashes cleartext email/phone before sending.
 */
export function identifyTikTokUser(email?: string, phone?: string): void {
  if (!PIXEL_ID) return;

  if (!isTtqReady()) {
    setTimeout(() => identifyTikTokUser(email, phone), 500);
    return;
  }

  const identifyParams: Record<string, string> = {};
  if (email) identifyParams.email = email.trim().toLowerCase();
  
  if (phone) {
    // Basic phone formatting: remove spaces/dashes. Assuming mostly +36..
    let formattedPhone = phone.trim().replace(/[^\d+]/g, '');
    if (formattedPhone.startsWith('06')) {
        formattedPhone = '+36' + formattedPhone.slice(2);
    }
    identifyParams.phone_number = formattedPhone;
  }

  if (Object.keys(identifyParams).length > 0) {
    window.ttq.identify(identifyParams);
    trackingLog('TikTok', 'Pixel identify', identifyParams);
  }
}
