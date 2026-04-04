// ─── Tracking Scripts Component ──────────────────────────────────────────────
// Injects Meta Pixel and TikTok Pixel scripts into the page.
// Also handles: PageView tracking, fbclid/ttclid capture from URL.

'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useTracking } from '@/hooks/useTracking';
import { captureFbclid, captureTtclid } from '@/lib/tracking';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '';

export default function TrackingScripts() {
  const { trackPageView } = useTracking();

  useEffect(() => {
    // Capture click IDs from URL on first load
    captureFbclid();
    captureTtclid();

    // Fire PageView after pixels have had time to initialize
    // Small delay ensures fbq/ttq are ready
    const timer = setTimeout(() => {
      trackPageView();
    }, 500);

    return () => clearTimeout(timer);
  }, [trackPageView]);

  return (
    <>
      {/* ═══ Meta (Facebook) Pixel Base Code ═══ */}
      {META_PIXEL_ID && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ═══ TikTok Pixel Base Code ═══ */}
      {TIKTOK_PIXEL_ID && (
        <>
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t._i.push([e,arguments])}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq._i=[];ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i.push([e,[],o]),ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
                  ttq.load('${TIKTOK_PIXEL_ID}');
                  ttq.page();
                }(window, document, 'ttq');
              `,
            }}
          />
        </>
      )}

      {/* ═══ Debug Indicator (dev only) ═══ */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: 8,
            left: 8,
            background: 'rgba(0,0,0,0.7)',
            color: '#0f0',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 10,
            fontFamily: 'monospace',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        >
          🔍 Tracking: {META_PIXEL_ID ? '✓ Meta' : '✗ Meta'} |{' '}
          {TIKTOK_PIXEL_ID ? '✓ TikTok' : '✗ TikTok'}
        </div>
      )}
    </>
  );
}
