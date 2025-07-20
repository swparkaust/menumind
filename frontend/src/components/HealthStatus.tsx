'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { ServerIcon, MapPinIcon, DatabaseIcon, CheckIcon, XMarkIcon, LoadingSpinner, InfoIcon } from './ui/Icons';
import { healthChecker } from '@/lib/health-check';

interface HealthStatusProps {
  showDetails?: boolean;
}

export function HealthStatus({ showDetails = false }: HealthStatusProps) {
  const [health, setHealth] = useState({
    api: false,
    location: false,
    storage: false,
    timestamp: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true);
      const status = await healthChecker.checkAll();
      setHealth(status);
      setLoading(false);
    };

    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showDetails && healthChecker.isHealthy()) {
    return null; // Don't show if everything is working
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'var(--color-system-green)' : 'var(--color-system-red)';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckIcon size="xs" color="var(--color-system-green)" />
    ) : (
      <XMarkIcon size="xs" color="var(--color-system-red)" />
    );
  };

  const getServiceIcon = (service: 'api' | 'location' | 'storage') => {
    switch (service) {
      case 'api':
        return <ServerIcon size="sm" color="var(--color-label-secondary)" />;
      case 'location':
        return <MapPinIcon size="sm" color="var(--color-label-secondary)" />;
      case 'storage':
        return <DatabaseIcon size="sm" color="var(--color-label-secondary)" />;
    }
  };

  if (loading) {
    return (
      <Card style={{ borderColor: 'var(--color-system-orange)' }}>
        <CardContent>
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="xs" />
            <p 
              className="text-center text-sm font-medium"
              style={{ color: 'var(--color-system-orange)' }}
            >
              시스템 상태 확인 중...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ 
      borderColor: healthChecker.isHealthy() 
        ? 'var(--color-system-green)' 
        : 'var(--color-system-red)' 
    }}>
      <CardContent>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <InfoIcon size="md" color="var(--color-label-primary)" />
            <h3 
              className="text-sm font-semibold"
              style={{ color: 'var(--color-label-primary)' }}
            >
              시스템 상태
            </h3>
          </div>
          {showDetails ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getServiceIcon('api')}
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--color-label-secondary)' }}
                  >
                    API 서버:
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(health.api)}
                  <span 
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(health.api) }}
                  >
                    {health.api ? '정상' : '오류'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getServiceIcon('location')}
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--color-label-secondary)' }}
                  >
                    위치 서비스:
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(health.location)}
                  <span 
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(health.location) }}
                  >
                    {health.location ? '사용 가능' : '사용 불가'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getServiceIcon('storage')}
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--color-label-secondary)' }}
                  >
                    로컬 저장소:
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(health.storage)}
                  <span 
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(health.storage) }}
                  >
                    {health.storage ? '정상' : '오류'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {healthChecker.isHealthy() ? (
                <CheckIcon size="sm" color="var(--color-system-green)" />
              ) : (
                <XMarkIcon size="sm" color="var(--color-system-red)" />
              )}
              <p 
                className="text-sm font-medium"
                style={{ color: getStatusColor(healthChecker.isHealthy()) }}
              >
                {healthChecker.isHealthy() 
                  ? '모든 서비스가 정상 작동 중입니다' 
                  : '일부 서비스에 문제가 있습니다'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}