'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, WarningIcon, CheckIcon, InfoIcon } from './Icons';

export interface ToastProps {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <WarningIcon size="lg" color="var(--color-system-red)" />;
      case 'success':
        return <CheckIcon size="lg" color="var(--color-system-green)" />;
      case 'warning':
        return <WarningIcon size="lg" color="var(--color-system-orange)" />;
      case 'info':
        return <InfoIcon size="lg" color="var(--color-system-blue)" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'error':
        return 'rgba(255, 59, 48, 0.1)';
      case 'success':
        return 'rgba(52, 199, 89, 0.1)';
      case 'warning':
        return 'rgba(255, 149, 0, 0.1)';
      case 'info':
        return 'rgba(0, 122, 255, 0.1)';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return 'rgba(255, 59, 48, 0.2)';
      case 'success':
        return 'rgba(52, 199, 89, 0.2)';
      case 'warning':
        return 'rgba(255, 149, 0, 0.2)';
      case 'info':
        return 'rgba(0, 122, 255, 0.2)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--spacing-lg)',
        right: 'var(--spacing-md)',
        left: 'var(--spacing-md)',
        zIndex: 1000,
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: getBackgroundColor(),
        border: `1px solid ${getBorderColor()}`,
        borderRadius: 'var(--corner-radius-md)',
        padding: 'var(--spacing-md)',
        backdropFilter: 'blur(var(--glass-blur-light))',
        WebkitBackdropFilter: 'blur(var(--glass-blur-light))',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        transform: isVisible && !isLeaving ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
        transition: 'all 0.3s var(--transition-spring)',
      }}
      role="alert"
      aria-live="polite"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
        {getIcon()}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-label-primary)',
              marginBottom: message ? 'var(--spacing-xs)' : 0,
            }}
          >
            {title}
          </h4>
          {message && (
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'var(--color-label-secondary)',
                lineHeight: 1.4,
              }}
            >
              {message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-xs)',
            borderRadius: 'var(--corner-radius-sm)',
            color: 'var(--color-label-tertiary)',
            transition: 'color 0.2s var(--transition-smooth)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-label-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-label-tertiary)';
          }}
          aria-label="Close notification"
        >
          <XMarkIcon size="sm" />
        </button>
      </div>
    </div>
  );
}