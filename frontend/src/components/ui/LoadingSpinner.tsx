interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export function LoadingSpinner({ size = 'md', className = '', style }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const strokeWidth = {
    sm: 2,
    md: 2.5,
    lg: 3
  };

  const actualSize = {
    sm: 16,
    md: 32,
    lg: 48
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${className} flex items-center justify-center`}
      style={style}
    >
      <svg
        width={actualSize[size]}
        height={actualSize[size]}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-fill-tertiary)"
          strokeWidth={strokeWidth[size]}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--color-system-blue)"
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}