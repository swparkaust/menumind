interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = true 
}: SkeletonProps) {
  return (
    <div
      className={`
        ${width} ${height} 
        animate-native-shimmer
        ${rounded ? 'rounded-lg' : ''} 
        ${className}
      `}
      style={{
        borderRadius: rounded ? 'var(--corner-radius-sm)' : '0'
      }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 ? 'w-3/4' : 'w-full'} 
          height="h-4" 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-primary ${className}`} style={{ 
      padding: 'var(--spacing-lg)', 
      borderRadius: 'var(--corner-radius-lg)' 
    }}>
      <div className="space-y-4">
        <div className="text-center space-y-4">
          <Skeleton width="w-3/4" height="h-8" className="mx-auto" />
          <div className="flex gap-2 justify-center">
            <Skeleton width="w-16" height="h-6" style={{ borderRadius: 'var(--corner-radius-xl)' }} />
            <Skeleton width="w-20" height="h-6" style={{ borderRadius: 'var(--corner-radius-xl)' }} />
            <Skeleton width="w-14" height="h-6" style={{ borderRadius: 'var(--corner-radius-xl)' }} />
          </div>
        </div>
        <div style={{ marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
          <SkeletonText lines={3} />
        </div>
        <div className="flex gap-3" style={{ paddingTop: 'var(--spacing-md)', borderTop: '0.5px solid var(--color-fill-quaternary)' }}>
          <Skeleton width="flex-1" height="h-12" style={{ borderRadius: 'var(--corner-radius-md)' }} />
          <Skeleton width="flex-1" height="h-12" style={{ borderRadius: 'var(--corner-radius-md)' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonButton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-12 ${className}`} />;
}

export function SkeletonInsights({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="w-32" height="h-6" />
        <Skeleton width="w-20" height="h-8" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="glass-card p-3">
            <SkeletonText lines={1} />
          </div>
        ))}
      </div>
    </div>
  );
}