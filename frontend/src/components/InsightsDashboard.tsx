'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { SkeletonInsights } from './ui/Skeleton';
import { LightbulbIcon } from './ui/Icons';
import { ApiService } from '@/lib/api';

interface InsightsDashboardProps {
  userUuid: string;
}

export function InsightsDashboard({ userUuid }: InsightsDashboardProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getInsights(userUuid);
        setInsights(response.insights);
      } catch {
        setInsights(['아직 충분한 데이터가 없습니다. 더 많은 추천을 시도해보세요!']);
      } finally {
        setLoading(false);
      }
    };

    if (userUuid) {
      fetchInsights();
    }
  }, [userUuid]);

  if (loading) {
    return <SkeletonInsights />;
  }

  const displayedInsights = showAll ? insights : insights.slice(0, 2);

  return (
    <Card className="animate-native-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LightbulbIcon size="lg" color="var(--color-system-orange)" />
            <h3 
              className="text-lg font-semibold"
              style={{ color: 'var(--color-label-primary)' }}
            >
              개인화 인사이트
            </h3>
          </div>
          {insights.length > 2 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? '간단히 보기' : '전체 보기'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {displayedInsights.map((insight, index) => (
            <div
              key={index}
              className="glass-secondary rounded-xl"
              style={{ 
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--corner-radius-md)' 
              }}
            >
              <p 
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--color-label-secondary)' }}
              >
                • {insight}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}