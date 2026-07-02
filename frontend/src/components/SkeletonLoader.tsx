import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'line' | 'table' | 'circle';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = ''
}) => {
  const items = Array.from({ length: count });

  if (type === 'line') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="h-4 bg-slate-300 dark:bg-slate-700 rounded-full w-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className={`rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse ${className}`} />
    );
  }

  if (type === 'table') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-full animate-pulse" />
        {items.map((_, i) => (
          <div key={i} className="h-12 bg-slate-200 dark:bg-slate-800/50 rounded w-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-slate-300/30 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 animate-pulse space-y-4">
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
          <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
};
