'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { HomeIcon, PhoneIcon } from './ui/Icons';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Card style={{ borderColor: 'var(--color-food-accent)' }}>
      <CardContent>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HomeIcon size="lg" color="var(--color-food-accent)" />
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-label-primary)' }}
            >
              홈 화면에 추가
            </h3>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PhoneIcon size="sm" color="var(--color-label-secondary)" />
            <p 
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-label-secondary)' }}
            >
              더 빠른 접근을 위해 홈 화면에 MenuMind를 설치하세요
            </p>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDismiss}
              className="flex-1"
            >
              나중에
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstall}
              className="flex-1"
            >
              설치
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}