// ─── useTracking Hook ────────────────────────────────────────────────────────
// Client-side React hook that orchestrates browser + server-side tracking.
// Fires events through both the Pixel (browser) and API route (server),
// using the same event_id for deduplication.

'use client';

import { useCallback, useRef } from 'react';
import {
  generateEventId,
  trackMetaPageView,
  trackMetaLead,
  trackMetaPurchase,
  trackTikTokPageView,
  trackTikTokLead,
  trackTikTokPurchase,
  collectTrackingCookies,
  buildTrackingUserData,
  buildLeadCustomData,
  buildPurchaseCustomData,
  storeTrackingEventId,
  storeLeadData,
  trackingLog,
} from '@/lib/tracking';
import type { TrackingUserData, TrackingCustomData } from '@/lib/tracking';

/**
 * Send an event to our server-side API route.
 * The route handler will enrich it with IP/UA and forward to the platform API.
 */
async function sendServerEvent(
  route: '/api/meta-event' | '/api/tiktok-event',
  eventName: string,
  eventId: string,
  userData: TrackingUserData,
  customData?: TrackingCustomData
): Promise<void> {
  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userData,
        customData,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error(`[useTracking] Server event failed (${route}):`, error);
    }
  } catch (error) {
    // Non-blocking — tracking errors should never break the user flow
    console.error(`[useTracking] Server event error (${route}):`, error);
  }
}

/**
 * React hook for tracking events across Meta and TikTok platforms.
 *
 * Usage:
 * ```tsx
 * const { trackPageView, trackLead, trackPurchase } = useTracking();
 *
 * // On form submit:
 * trackLead(
 *   { email, firstName, lastName, phone, city, zip, country: 'hu' },
 *   { contentName: 'Történelem kurzus', value: 14900, currency: 'HUF' }
 * );
 * ```
 */
export function useTracking() {
  // Prevent duplicate PageView fires on React strict mode double-mount
  const pageViewFired = useRef(false);

  /**
   * Track a PageView event on both platforms.
   * Fires browser pixel + server-side API for each platform.
   */
  const trackPageView = useCallback(() => {
    if (pageViewFired.current) return;
    pageViewFired.current = true;

    const eventId = generateEventId();
    const cookies = collectTrackingCookies();

    trackingLog('General', `PageView (event_id: ${eventId})`);

    // Browser-side pixels
    trackMetaPageView(eventId);
    trackTikTokPageView(eventId);

    // Server-side API calls (non-blocking)
    const userData: TrackingUserData = {
      fbc: cookies.fbc,
      fbp: cookies.fbp,
      ttclid: cookies.ttclid,
      ttp: cookies.ttp,
    };

    sendServerEvent('/api/meta-event', 'PageView', eventId, userData);
    sendServerEvent('/api/tiktok-event', 'PageView', eventId, userData);
  }, []);

  /**
   * Track a Lead event (form submission) on both platforms.
   * This should be called BEFORE the SalesAutopilot form submit.
   *
   * @param formData - User form data for PII matching
   * @param product - Product name (e.g., "Történelem", "Magyar", "Kombo")
   * @param value - Price value in HUF
   */
  const trackLead = useCallback(
    (
      formData: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        city?: string;
        zip?: string;
        country?: string;
      },
      product: string,
      value: number,
      currency: string = 'HUF'
    ) => {
      const eventId = generateEventId();

      trackingLog('General', `Lead (event_id: ${eventId})`, { product, value });

      // Store for Purchase event on thank-you page
      storeTrackingEventId(eventId);
      storeLeadData({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        product,
        value,
        currency,
      });

      // Browser-side pixels
      trackMetaLead(eventId, {
        value,
        currency,
        contentName: product,
      });
      trackTikTokLead(eventId);

      // Build server-side payloads
      const userData = buildTrackingUserData(formData);
      const customData = buildLeadCustomData(product, value, currency);

      // Server-side API calls (non-blocking, fire-and-forget)
      sendServerEvent('/api/meta-event', 'Lead', eventId, userData, customData);
      sendServerEvent('/api/tiktok-event', 'Lead', eventId, userData, customData);
    },
    []
  );

  /**
   * Track a Purchase event on both platforms.
   * This should be called on the thank-you / confirmation page.
   *
   * @param formData - User data (can be read from stored cookies)
   * @param product - Product name
   * @param value - Purchase value in HUF
   * @param contentIds - Optional product IDs
   */
  const trackPurchase = useCallback(
    (
      formData: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        city?: string;
        zip?: string;
        country?: string;
      },
      product: string,
      value: number,
      currency: string = 'HUF',
      contentIds?: string[]
    ) => {
      const eventId = generateEventId();

      trackingLog('General', `Purchase (event_id: ${eventId})`, { product, value });

      // Browser-side pixels
      trackMetaPurchase(eventId, {
        value,
        currency,
        contentName: product,
        contentIds,
      });
      trackTikTokPurchase(eventId, {
        value,
        currency,
        contentName: product,
      });

      // Build server-side payloads
      const userData = buildTrackingUserData(formData);
      const customData = buildPurchaseCustomData(product, value, currency, contentIds);

      // Server-side API calls
      sendServerEvent('/api/meta-event', 'Purchase', eventId, userData, customData);
      sendServerEvent('/api/tiktok-event', 'Purchase', eventId, userData, customData);
    },
    []
  );

  return {
    trackPageView,
    trackLead,
    trackPurchase,
    /** Utility: get current tracking cookies for external use */
    getTrackingCookies: collectTrackingCookies,
    /** Utility: generate a new event ID */
    generateEventId,
  };
}
