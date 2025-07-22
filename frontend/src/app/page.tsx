'use client';

import { useState, useEffect, useRef } from 'react';
import { PersonalizedGreeting, PersonalizedGreetingRef } from '@/components/PersonalizedGreeting';
import { RecommendationCard } from '@/components/RecommendationCard';
import { PreferenceSelector } from '@/components/PreferenceSelector';
import { InsightsDashboard, InsightsDashboardRef } from '@/components/InsightsDashboard';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Button } from '@/components/ui/Button';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { DebugPanel } from '@/components/DebugPanel';
import { HealthStatus } from '@/components/HealthStatus';
import { AdPlacements } from '@/components/AdPlacements';
import { AppIcon, RefreshIcon, TrashIcon } from '@/components/ui/Icons';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { ApiService, MenuRecommendation, MenuOptions } from '@/lib/api';
import { MenuOptionsHelper } from '@/lib/menuOptions';
import { StorageService } from '@/lib/storage';
import { LocationService } from '@/lib/location';
import { analytics, trackRecommendationUsage, trackUserSession } from '@/lib/analytics';
import { useToast } from '@/components/ui/ToastProvider';
import { getErrorMessage } from '@/lib/errorHandler';

export default function Home() {
  const [userUuid, setUserUuid] = useState<string>('');
  const [currentRecommendation, setCurrentRecommendation] = useState<MenuRecommendation | null>(null);
  const [foodType, setFoodType] = useState('all');
  const [cuisineType, setCuisineType] = useState('all');
  const [situation, setSituation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [menuOptions, setMenuOptions] = useState<MenuOptions | null>(null);
  const { showError, showSuccess } = useToast();
  
  const greetingRef = useRef<PersonalizedGreetingRef>(null);
  const insightsRef = useRef<InsightsDashboardRef>(null);

  useEffect(() => {
    initializeUser();
    loadMenuOptions();
    trackUserSession();
    analytics.trackPageView('home');
  }, []);

  const loadMenuOptions = async () => {
    try {
      const options = await ApiService.getMenuOptions('ko');
      setMenuOptions(options);
      MenuOptionsHelper.setOptions(options);
    } catch (error) {
      analytics.trackError('menu_options_load_failed', { error: (error as Error).message });
      const errorInfo = getErrorMessage('menu_options_load', error);
      showError(errorInfo.title, errorInfo.message);
    }
  };

  const initializeUser = async () => {
    try {
      setLoading(true);
      let uuid = StorageService.getUserUuid();

      if (!uuid) {
        const timezone = StorageService.getUserTimezone();
        const { uuid: newUuid } = await ApiService.createUser(timezone);
        uuid = newUuid;
        StorageService.setUserUuid(uuid);

        // Request location permission and update user
        const location = await LocationService.getCurrentLocation();
        if (location) {
          await ApiService.updateUser(uuid, {
            location_lat: location.lat,
            location_lng: location.lng,
          });
        }
      }

      setUserUuid(uuid);
    } catch (error) {
      analytics.trackError('user_initialization_failed', { error: (error as Error).message });
      const errorInfo = getErrorMessage('user_initialization', error);
      showError(errorInfo.title, errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendation = async (): Promise<void> => {
    if (!userUuid) return;

    try {
      setGenerating(true);
      trackRecommendationUsage('request', { foodType, cuisineType, situation });

      const recommendation = await ApiService.createRecommendation(userUuid, {
        food_type: foodType,
        cuisine_type: cuisineType,
        situation: situation,
      });

      setCurrentRecommendation(recommendation);
      trackRecommendationUsage('received', { menuName: recommendation.menu_name });
    } catch (error) {
      analytics.trackError('recommendation_generation_failed', { error: (error as Error).message });
      const errorInfo = getErrorMessage('recommendation_generation', error);
      showError(errorInfo.title, errorInfo.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!currentRecommendation || !userUuid) return;

    try {
      await ApiService.respondToRecommendation(userUuid, currentRecommendation.id, true);
      setCurrentRecommendation(prev => prev ? { ...prev, accepted: true, responded_at: new Date().toISOString() } : null);
      trackRecommendationUsage('accepted', { menuName: currentRecommendation.menu_name });
    } catch (error) {
      analytics.trackError('recommendation_accept_failed', { error: (error as Error).message });
      const errorInfo = getErrorMessage('recommendation_accept', error);
      showError(errorInfo.title, errorInfo.message);
    }
  };

  const handleDecline = async () => {
    if (!currentRecommendation || !userUuid) return;

    try {
      const response = await ApiService.respondToRecommendation(
        userUuid,
        currentRecommendation.id,
        false,
        { food_type: foodType, cuisine_type: cuisineType, situation: situation }
      );

      if (response.recommendation) {
        setCurrentRecommendation(response.recommendation);
      }
    } catch (error) {
      analytics.trackError('recommendation_decline_failed', { error: (error as Error).message });
      const errorInfo = getErrorMessage('recommendation_decline', error);
      showError(errorInfo.title, errorInfo.message);
    }
  };

  const handleRefresh = async () => {
    const promises: Promise<void>[] = [];
    
    if (greetingRef.current) {
      promises.push(greetingRef.current.refresh());
    }
    
    if (insightsRef.current) {
      promises.push(insightsRef.current.refresh());
    }
    
    promises.push(generateRecommendation());
    
    await Promise.all(promises);
  };

  const handleClearData = async () => {
    if (!userUuid) return;

    try {
      setClearing(true);
      await ApiService.deleteUser(userUuid);
      StorageService.clearAll();
      setUserUuid('');
      setCurrentRecommendation(null);
      setShowClearDialog(false);
      await initializeUser();
      showSuccess('데이터 삭제 완료', '모든 데이터가 성공적으로 삭제되었습니다.');
    } catch (error) {
      analytics.trackError('clear_data_failed', { error: (error as Error).message });
      const errorInfo = getErrorMessage('clear_data', error);
      showError(errorInfo.title, errorInfo.message);
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="lg" style={{
            margin: '0 auto',
            marginBottom: 'var(--spacing-md)'
          }} />
          <p style={{ color: 'var(--color-label-secondary)' }}>앱을 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} disabled={loading || generating}>
      <main id="main-content" className="px-4 sm:px-6 lg:px-8" style={{
        minHeight: '100vh',
        paddingTop: 'var(--spacing-lg)',
        paddingBottom: 'max(var(--spacing-lg), env(safe-area-inset-bottom))',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }} role="main" aria-label="MenuMind 메뉴 추천 앱">
        <div
          className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)',
            width: '100%'
          }}
        >
        <header className="text-center animate-native-fade-in" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-xl)' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
              <AppIcon
                size="100%"
                aria-hidden="true"
              />
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              style={{
                color: 'var(--color-label-primary)',
                fontFamily: 'var(--font-rounded)'
              }}
            >
              MenuMind
            </h1>
          </div>
          <p
            className="text-sm sm:text-base lg:text-lg font-medium"
            style={{ color: 'var(--color-label-secondary)' }}
            role="banner"
          >
            AI가 추천하는 개인화된 음식 메뉴
          </p>
        </header>

        {userUuid && (
          <>
            <PWAInstallPrompt />

            <PersonalizedGreeting
              ref={greetingRef}
              userUuid={userUuid}
              foodType={foodType}
              cuisineType={cuisineType}
              situation={situation}
            />

            {menuOptions && (
              <PreferenceSelector
                foodType={foodType}
                cuisineType={cuisineType}
                situation={situation}
                onFoodTypeChange={setFoodType}
                onCuisineTypeChange={setCuisineType}
                onSituationChange={setSituation}
                foodTypes={menuOptions.food_types}
                cuisineTypes={menuOptions.cuisine_types}
                situations={menuOptions.situations}
              />
            )}

            <div className="text-center animate-native-slide-up">
              <Button
                variant="primary"
                size="lg"
                onClick={generateRecommendation}
                loading={generating}
                disabled={generating}
                className="w-full"
                aria-label={generating ? '추천 생성 중' : '음식 추천 받기'}
                aria-describedby="recommendation-description"
              >
                {!generating && <RefreshIcon size="lg" aria-hidden="true" />}
                {generating ? '추천 생성 중...' : '음식 추천받기'}
              </Button>
              <p id="recommendation-description" className="sr-only">
                선택한 음식 유형, 요리 종류, 상황에 맞는 개인화된 메뉴를 추천받습니다
              </p>
            </div>

            {generating ? (
              <SkeletonCard />
            ) : currentRecommendation ? (
              <>
                <RecommendationCard
                  recommendation={currentRecommendation}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
                <AdPlacements position="primary" />
              </>
            ) : null}

            <InsightsDashboard ref={insightsRef} userUuid={userUuid} />

            <div className="text-center" style={{ paddingTop: 'var(--spacing-2xl)' }}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowClearDialog(true)}
				interactive={true}
                aria-label="모든 데이터 삭제 - 이 작업은 되돌릴 수 없습니다"
              >
                <TrashIcon size="sm" aria-hidden="true" />
                모든 데이터 삭제
              </Button>
            </div>
          </>
        )}

        <ConfirmationDialog
          isOpen={showClearDialog}
          onClose={() => setShowClearDialog(false)}
          onConfirm={handleClearData}
          title="데이터 삭제"
          message="모든 추천 기록과 사용자 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          dangerous={true}
          loading={clearing}
        />

        <AdPlacements position="secondary" />
        
        <DebugPanel />
        <HealthStatus />
      </div>
    </main>
  </PullToRefresh>
  );
}
