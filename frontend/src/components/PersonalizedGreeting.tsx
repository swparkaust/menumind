'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { SkeletonText } from './ui/Skeleton';
import { SparklesIcon } from './ui/Icons';
import { ApiService } from '@/lib/api';

interface PersonalizedGreetingProps {
  userUuid: string;
  foodType: string;
  cuisineType: string;
  situation: string;
}

export function PersonalizedGreeting({ 
  userUuid, 
  foodType, 
  cuisineType, 
  situation 
}: PersonalizedGreetingProps) {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getGreeting(userUuid, {
          food_type: foodType,
          cuisine_type: cuisineType,
          situation: situation,
        });
        setGreeting(response.greeting);
      } catch {
        setGreeting('안녕하세요! 오늘은 어떤 음식을 드시고 싶으신가요?');
      } finally {
        setLoading(false);
      }
    };

    if (userUuid) {
      fetchGreeting();
    }
  }, [userUuid, foodType, cuisineType, situation]);

  return (
    <Card className="animate-native-fade-in">
      <CardContent>
        {loading ? (
          <div className="py-2">
            <SkeletonText lines={2} />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <SparklesIcon size="lg" color="var(--color-system-orange)" />
            <p 
              className="text-base sm:text-lg lg:text-xl font-semibold text-center"
              style={{ color: 'var(--color-label-primary)' }}
            >
              {greeting}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}