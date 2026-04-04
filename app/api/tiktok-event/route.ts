// ─── TikTok Events API Route Handler ─────────────────────────────────────────
// POST /api/tiktok-event
// Receives tracking events from the browser and forwards them to TikTok Events API.

import { NextRequest, NextResponse } from 'next/server';
import { sendTikTokEvent } from '@/lib/tracking/tiktok-events-api';
import { getUnixTimestamp } from '@/lib/tracking/helpers';
import type { TrackingEventPayload, TrackingApiResponse } from '@/lib/tracking/types';

export async function POST(request: NextRequest): Promise<NextResponse<TrackingApiResponse>> {
  try {
    const body = await request.json();

    const {
      eventName,
      eventId,
      eventSourceUrl,
      userData = {},
      customData,
    } = body;

    // Validate required fields
    if (!eventName || !eventId) {
      return NextResponse.json(
        {
          success: false,
          platform: 'tiktok',
          eventName: eventName || 'unknown',
          eventId: eventId || 'unknown',
          error: 'Missing required fields: eventName, eventId',
        },
        { status: 400 }
      );
    }

    // Extract client IP and User-Agent from request headers (server-side enrichment)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const clientUserAgent = request.headers.get('user-agent') || 'unknown';

    // Build the full payload
    const payload: TrackingEventPayload = {
      eventName,
      eventId,
      eventSourceUrl: eventSourceUrl || request.headers.get('referer') || '',
      eventTime: getUnixTimestamp(),
      userData: {
        ...userData,
        clientIpAddress: clientIp,
        clientUserAgent: clientUserAgent,
      },
      customData,
    };

    console.log(`[API:tiktok-event] Processing ${eventName} (event_id: ${eventId})`);

    // Send to TikTok Events API
    const result = await sendTikTokEvent(payload);

    return NextResponse.json({
      success: true,
      platform: 'tiktok',
      eventName,
      eventId,
      debug: process.env.NODE_ENV === 'development' ? result : undefined,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API:tiktok-event] Error:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        platform: 'tiktok',
        eventName: 'unknown',
        eventId: 'unknown',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
