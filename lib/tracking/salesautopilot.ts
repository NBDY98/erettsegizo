// ─── SalesAutopilot Tracking Integration Layer ──────────────────────────────
// Bridges the tracking system with SalesAutopilot form submission.
// Since SAPI drops unknown hidden fields, we store tracking data in cookies
// that can be read by the server-side API routes and any future webhook handlers.

import type { TrackingUserData, TrackingCustomData } from './types';
import { getCookie, setCookie, captureFbclid, getFbp, captureTtclid, getTtp, trackingLog } from './helpers';

/**
 * Cookie name for storing the last tracking event ID.
 * This allows the thank-you page (or any callback) to reference
 * the same event_id that was used for the Lead event.
 */
const TRACKING_EVENT_ID_COOKIE = '_trk_event_id';
const TRACKING_LEAD_DATA_COOKIE = '_trk_lead_data';

/**
 * Store the tracking event ID in a cookie so it can be retrieved
 * on the thank-you/callback page for the Purchase event.
 *
 * This is necessary because SAPI does a full-page redirect,
 * so we lose all in-memory state.
 */
export function storeTrackingEventId(eventId: string): void {
  setCookie(TRACKING_EVENT_ID_COOKIE, eventId, 1); // 1 day expiry
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(TRACKING_EVENT_ID_COOKIE, eventId);
    } catch {}
  }
  trackingLog('SAPI', `Stored event_id in cookie/storage: ${eventId}`);
}

/**
 * Retrieve the stored tracking event ID.
 */
export function getStoredTrackingEventId(): string | undefined {
  let eventId = getCookie(TRACKING_EVENT_ID_COOKIE);
  if (!eventId && typeof window !== 'undefined' && window.localStorage) {
    try {
      eventId = window.localStorage.getItem(TRACKING_EVENT_ID_COOKIE) || '';
    } catch {}
  }
  return eventId || undefined;
}

/**
 * Store lead data so the Purchase event can reference it.
 */
export function storeLeadData(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  product: string;
  value: number;
  currency: string;
}): void {
  try {
    const compact = JSON.stringify(data);
    setCookie(TRACKING_LEAD_DATA_COOKIE, compact, 1); // fallback
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(TRACKING_LEAD_DATA_COOKIE, compact);
    }
    trackingLog('SAPI', 'Stored lead data in cookie/storage');
  } catch (error) {
    console.error('[Tracking:SAPI] Failed to store lead data:', error);
  }
}

/**
 * Retrieve stored lead data.
 */
export function getStoredLeadData(): {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  product: string;
  value: number;
  currency: string;
} | undefined {
  try {
    let raw = getCookie(TRACKING_LEAD_DATA_COOKIE);
    if (!raw && typeof window !== 'undefined' && window.localStorage) {
      raw = window.localStorage.getItem(TRACKING_LEAD_DATA_COOKIE) || '';
    }
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Collect all tracking-related cookies and URL parameters
 * into a structured object. Used to build the user_data
 * for server-side API calls.
 */
export function collectTrackingCookies(): {
  fbc: string | undefined;
  fbp: string | undefined;
  ttclid: string | undefined;
  ttp: string | undefined;
} {
  return {
    fbc: captureFbclid(),
    fbp: getFbp(),
    ttclid: captureTtclid(),
    ttp: getTtp(),
  };
}

/**
 * Build the user_data object for server-side tracking calls,
 * combining form data with tracking cookies.
 */
export function buildTrackingUserData(
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    city?: string;
    zip?: string;
    country?: string;
  },
  cookies?: ReturnType<typeof collectTrackingCookies>
): TrackingUserData {
  const trackingCookies = cookies || collectTrackingCookies();

  return {
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    city: formData.city,
    zip: formData.zip,
    country: formData.country,
    fbc: trackingCookies.fbc,
    fbp: trackingCookies.fbp,
    ttclid: trackingCookies.ttclid,
    ttp: trackingCookies.ttp,
  };
}

/**
 * Build the custom_data object for a Lead conversion event.
 */
export function buildLeadCustomData(
  product: string,
  value: number,
  currency: string = 'HUF'
): TrackingCustomData {
  return {
    contentName: product,
    value,
    currency,
    contentType: 'product',
  };
}

/**
 * Build the custom_data object for a Purchase conversion event.
 */
export function buildPurchaseCustomData(
  product: string,
  value: number,
  currency: string = 'HUF',
  contentIds?: string[]
): TrackingCustomData {
  return {
    contentName: product,
    value,
    currency,
    contentIds: contentIds && contentIds.length > 0 ? contentIds : [product],
    contentType: 'product',
  };
}
