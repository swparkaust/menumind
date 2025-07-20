'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { CheckIcon, XMarkIcon, SparklesIcon } from './ui/Icons';
import { triggerSuccess, triggerWarning } from '@/lib/haptics';
import { MenuRecommendation } from '@/lib/api';
import { MenuOptionsHelper } from '@/lib/menuOptions';

interface RecommendationCardProps {
  recommendation: MenuRecommendation;
  onAccept: () => void;
  onDecline: () => void;
  loading?: boolean;
}

export function RecommendationCard({ 
  recommendation, 
  onAccept, 
  onDecline, 
  loading = false 
}: RecommendationCardProps) {
  const [responding, setResponding] = useState(false);

  const handleAccept = async () => {
    setResponding(true);
    try {
      await onAccept();
      triggerSuccess();
    } finally {
      setResponding(false);
    }
  };

  const handleDecline = async () => {
    setResponding(true);
    try {
      await onDecline();
      triggerWarning();
    } finally {
      setResponding(false);
    }
  };

  const isDisabled = loading || responding || recommendation.accepted || recommendation.declined;

  const labels = MenuOptionsHelper.getLabels(
    recommendation.food_type,
    recommendation.cuisine_type,
    recommendation.situation
  );

  return (
    <Card variant="floating" elevated className="animate-native-fade-in">
      <CardHeader>
        <div className="flex items-center justify-center gap-2 mb-4">
          <SparklesIcon size="xl" color="var(--color-food-accent)" />
          <h2 
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-center"
            style={{ 
              color: 'var(--color-label-primary)',
              fontFamily: 'var(--font-rounded)'
            }}
          >
            {recommendation.menu_name}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:gap-3">
          <span 
            className="px-3 py-1.5 glass-secondary text-xs font-medium rounded-full"
            style={{ 
              borderRadius: 'var(--corner-radius-xl)',
              color: 'var(--color-label-secondary)'
            }}
          >
            {labels.foodType}
          </span>
          <span 
            className="px-3 py-1.5 glass-secondary text-xs font-medium rounded-full"
            style={{ 
              borderRadius: 'var(--corner-radius-xl)',
              color: 'var(--color-label-secondary)'
            }}
          >
            {labels.cuisineType}
          </span>
          <span 
            className="px-3 py-1.5 glass-secondary text-xs font-medium rounded-full"
            style={{ 
              borderRadius: 'var(--corner-radius-xl)',
              color: 'var(--color-label-secondary)'
            }}
          >
            {labels.situation}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p 
          className="text-sm sm:text-base lg:text-lg text-center leading-relaxed font-medium"
          style={{ color: 'var(--color-label-primary)' }}
        >
          {recommendation.description}
        </p>
      </CardContent>
      
      {!recommendation.responded_at ? (
        <CardFooter>
          <div className="flex gap-3 sm:gap-4">
            <Button
              variant="decline"
              size="lg"
              className="flex-1 animate-native-bounce"
              onClick={handleDecline}
              disabled={isDisabled}
              loading={responding}
            >
              <XMarkIcon size="md" />
              거절
            </Button>
            <Button
              variant="accept"
              size="lg"
              className="flex-1 animate-native-bounce"
              onClick={handleAccept}
              disabled={isDisabled}
              loading={responding}
            >
              <CheckIcon size="md" />
              수락
            </Button>
          </div>
        </CardFooter>
      ) : (
        <CardFooter>
          {recommendation.accepted && (
            <div 
              className="text-center text-sm font-semibold py-3 px-4 glass-secondary rounded-lg flex items-center justify-center gap-2"
              style={{ 
                borderRadius: 'var(--corner-radius-md)',
                color: 'var(--color-system-green)'
              }}
            >
              <CheckIcon size="md" color="var(--color-system-green)" />
              수락됨
            </div>
          )}
          
          {recommendation.declined && (
            <div 
              className="text-center text-sm font-semibold py-3 px-4 glass-secondary rounded-lg flex items-center justify-center gap-2"
              style={{ 
                borderRadius: 'var(--corner-radius-md)',
                color: 'var(--color-system-red)'
              }}
            >
              <XMarkIcon size="md" color="var(--color-system-red)" />
              거절됨
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}