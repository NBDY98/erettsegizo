// ─── TikTok Events API — Server-Side ─────────────────────────────────────────
// Sends events to TikTok's Events API for server-side tracking.
// Used by the /api/tiktok-event route handler.

import type { TrackingEventPayload } from './types';
import { TIKTOK_EVENT_MAP } from './types';
import { hashForTracking } from './helpers';

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '';
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || '';
const EVENTS_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

interface TikTokEventsApiResponse {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * Build the TikTok Events API user object with hashed PII fields.
 * TikTok requires: SHA-256 hex digest for email, phone.
 */
async function buildTikTokUser(userData: TrackingEventPayload['userData']) {
  const [email, phone] = await Promise.all([
    hashForTracking(userData.email),
    hashForTracking(userData.phone),
  ]);

  const user: Record<string, unknown> = {};

  // Hashed PII
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // Non-hashed identification
  if (userData.externalId) user.external_id = userData.externalId;
  if (userData.clientIpAddress) user.ip = userData.clientIpAddress;
  if (userData.clientUserAgent) user.user_agent = userData.clientUserAgent;

  // TikTok click tracking cookies
  if (userData.ttp) user.ttp = userData.ttp;
  if (userData.ttclid) user.ttclid = userData.ttclid;

  return user;
}

/**
 * Build the TikTok Events API properties (custom_data equivalent).
 */
function buildTikTokProperties(customData?: TrackingEventPayload['customData']) {
  if (!customData) return undefined;

  const props: Record<string, unknown> = {};
  if (customData.currency) props.currency = customData.currency;
  if (customData.value !== undefined) props.value = customData.value;
  if (customData.contentName) props.description = customData.contentName;
  if (customData.contentCategory) props.content_category = customData.contentCategory;
  if (customData.contentIds) {
    props.contents = customData.contentIds.map((id) => ({
      content_id: id,
      content_type: customData.contentType || 'product',
    }));
  }

  return Object.keys(props).length > 0 ? props : undefined;
}

/**
 * Send an event to TikTok Events API.
 *
 * @returns The API response
 * @throws Error if the API request fails
 */
export async function sendTikTokEvent(
  payload: TrackingEventPayload
): Promise<TikTokEventsApiResponse> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('[Tracking:TikTok] Events API not configured — PIXEL_ID or ACCESS_TOKEN missing');
    return { code: -1, message: 'Not configured' };
  }

  const user = await buildTikTokUser(payload.userData);
  const properties = buildTikTokProperties(payload.customData);

  // Map our event names to TikTok's expected names
  const tiktokEventName = TIKTOK_EVENT_MAP[payload.eventName] || payload.eventName;

  const eventData: Record<string, unknown> = {
    event: tiktokEventName,
    event_id: payload.eventId,
    event_time: payload.eventTime,
    user,
    page: {
      url: payload.eventSourceUrl,
    },
  };

  if (properties) {
    eventData.properties = properties;
  }

  const body = JSON.stringify({
    pixel_code: PIXEL_ID,
    event: 'track',
    event_id: payload.eventId,
    timestamp: new Date(payload.eventTime * 1000).toISOString(),
    context: {
      user,
      page: {
        url: payload.eventSourceUrl,
      },
      user_agent: payload.userData.clientUserAgent,
      ip: payload.userData.clientIpAddress,
    },
    properties,
    data: [eventData],
  });

  console.log(`[Tracking:TikTok] Events API → ${tiktokEventName} (event_id: ${payload.eventId})`);

  try {
    const response = await fetch(EVENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': ACCESS_TOKEN,
      },
      body,
    });

    const result: TikTokEventsApiResponse = await response.json();

    if (!response.ok || result.code !== 0) {
      console.error('[Tracking:TikTok] Events API error:', result.message);
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log(`[Tracking:TikTok] Events API ✓ ${result.message}`);
    return result;
  } catch (error) {
    console.error('[Tracking:TikTok] Events API request failed:', error);
    throw error;
  }
}
