import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  animated?: boolean;
  variant?: 'primary' | 'secondary' | 'floating';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, elevated = false, animated = true, variant = 'primary', className = '', ...props }, ref) => {
    const variants = {
      primary: 'glass-primary',
      secondary: 'glass-secondary',
      floating: 'glass-primary floating-layer',
    };

    const baseClasses = `${variants[variant]}`;
    const animatedClasses = animated ? 'animate-native-fade-in' : '';
    const elevatedClasses = elevated ? 'shadow-2xl' : '';

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${animatedClasses} ${elevatedClasses} ${className}`}
        style={{
          borderRadius: 'var(--corner-radius-lg)',
          padding: 'var(--spacing-lg)',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{ marginBottom: 'var(--spacing-lg)' }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{ 
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-md)',
          borderTop: '0.5px solid var(--color-fill-quaternary)'
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';