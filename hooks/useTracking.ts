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
  identifyTikTokUser,
  trackGAPageView,
  trackGALead,
  trackGAPurchase,
  collectTrackingCookies,
  buildTrackingUserData,
  buildLeadCustomData,
  buildPurchaseCustomData,
  storeTrackingEventId,
  storeLeadData,
  trackingLog,
  getCookie,
} from '@/lib/tracking';
import type { TrackingUserData, TrackingCustomData } from '@/lib/tracking';

/**
 * Send an event to our server-side API route.
 * The route handler will enrich it with IP/UA and forward to the platform API.
 */
async function sendServerEvent(
  route: '/api/meta-event' | '/api/tiktok-event' | '/api/google-event',
  eventName: string,
  eventId: string,
  userData: TrackingUserData,
  customData?: TrackingCustomData
): Promise<void> {
  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userData,
        customData,
      }),
    });

    if (!response.ok) {
      let errorDetail = 'Unknown error';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.error || JSON.stringify(errorJson);
      } catch {
        errorDetail = `HTTP ${response.status} ${response.statusText}`;
      }
      
      console.error(`[useTracking] Server event failed (${route}) for ${eventName}:`, errorDetail);
    }
  } catch (error) {
    // Non-blocking — tracking errors should never break the user flow
    console.error(`[useTracking] Server event network/fetch error (${route}):`, error);
  }
}

/**
 * React hook for tracking events across Meta, TikTok and Google Analytics.
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
   * Track a PageView event on all platforms.
   * Fires browser pixel + server-side API for each platform.
   */
  const trackPageView = useCallback(() => {
    if (pageViewFired.current) return;
    pageViewFired.current = true;

    const eventId = generateEventId();
    const cookies = collectTrackingCookies();
    const gaCookie = getCookie('_ga');
    // Extract client ID from _ga cookie (e.g. GA1.1.12345.67890 -> 12345.67890)
    const gaClientId = gaCookie ? gaCookie.split('.').slice(-2).join('.') : undefined;

    trackingLog('General', `PageView (event_id: ${eventId})`);

    // Browser-side pixels
    trackMetaPageView(eventId);
    trackTikTokPageView(eventId);
    trackGAPageView(eventId);

    // Server-side API calls (non-blocking)
    const userData: TrackingUserData = {
      fbc: cookies.fbc,
      fbp: cookies.fbp,
      ttclid: cookies.ttclid,
      ttp: cookies.ttp,
      gaClientId,
    };

    sendServerEvent('/api/meta-event', 'PageView', eventId, userData);
    sendServerEvent('/api/tiktok-event', 'PageView', eventId, userData);
    sendServerEvent('/api/google-event', 'PageView', eventId, userData);
  }, []);

  /**
   * Track a Lead event (form submission).
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
      const gaCookie = getCookie('_ga');
      const gaClientId = gaCookie ? gaCookie.split('.').slice(-2).join('.') : undefined;

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
      identifyTikTokUser(formData.email, formData.phone);
      trackMetaLead(eventId, { value, currency, contentName: product });
      trackTikTokLead(eventId);
      trackGALead(eventId, { value, currency, contentName: product });

      // Build server-side payloads
      const userData = buildTrackingUserData(formData);
      userData.gaClientId = gaClientId;
      const customData = buildLeadCustomData(product, value, currency);

      // Server-side API calls (non-blocking, fire-and-forget)
      sendServerEvent('/api/meta-event', 'Lead', eventId, userData, customData);
      sendServerEvent('/api/tiktok-event', 'Lead', eventId, userData, customData);
      sendServerEvent('/api/google-event', 'Lead', eventId, userData, customData);
    },
    []
  );

  /**
   * Track a Purchase event.
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
      const gaCookie = getCookie('_ga');
      const gaClientId = gaCookie ? gaCookie.split('.').slice(-2).join('.') : undefined;

      trackingLog('General', `Purchase (event_id: ${eventId})`, { product, value });

      // Browser-side pixels
      identifyTikTokUser(formData.email, formData.phone);
      trackMetaPurchase(eventId, { value, currency, contentName: product, contentIds });
      trackTikTokPurchase(eventId, { value, currency, contentName: product });
      trackGAPurchase(eventId, { value, currency, contentName: product, contentIds });

      // Build server-side payloads
      const userData = buildTrackingUserData(formData);
      userData.gaClientId = gaClientId;
      const customData = buildPurchaseCustomData(product, value, currency, contentIds);

      // Server-side API calls
      sendServerEvent('/api/meta-event', 'Purchase', eventId, userData, customData);
      sendServerEvent('/api/tiktok-event', 'Purchase', eventId, userData, customData);
      sendServerEvent('/api/google-event', 'Purchase', eventId, userData, customData);
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
