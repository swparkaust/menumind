'use client';

import { useState, useEffect } from 'react';
import { WifiOffIcon, WifiIcon } from './ui/Icons';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const newStatus = navigator.onLine;
      
      if (!isOnline && newStatus) {
        // Just reconnected
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
      
      setIsOnline(newStatus);
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline]);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm text-white text-center py-3 text-sm animate-native-slide-up`}
      style={{
        background: isOnline 
          ? 'var(--color-system-green)' 
          : 'var(--color-system-red)',
        borderBottom: `1px solid ${isOnline ? 'var(--color-system-green)' : 'var(--color-system-red)'}`
      }}
    >
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <WifiIcon size="md" color="white" />
            <span className="font-medium">인터넷에 다시 연결되었습니다</span>
          </>
        ) : (
          <>
            <WifiOffIcon size="md" color="white" />
            <span className="font-medium">인터넷 연결이 끊어졌습니다</span>
          </>
        )}
      </div>
    </div>
  );
}