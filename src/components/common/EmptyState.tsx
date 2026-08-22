import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-[#1e1f26]/50 border border-[#464554]/20 backdrop-blur-xl ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#282a30] text-[#908fa0] flex items-center justify-center border border-[#464554]/30 mb-4 shadow-inner">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h3 className="text-sm font-bold text-white tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-[#908fa0] max-w-sm leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} icon="add">
          {actionText}
        </Button>
      )}
    </div>
  );
};
