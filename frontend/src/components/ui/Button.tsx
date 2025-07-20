import { ButtonHTMLAttributes, forwardRef } from 'react';
import { LoadingSpinner } from './Icons';
import { triggerHaptic, triggerWarning } from '@/lib/haptics';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accept' | 'decline' | 'subtle' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  interactive?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    interactive = true,
    className = '', 
    disabled, 
    ...props 
  }, ref) => {
    const getBaseClasses = () => {
      if (variant === 'destructive') {
        return 'glass-destructive flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium';
      }
      return interactive 
        ? 'glass-interactive flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
        : 'glass-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium';
    };

    const baseClasses = getBaseClasses();
    
    const variantStyles = {
      primary: { 
        color: 'var(--color-primary-action)', 
        fontWeight: '600' 
      },
      secondary: { 
        color: 'var(--color-label-secondary)', 
        fontWeight: '500' 
      },
      accept: { 
        color: 'var(--color-success-action)', 
        fontWeight: '600' 
      },
      decline: { 
        color: 'var(--color-system-red)', 
        fontWeight: '600' 
      },
      subtle: { 
        color: 'var(--color-label-tertiary)', 
        fontWeight: '400' 
      },
      destructive: { 
        color: 'var(--color-system-red)', 
        fontWeight: '600'
      },
    };

    const sizes = {
      sm: 'text-sm min-h-[44px]',
      md: 'text-base min-h-[44px]',
      lg: 'text-lg min-h-[50px]',
    };

    const paddingSizes = {
      sm: { paddingLeft: 'var(--spacing-md)', paddingRight: 'var(--spacing-md)' },
      md: { paddingLeft: 'var(--spacing-lg)', paddingRight: 'var(--spacing-lg)' },
      lg: { paddingLeft: 'var(--spacing-xl)', paddingRight: 'var(--spacing-xl)' },
    };

    const sizeClasses = sizes[size];

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        // Use different haptic feedback for destructive actions
        if (variant === 'destructive') {
          triggerWarning();
        } else {
          triggerHaptic('selection');
        }
        if (props.onClick) {
          props.onClick(e);
        }
      }
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClasses} ${className}`}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        role="button"
        style={{
          borderRadius: 'var(--corner-radius-md)',
          transition: 'all 0.2s var(--transition-snappy)',
          ...paddingSizes[size],
          ...variantStyles[variant]
        }}
        {...props}
        onClick={handleClick}
      >
        {loading && <LoadingSpinner size="md" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';