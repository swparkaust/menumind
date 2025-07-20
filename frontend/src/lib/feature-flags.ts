interface FeatureFlags {
  enableAnalytics: boolean;
  enableHealthCheck: boolean;
  enableAdvancedInsights: boolean;
  enableBetaFeatures: boolean;
  enableDebugMode: boolean;
  enableAds: boolean;
  cacheTimeoutMs: number;
  maxRetryAttempts: number;
}

const defaultFlags: FeatureFlags = {
  enableAnalytics: true,
  enableHealthCheck: true,
  enableAdvancedInsights: true,
  enableBetaFeatures: false,
  enableDebugMode: process.env.NODE_ENV === 'development',
  enableAds: true,
  cacheTimeoutMs: 5 * 60 * 1000, // 5 minutes
  maxRetryAttempts: 3,
};

class FeatureFlagManager {
  private flags: FeatureFlags;

  constructor() {
    this.flags = { ...defaultFlags };
    this.loadFromEnvironment();
    this.loadFromLocalStorage();
  }

  private loadFromEnvironment() {
    // Override with environment variables
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'false') {
      this.flags.enableAnalytics = false;
    }
    if (process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true') {
      this.flags.enableBetaFeatures = true;
    }
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      this.flags.enableDebugMode = true;
    }
    if (process.env.NEXT_PUBLIC_ENABLE_ADS === 'false') {
      this.flags.enableAds = false;
    }
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('feature_flags');
      if (stored) {
        const parsedFlags = JSON.parse(stored);
        this.flags = { ...this.flags, ...parsedFlags };
      }
    } catch (error) {
    }
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    const value = this.flags[flag];
    return typeof value === 'boolean' ? value : false;
  }

  getValue<K extends keyof FeatureFlags>(flag: K): FeatureFlags[K] {
    return this.flags[flag];
  }

  setFlag<K extends keyof FeatureFlags>(flag: K, value: FeatureFlags[K]) {
    this.flags[flag] = value;
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('feature_flags', JSON.stringify(this.flags));
    } catch (error) {
    }
  }

  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  resetToDefaults() {
    this.flags = { ...defaultFlags };
    this.loadFromEnvironment();
    this.saveToLocalStorage();
  }

  // Development helpers
  enableDebugMode() {
    if (process.env.NODE_ENV === 'development') {
      this.setFlag('enableDebugMode', true);
    }
  }

  // Beta feature management
  enableBetaFeatures() {
    this.setFlag('enableBetaFeatures', true);
  }

  disableBetaFeatures() {
    this.setFlag('enableBetaFeatures', false);
  }
}

export const featureFlags = new FeatureFlagManager();

// Development helper - add to window for easy access
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).featureFlags = featureFlags;
}