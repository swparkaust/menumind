interface HealthStatus {
  api: boolean;
  location: boolean;
  storage: boolean;
  timestamp: number;
}

class HealthChecker {
  private status: HealthStatus = {
    api: false,
    location: false,
    storage: false,
    timestamp: 0,
  };

  async checkAll(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkAPI(),
      this.checkLocation(),
      this.checkStorage(),
    ]);

    this.status = {
      api: checks[0].status === 'fulfilled' ? checks[0].value : false,
      location: checks[1].status === 'fulfilled' ? checks[1].value : false,
      storage: checks[2].status === 'fulfilled' ? checks[2].value : false,
      timestamp: Date.now(),
    };

    return this.status;
  }

  private async checkAPI(): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}/up`, {
        method: 'GET',
        timeout: 5000,
      } as RequestInit);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async checkLocation(): Promise<boolean> {
    if (!navigator.geolocation) return false;
    
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  }

  private async checkStorage(): Promise<boolean> {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return value === 'test';
    } catch {
      return false;
    }
  }

  getLastStatus(): HealthStatus {
    return this.status;
  }

  isHealthy(): boolean {
    return this.status.api && this.status.storage;
  }
}

export const healthChecker = new HealthChecker();