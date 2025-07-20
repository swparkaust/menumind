'use client';

import React from 'react';
import { Card, CardContent } from './Card';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="mx-4 my-6">
          <CardContent className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              오류가 발생했습니다
            </h3>
            <p className="text-white/80 mb-4 text-sm">
              앱을 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              새로고침
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;