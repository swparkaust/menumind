'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { RefreshIcon } from './Icons';
import { triggerHaptic } from '@/lib/haptics';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPull = 120,
  disabled = false
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 0) return;
    
    startYRef.current = e.touches[0].clientY;
    setIsPulling(true);
    setHasTriggeredHaptic(false);
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;
    
    currentYRef.current = e.touches[0].clientY;
    const distance = Math.max(0, currentYRef.current - startYRef.current);
    
    if (distance > 0) {
      e.preventDefault();
      const dampedDistance = Math.min(maxPull, distance * 0.5);
      setPullDistance(dampedDistance);
      
      if (dampedDistance >= threshold && !hasTriggeredHaptic) {
        triggerHaptic('light');
        setHasTriggeredHaptic(true);
      }
    }
  }, [isPulling, disabled, isRefreshing, threshold, maxPull, hasTriggeredHaptic]);

  const handleEnd = useCallback(async () => {
    if (!isPulling || disabled || isRefreshing) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      triggerHaptic('medium');
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, disabled, isRefreshing, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMoveWrapper = (e: TouchEvent) => handleTouchMove(e);
    const handleTouchEndWrapper = () => handleEnd();

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
    container.addEventListener('touchend', handleTouchEndWrapper);
    container.addEventListener('touchcancel', handleTouchEndWrapper);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMoveWrapper);
      container.removeEventListener('touchend', handleTouchEndWrapper);
      container.removeEventListener('touchcancel', handleTouchEndWrapper);
    };
  }, [handleTouchStart, handleTouchMove, handleEnd]);

  const indicatorOpacity = Math.min(1, pullDistance / threshold);
  const indicatorScale = 0.8 + (0.2 * Math.min(1, pullDistance / threshold));
  const indicatorRotation = (pullDistance / threshold) * 180;

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${pullDistance - 60}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-background-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: indicatorOpacity,
            transform: `scale(${indicatorScale})`,
            transition: isPulling ? 'none' : 'all 0.3s ease-out',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isRefreshing ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div
              style={{
                transform: `rotate(${indicatorRotation}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <RefreshIcon size="sm" style={{ color: 'var(--color-label-primary)' }} />
            </div>
          )}
        </div>
      </div>
      
      <div
        style={{
          transform: `translateY(${isRefreshing ? 60 : pullDistance}px)`,
          transition: isPulling || isRefreshing ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}