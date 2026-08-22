import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An unexpected system telemetry exception occurred.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-[#1e1f26]/50 border border-rose-500/20 backdrop-blur-xl ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30 mb-4 shadow-sm">
        <span className="material-symbols-outlined text-2xl">error</span>
      </div>
      <h3 className="text-sm font-bold text-white tracking-tight mb-1">System Exception</h3>
      <p className="text-xs text-[#908fa0] max-w-sm leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon="refresh">
          Retry Sync
        </Button>
      )}
    </div>
  );
};
