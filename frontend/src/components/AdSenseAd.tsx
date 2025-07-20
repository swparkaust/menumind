'use client';

import { useEffect, useRef, useState } from 'react';
import { featureFlags } from '@/lib/feature-flags';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  adLayout?: string;
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  style = {},
  fullWidthResponsive = true,
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (!featureFlags.isEnabled('enableAds')) {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
    if (!clientId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('AdSense: Client ID not configured');
      }
      return;
    }

    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('AdSense: Failed to load ad', error);
        }
        setAdError(true);
      }
    };

    // Load AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        window.adsbygoogle = window.adsbygoogle || [];
        loadAd();
      };
      
      script.onerror = () => {
        if (process.env.NODE_ENV === 'development') {
          console.error('AdSense: Failed to load script');
        }
        setAdError(true);
      };
      
      document.head.appendChild(script);
    } else {
      loadAd();
    }
  }, [adSlot]);

  // Don't render if ads are disabled
  if (!featureFlags.isEnabled('enableAds')) {
    return null;
  }

  // Don't render if there's an error or no client ID
  if (adError || !process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID) {
    return null;
  }

  const adContainerStyle: React.CSSProperties = {
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <div
      className={`ad-container ${className}`}
      style={adContainerStyle}
      role="complementary"
      aria-label="광고"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          minHeight: '120px',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
      {!adLoaded && (
        <div
          className="ad-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-fill-quaternary)',
            borderRadius: 'var(--corner-radius-md)',
            fontSize: '12px',
            color: 'var(--color-label-tertiary)',
            fontWeight: '500',
          }}
        >
          광고 로딩 중...
        </div>
      )}
    </div>
  );
}