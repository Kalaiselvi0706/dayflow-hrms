import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'list' | 'chart';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const renderItem = (idx: number) => {
    switch (variant) {
      case 'table':
        return (
          <div key={idx} className="flex items-center gap-4 py-3 border-b border-[#464554]/10 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-[#282a30]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#282a30] rounded w-1/4" />
              <div className="h-3 bg-[#282a30] rounded w-1/6" />
            </div>
            <div className="w-24 h-6 bg-[#282a30] rounded-full" />
            <div className="w-16 h-4 bg-[#282a30] rounded" />
          </div>
        );
      case 'list':
        return (
          <div key={idx} className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#464554]/15 bg-[#1e1f26]/40 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-[#282a30] shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3 bg-[#282a30] rounded w-3/4" />
              <div className="h-2.5 bg-[#282a30] rounded w-1/2" />
            </div>
            <div className="w-12 h-4 bg-[#282a30] rounded shrink-0" />
          </div>
        );
      case 'chart':
        return (
          <div key={idx} className="h-48 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/20 p-6 flex flex-col justify-end gap-3 animate-pulse">
            <div className="h-4 bg-[#282a30] rounded w-1/3 mb-auto" />
            <div className="flex items-end gap-4 h-24">
              <div className="flex-1 h-[40%] bg-[#282a30] rounded" />
              <div className="flex-1 h-[65%] bg-[#282a30] rounded" />
              <div className="flex-1 h-[90%] bg-[#282a30] rounded" />
              <div className="flex-1 h-[50%] bg-[#282a30] rounded" />
              <div className="flex-1 h-[80%] bg-[#282a30] rounded" />
            </div>
          </div>
        );
      case 'card':
      default:
        return (
          <div key={idx} className="p-5 rounded-3xl bg-[#1e1f26]/70 border border-[#464554]/30 backdrop-blur-md space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-[#282a30] rounded w-1/3" />
              <div className="w-6 h-6 rounded bg-[#282a30]" />
            </div>
            <div className="h-7 bg-[#282a30] rounded w-1/2" />
            <div className="h-2.5 bg-[#282a30] rounded w-2/3" />
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => renderItem(idx))}
    </div>
  );
};
