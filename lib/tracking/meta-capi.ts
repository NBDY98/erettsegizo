// ─── Meta Conversions API (CAPI) — Server-Side ──────────────────────────────
// Sends events to Meta's Conversions API for server-side tracking.
// Used by the /api/meta-event route handler.

import type { TrackingEventPayload } from './types';
import { hashForTracking } from './helpers';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const API_VERSION = 'v21.0';
const GRAPH_API_URL = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

interface MetaCapiResponse {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

/**
 * Build the Meta CAPI user_data object with hashed PII fields.
 * Meta requires: lowercase → trim → SHA-256 for all PII fields.
 * Non-PII fields (fbc, fbp, client_ip_address, client_user_agent) are sent as-is.
 */
async function buildUserData(userData: TrackingEventPayload['userData']) {
  const [em, ph, fn, ln, ct, zp, country] = await Promise.all([
    hashForTracking(userData.email),
    hashForTracking(userData.phone),
    hashForTracking(userData.firstName),
    hashForTracking(userData.lastName),
    hashForTracking(userData.city),
    hashForTracking(userData.zip),
    hashForTracking(userData.country),
  ]);

  const result: Record<string, unknown> = {};

  // Hashed PII fields
  if (em) result.em = [em];
  if (ph) result.ph = [ph];
  if (fn) result.fn = fn;
  if (ln) result.ln = ln;
  if (ct) result.ct = ct;
  if (zp) result.zp = zp;
  if (country) result.country = country;

  // Non-hashed fields
  if (userData.externalId) result.external_id = [userData.externalId];
  if (userData.clientIpAddress) result.client_ip_address = userData.clientIpAddress;
  if (userData.clientUserAgent) result.client_user_agent = userData.clientUserAgent;
  if (userData.fbc) result.fbc = userData.fbc;
  if (userData.fbp) result.fbp = userData.fbp;

  return result;
}

/**
 * Build the Meta CAPI custom_data object.
 */
function buildCustomData(customData?: TrackingEventPayload['customData']) {
  if (!customData) return undefined;

  const result: Record<string, unknown> = {};
  if (customData.currency) result.currency = customData.currency;
  if (customData.value !== undefined) result.value = customData.value;
  if (customData.contentName) result.content_name = customData.contentName;
  if (customData.contentCategory) result.content_category = customData.contentCategory;
  if (customData.contentIds) {
    result.content_ids = customData.contentIds;
    result.content_type = customData.contentType || 'product';
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Send an event to Meta Conversions API.
 *
 * @returns The API response including events_received count
 * @throws Error if the API request fails
 */
export async function sendMetaEvent(
  payload: TrackingEventPayload
): Promise<MetaCapiResponse> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('[Tracking:Meta] CAPI not configured — PIXEL_ID or ACCESS_TOKEN missing');
    return { events_received: 0, messages: ['Not configured'] };
  }

  const userData = await buildUserData(payload.userData);
  const customData = buildCustomData(payload.customData);

  const eventData: Record<string, unknown> = {
    event_name: payload.eventName,
    event_time: payload.eventTime,
    event_id: payload.eventId,
    event_source_url: payload.eventSourceUrl,
    action_source: 'website',
    user_data: userData,
  };

  if (customData) {
    eventData.custom_data = customData;
  }

  const body = JSON.stringify({
    data: [eventData],
    access_token: ACCESS_TOKEN,
  });

  console.log(`[Tracking:Meta] CAPI → ${payload.eventName} (event_id: ${payload.eventId})`);

  try {
    const response = await fetch(GRAPH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const result: MetaCapiResponse = await response.json();

    if (!response.ok || result.error) {
      console.error('[Tracking:Meta] CAPI error:', result.error || response.statusText);
      throw new Error(result.error?.message || `HTTP ${response.status}`);
    }

    console.log(`[Tracking:Meta] CAPI ✓ events_received: ${result.events_received}`);
    return result;
  } catch (error) {
    console.error('[Tracking:Meta] CAPI request failed:', error);
    throw error;
  }
}
