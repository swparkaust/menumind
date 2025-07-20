import { ApiError } from './retry';

export interface ErrorInfo {
  title: string;
  message?: string;
  canRetry?: boolean;
}

export function parseApiError(error: any): ErrorInfo {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 404:
        return {
          title: '데이터를 찾을 수 없습니다',
          message: '요청한 정보를 찾을 수 없습니다. 페이지를 새로고침해 주세요.',
          canRetry: true,
        };
      case 401:
        return {
          title: '인증 오류',
          message: '로그인이 필요합니다. 페이지를 새로고침해 주세요.',
          canRetry: false,
        };
      case 403:
        return {
          title: '접근 권한 없음',
          message: '이 작업을 수행할 권한이 없습니다.',
          canRetry: false,
        };
      case 429:
        return {
          title: '요청 제한 초과',
          message: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해 주세요.',
          canRetry: true,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          title: '서버 오류',
          message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          canRetry: true,
        };
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          return {
            title: '네트워크 오류',
            message: '인터넷 연결을 확인하고 다시 시도해 주세요.',
            canRetry: true,
          };
        }
        if (error.message?.includes('timeout')) {
          return {
            title: '연결 시간 초과',
            message: '응답 시간이 너무 오래 걸렸습니다. 다시 시도해 주세요.',
            canRetry: true,
          };
        }
        return {
          title: '알 수 없는 오류',
          message: error.message || '예상치 못한 오류가 발생했습니다.',
          canRetry: true,
        };
    }
  }

  return {
    title: '오류 발생',
    message: error?.message || '알 수 없는 오류가 발생했습니다.',
    canRetry: true,
  };
}

export function getErrorMessage(context: string, error: any): ErrorInfo {
  const baseError = parseApiError(error);
  
  const contextMessages: Record<string, string> = {
    'menu_options_load': '메뉴 옵션을 불러오는 중 오류가 발생했습니다',
    'user_initialization': '사용자 초기화 중 오류가 발생했습니다',
    'recommendation_generation': '추천을 생성하는 중 오류가 발생했습니다',
    'recommendation_accept': '추천을 수락하는 중 오류가 발생했습니다',
    'recommendation_decline': '새로운 추천을 생성하는 중 오류가 발생했습니다',
    'clear_data': '데이터를 삭제하는 중 오류가 발생했습니다',
    'greeting_fetch': '인사말을 불러오는 중 오류가 발생했습니다',
    'insights_fetch': '인사이트를 불러오는 중 오류가 발생했습니다',
  };

  const contextTitle = contextMessages[context];
  if (contextTitle) {
    return {
      ...baseError,
      title: contextTitle,
    };
  }

  return baseError;
}