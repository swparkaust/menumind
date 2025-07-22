import axios, { AxiosError } from 'axios';
import { withRetry, ApiError } from './retry';
import { withCache, createCacheKey, apiCache } from './cache';
import { measureAPICall } from './analytics';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = new ApiError(
      error.message || 'Network error occurred',
      error.response?.status,
      error.code,
      error.response?.data
    );
    
    return Promise.reject(apiError);
  }
);

export interface User {
  uuid: string;
  timezone: string;
  preferences: Record<string, any>;
}

export interface MenuRecommendation {
  id: number;
  menu_name: string;
  description: string;
  food_type: string;
  cuisine_type: string;
  situation: string;
  accepted: boolean;
  declined: boolean;
  recommended_at: string;
  responded_at?: string;
  context?: {
    current_time: string;
    weather: string;
    location: string;
    response_context?: {
      current_time: string;
      weather: string;
      location: string;
    };
  };
}

export interface CreateRecommendationParams {
  food_type?: string;
  cuisine_type?: string;
  situation?: string;
}

export interface MenuOption {
  value: string;
  label: string;
}

export interface MenuOptions {
  food_types: MenuOption[];
  cuisine_types: MenuOption[];
  situations: MenuOption[];
}

export interface CleanupStatus {
  total_users: number;
  inactive_threshold_days: number;
  inactive_since: string;
  users_eligible_for_cleanup: number;
  last_cleanup_at: string | null;
}

export interface CleanupResult {
  inactive_since: string;
  users_found: number;
  users_deleted: number;
}

export class ApiService {
  static async getMenuOptions(lang: string = 'ko'): Promise<MenuOptions> {
    return withRetry(async () => {
      const response = await api.get('/menu_options', { params: { lang } });
      return response.data;
    });
  }

  static async createUser(timezone: string = 'Asia/Seoul'): Promise<{ uuid: string }> {
    return withRetry(async () => {
      const response = await api.post('/users', { timezone });
      return response.data;
    });
  }

  static async getUser(uuid: string): Promise<User> {
    const cacheKey = createCacheKey(`/users/${uuid}`);
    return withCache(cacheKey, () => 
      withRetry(async () => {
        const response = await api.get(`/users/${uuid}`);
        return response.data;
      })
    );
  }

  static async updateUser(uuid: string, data: Partial<User>): Promise<void> {
    const result = await withRetry(async () => {
      await api.patch(`/users/${uuid}`, data);
    });
    
    // Invalidate user cache after update
    apiCache.invalidate(createCacheKey(`/users/${uuid}`));
    
    // If location data changed, invalidate insights cache as it depends on location
    if (data.location_lat !== undefined || data.location_lng !== undefined) {
      apiCache.invalidate(createCacheKey(`/users/${uuid}/recommendations/insights`));
    }
    
    return result;
  }

  static async deleteUser(uuid: string): Promise<void> {
    const result = await withRetry(async () => {
      await api.delete(`/users/${uuid}`);
    });
    
    // Clear all cache for this user
    apiCache.invalidatePattern(`/users/${uuid}`);
    return result;
  }

  static async getRecommendations(userUuid: string): Promise<MenuRecommendation[]> {
    return withRetry(async () => {
      const response = await api.get(`/users/${userUuid}/recommendations`);
      return response.data;
    });
  }

  static async createRecommendation(
    userUuid: string, 
    params: CreateRecommendationParams = {}
  ): Promise<MenuRecommendation> {
    return measureAPICall(
      withRetry(async () => {
        const response = await api.post(`/users/${userUuid}/recommendations`, params);
        return response.data;
      }, { maxAttempts: 2 }),
      'POST /recommendations'
    );
  }

  static async respondToRecommendation(
    userUuid: string, 
    recommendationId: number, 
    accept: boolean,
    params: CreateRecommendationParams = {}
  ): Promise<any> {
    return withRetry(async () => {
      const response = await api.patch(
        `/users/${userUuid}/recommendations/${recommendationId}/respond`, 
        { accept, ...params }
      );
      return response.data;
    }, { maxAttempts: 2 });
  }

  static async getGreeting(
    userUuid: string, 
    params: CreateRecommendationParams = {}
  ): Promise<{ greeting: string }> {
    return withRetry(async () => {
      const response = await api.get(`/users/${userUuid}/recommendations/greeting`, {
        params
      });
      return response.data;
    }, { maxAttempts: 2 });
  }

  static async getInsights(userUuid: string): Promise<{ insights: string[] }> {
    const cacheKey = createCacheKey(`/users/${userUuid}/recommendations/insights`);
    return withCache(cacheKey, () =>
      withRetry(async () => {
        const response = await api.get(`/users/${userUuid}/recommendations/insights`);
        return response.data;
      }),
      2 * 60 * 1000 // Cache insights for 2 minutes
    );
  }

  static async verifyAdmin(userUuid: string): Promise<{ is_admin: boolean; uuid: string }> {
    return withRetry(async () => {
      const response = await api.get(`/admin/${userUuid}/verify`);
      return response.data;
    });
  }

  static async getCleanupStatus(userUuid: string): Promise<CleanupStatus> {
    return withRetry(async () => {
      const response = await api.get(`/admin/${userUuid}/cleanup_status`);
      return response.data;
    });
  }

  static async runCleanup(userUuid: string): Promise<CleanupResult> {
    return withRetry(async () => {
      const response = await api.post(`/admin/${userUuid}/cleanup_run`);
      return response.data;
    }, { maxAttempts: 1 });
  }
}