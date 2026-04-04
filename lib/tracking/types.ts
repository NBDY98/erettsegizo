// ─── Tracking Event Types ───────────────────────────────────────────────────
// Shared type definitions for Meta (Facebook) and TikTok tracking systems.

export type TrackingEventName = 'PageView' | 'Lead' | 'Purchase';

/**
 * TikTok uses different event names than Meta.
 * This maps our internal names to TikTok's expected names.
 */
export const TIKTOK_EVENT_MAP: Record<TrackingEventName, string> = {
  PageView: 'Pageview',
  Lead: 'SubmitForm',
  Purchase: 'CompletePayment',
} as const;

/**
 * User data attached to tracking events.
 * Values should be lowercase, trimmed, and SHA-256 hashed before sending
 * to Meta CAPI or TikTok Events API (server-side).
 * Browser-side pixels handle hashing automatically.
 */
export interface TrackingUserData {
  /** Raw email — will be hashed server-side */
  email?: string;
  /** Raw phone — will be hashed server-side (E.164 format preferred) */
  phone?: string;
  /** Raw first name — will be hashed server-side */
  firstName?: string;
  /** Raw last name — will be hashed server-side */
  lastName?: string;
  /** Raw city — will be hashed server-side */
  city?: string;
  /** Raw zip/postal code — will be hashed server-side */
  zip?: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "hu") — will be hashed server-side */
  country?: string;
  /** External/customer ID */
  externalId?: string;
  /** Client IP address — populated server-side from request headers */
  clientIpAddress?: string;
  /** Client User-Agent — populated server-side from request headers */
  clientUserAgent?: string;
  /** Meta fbc cookie value (fb.1.{timestamp}.{fbclid}) */
  fbc?: string;
  /** Meta fbp cookie value (_fbp from Meta Pixel) */
  fbp?: string;
  /** TikTok ttp cookie value (_ttp from TikTok Pixel) */
  ttp?: string;
  /** TikTok ttclid value */
  ttclid?: string;
}

/**
 * Custom data for conversion events (Lead, Purchase).
 */
export interface TrackingCustomData {
  /** Currency code (e.g., "HUF") */
  currency?: string;
  /** Monetary value of the conversion */
  value?: number;
  /** Product or content name */
  contentName?: string;
  /** Product category */
  contentCategory?: string;
  /** Array of product/content IDs */
  contentIds?: string[];
  /** Content type (e.g., "product") */
  contentType?: string;
}

/**
 * The full event payload sent to server-side API routes.
 */
export interface TrackingEventPayload {
  /** Our internal event name */
  eventName: TrackingEventName;
  /** Unique event ID for deduplication (same ID used browser + server side) */
  eventId: string;
  /** Full URL where the event occurred */
  eventSourceUrl: string;
  /** Unix timestamp in seconds */
  eventTime: number;
  /** User identifying data */
  userData: TrackingUserData;
  /** Conversion-specific data */
  customData?: TrackingCustomData;
}

/**
 * Response from our API route handlers.
 */
export interface TrackingApiResponse {
  success: boolean;
  /** Platform name for debugging */
  platform: 'meta' | 'tiktok';
  /** Event name that was sent */
  eventName: string;
  /** Event ID for cross-referencing */
  eventId: string;
  /** Any error message */
  error?: string;
  /** Raw response from the platform API (in debug mode) */
  debug?: unknown;
}
