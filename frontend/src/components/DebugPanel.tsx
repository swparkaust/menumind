'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { featureFlags } from '@/lib/feature-flags';
import { analytics } from '@/lib/analytics';
import { apiCache } from '@/lib/cache';
import { healthChecker } from '@/lib/health-check';
import { StorageService } from '@/lib/storage';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [flags, setFlags] = useState(featureFlags.getAllFlags());
  const [events, setEvents] = useState(analytics.getEvents());
  const [cacheSize, setCacheSize] = useState(apiCache.size());

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(analytics.getEvents());
      setCacheSize(apiCache.size());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' && !featureFlags.isEnabled('enableDebugMode')) {
    return null;
  }

  const refreshFlags = () => {
    setFlags(featureFlags.getAllFlags());
  };

  const toggleFlag = (flagName: keyof typeof flags) => {
    const currentValue = flags[flagName];
    if (typeof currentValue === 'boolean') {
      featureFlags.setFlag(flagName, !currentValue);
      refreshFlags();
    }
  };

  const clearCache = () => {
    apiCache.clear();
    setCacheSize(0);
  };

  const clearAnalytics = () => {
    analytics.clearEvents();
    setEvents([]);
  };

  const clearAllData = () => {
    StorageService.clearAll();
    clearCache();
    clearAnalytics();
    window.location.reload();
  };

  const exportData = () => {
    const data = {
      flags: flags,
      events: events,
      cacheSize: cacheSize,
      userUuid: StorageService.getUserUuid(),
      preferences: StorageService.getPreferences(),
      health: healthChecker.getLastStatus(),
      timestamp: Date.now(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="opacity-70 hover:opacity-100"
        >
          🔧 Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 overflow-y-auto">
      <div className="glass-overlay fixed inset-0" onClick={() => setIsOpen(false)} />
      <Card className="relative max-w-4xl mx-auto max-h-full overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-label-primary)' }}>Developer Debug Panel</h2>
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Feature Flags */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-label-primary)' }}>Feature Flags</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(flags).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <span className="text-sm" style={{ color: 'var(--color-label-secondary)' }}>{key}:</span>
                  {typeof value === 'boolean' ? (
                    <Button
                      variant={value ? 'accept' : 'decline'}
                      size="sm"
                      onClick={() => toggleFlag(key as keyof typeof flags)}
                    >
                      {value ? 'ON' : 'OFF'}
                    </Button>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--color-label-primary)' }}>{String(value)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Analytics */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-label-primary)' }}>Analytics ({events.length} events)</h3>
              <Button variant="secondary" size="sm" onClick={clearAnalytics}>
                Clear
              </Button>
            </div>
            <div className="bg-white/5 rounded p-3 max-h-40 overflow-y-auto">
              {events.slice(-10).map((event, index) => (
                <div key={index} className="text-xs mb-1" style={{ color: 'var(--color-label-tertiary)' }}>
                  <span style={{ color: 'var(--color-system-blue)' }}>{event.name}</span>
                  {event.properties && (
                    <span className="ml-2" style={{ color: 'var(--color-label-quaternary)' }}>
                      {JSON.stringify(event.properties)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cache Info */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-label-primary)' }}>Cache ({cacheSize} items)</h3>
              <Button variant="secondary" size="sm" onClick={clearCache}>
                Clear Cache
              </Button>
            </div>
          </div>

          {/* Storage Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-label-primary)' }}>Local Storage</h3>
            <div className="bg-white/5 rounded p-3 text-xs" style={{ color: 'var(--color-label-tertiary)' }}>
              <div>User UUID: {StorageService.getUserUuid() || 'Not set'}</div>
              <div>Timezone: {StorageService.getUserTimezone()}</div>
              <div>Language: {StorageService.getSystemLanguage()}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/20">
            <Button variant="primary" onClick={exportData}>
              Export Debug Data
            </Button>
            <Button variant="secondary" onClick={() => healthChecker.checkAll()}>
              Health Check
            </Button>
            <Button variant="decline" onClick={clearAllData}>
              Clear All Data
            </Button>
          </div>

          {/* API Test */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-label-primary)' }}>Quick API Test</h3>
            <Button
              variant="primary"
              onClick={async () => {
                const startTime = performance.now();
                try {
                  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
                  const healthUrl = baseUrl.replace('/api/v1', '') + '/up';
                  const response = await fetch(healthUrl);
                  const duration = performance.now() - startTime;
                  analytics.track('debug_api_test', { 
                    success: response.ok, 
                    duration,
                    status: response.status 
                  });
                  alert(`API Test: ${response.ok ? 'Success' : 'Failed'} (${duration.toFixed(2)}ms)`);
                } catch (error) {
                  analytics.track('debug_api_test', { success: false, error: error.message });
                  alert(`API Test Failed: ${error.message}`);
                }
              }}
            >
              Test API Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}