export interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff: boolean;
  retryCondition?: (error: any) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    retryCondition = (error) => {
      // Retry on network errors, 5xx errors, or timeout
      return (
        error.code === 'NETWORK_ERROR' ||
        error.code === 'ECONNABORTED' ||
        (error.response && error.response.status >= 500) ||
        error.message?.includes('timeout')
      );
    }
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !retryCondition(error)) {
        throw error;
      }

      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}