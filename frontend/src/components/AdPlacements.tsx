'use client';

import { AdCard } from './AdCard';
import { featureFlags } from '@/lib/feature-flags';

interface AdPlacementsProps {
  position: 'primary' | 'secondary';
  className?: string;
}

export function AdPlacements({ position, className = '' }: AdPlacementsProps) {
  // Don't render if ads are disabled
  if (!featureFlags.isEnabled('enableAds')) {
    return null;
  }

  const adSlots = {
    'primary': process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRIMARY || 'demo-primary-ad',
    'secondary': process.env.NEXT_PUBLIC_ADSENSE_SLOT_SECONDARY || 'demo-secondary-ad',
  };

  const adSlot = adSlots[position];
  if (!adSlot) return null;

  return (
    <AdCard
      adSlot={adSlot}
      position={position === 'secondary' ? 'footer' : 'between-sections'}
      className={className}
    />
  );
}