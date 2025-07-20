'use client';

import { ReactNode } from 'react';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dangerous?: boolean;
  loading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  dangerous = false,
  loading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 glass-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className="relative glass-primary max-w-sm w-full animate-native-fade-in"
        style={{
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--corner-radius-xl)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="text-center mb-6">
          <h3 
            id="dialog-title"
            className="text-xl font-semibold mb-3"
            style={{ 
              color: 'var(--color-label-primary)',
              fontFamily: 'var(--font-system)'
            }}
          >
            {title}
          </h3>
          <p 
            id="dialog-description"
            className="leading-relaxed text-sm"
            style={{ color: 'var(--color-label-secondary)' }}
          >
            {message}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button
            variant={dangerous ? 'destructive' : 'primary'}
            className="w-full"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            aria-describedby={dangerous ? 'destructive-action-warning' : undefined}
          >
            {confirmText}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>
        
        {dangerous && (
          <p 
            id="destructive-action-warning"
            className="sr-only"
          >
            이 작업은 되돌릴 수 없습니다
          </p>
        )}
      </div>
    </div>
  );
}