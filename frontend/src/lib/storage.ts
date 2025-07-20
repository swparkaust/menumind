export class StorageService {
  private static readonly USER_UUID_KEY = 'food_menu_user_uuid';
  private static readonly PREFERENCES_KEY = 'food_menu_preferences';

  static getUserUuid(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.USER_UUID_KEY);
  }

  static setUserUuid(uuid: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_UUID_KEY, uuid);
  }

  static removeUserUuid(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_UUID_KEY);
  }

  static getPreferences(): any {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(this.PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  static setPreferences(preferences: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_UUID_KEY);
    localStorage.removeItem(this.PREFERENCES_KEY);
  }

  static getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  static getSystemLanguage(): string {
    if (typeof window === 'undefined') return 'ko';
    return navigator.language.startsWith('ko') ? 'ko' : 'ko';
  }
}