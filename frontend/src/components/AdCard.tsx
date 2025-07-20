'use client';

import { AdSenseAd } from './AdSenseAd';
import { featureFlags } from '@/lib/feature-flags';

interface AdCardProps {
  adSlot: string;
  position?: 'between-sections' | 'sidebar' | 'footer';
  className?: string;
}

export function AdCard({ adSlot, position = 'between-sections', className = '' }: AdCardProps) {
  // Don't render if ads are disabled
  if (!featureFlags.isEnabled('enableAds')) {
    return null;
  }

  const baseStyles = {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    borderRadius: 'var(--corner-radius-lg)',
    marginTop: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)',
  };

  const positionStyles = {
    'between-sections': {
      maxWidth: '100%',
      minHeight: '160px',
    },
    'sidebar': {
      maxWidth: '300px',
      minHeight: '250px',
    },
    'footer': {
      maxWidth: '100%',
      minHeight: '120px',
    },
  };

  const containerStyle = {
    ...baseStyles,
    ...positionStyles[position],
  };

  const adFormat = position === 'sidebar' ? 'rectangle' : 'auto';

  return (
    <div
      className={`glass-secondary ${className}`}
      style={containerStyle}
      role="complementary"
      aria-label="후원 광고"
    >
      <div
        style={{
          position: 'absolute',
          top: 'var(--spacing-xs)',
          right: 'var(--spacing-xs)',
          fontSize: '10px',
          color: 'var(--color-label-quaternary)',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 1,
        }}
      >
        AD
      </div>
      
      <AdSenseAd
        adSlot={adSlot}
        adFormat={adFormat}
        style={{
          borderRadius: 'var(--corner-radius-lg)',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
        fullWidthResponsive={position !== 'sidebar'}
      />
    </div>
  );
}