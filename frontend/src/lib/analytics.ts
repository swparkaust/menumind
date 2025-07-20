interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

class SimpleAnalytics {
  private events: AnalyticsEvent[] = [];
  private readonly maxEvents = 100;

  track(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Keep only the latest events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }

  // Track user journey
  trackPageView(page: string) {
    this.track('page_view', { page });
  }

  trackUserAction(action: string, context?: Record<string, any>) {
    this.track('user_action', { action, ...context });
  }

  trackAPICall(endpoint: string, duration: number, success: boolean) {
    this.track('api_call', { endpoint, duration, success });
  }

  trackError(error: string, context?: Record<string, any>) {
    this.track('error', { error, ...context });
  }

  // Performance metrics
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance', { metric, value, unit });
  }
}

export const analytics = new SimpleAnalytics();

// Performance monitoring
export function measureAPICall<T>(
  promise: Promise<T>,
  endpoint: string
): Promise<T> {
  const startTime = performance.now();
  
  return promise
    .then((result) => {
      const duration = performance.now() - startTime;
      analytics.trackAPICall(endpoint, duration, true);
      return result;
    })
    .catch((error) => {
      const duration = performance.now() - startTime;
      analytics.trackAPICall(endpoint, duration, false);
      analytics.trackError(error.message, { endpoint });
      throw error;
    });
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => analytics.trackPerformance('CLS', metric.value));
    getFID((metric) => analytics.trackPerformance('FID', metric.value));
    getFCP((metric) => analytics.trackPerformance('FCP', metric.value));
    getLCP((metric) => analytics.trackPerformance('LCP', metric.value));
    getTTFB((metric) => analytics.trackPerformance('TTFB', metric.value));
  }).catch(() => {
    // web-vitals not available, skip tracking
  });
}

// User session tracking
export function trackUserSession() {
  if (typeof window === 'undefined') return;

  // Track session start
  analytics.track('session_start', {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  });

  // Track session end on page unload
  window.addEventListener('beforeunload', () => {
    analytics.track('session_end', {
      duration: performance.now(),
    });
  });
}

// Usage analytics for food recommendations
export function trackRecommendationUsage(action: string, data?: Record<string, any>) {
  analytics.trackUserAction(`recommendation_${action}`, data);
}

export function trackPreferenceChange(type: string, value: string) {
  analytics.trackUserAction('preference_change', { type, value });
}

export function trackAIInteraction(type: 'greeting' | 'recommendation' | 'insights', duration?: number) {
  analytics.trackUserAction('ai_interaction', { type, duration });
}