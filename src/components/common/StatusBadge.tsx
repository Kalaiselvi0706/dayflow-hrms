import React from 'react';

type BadgeStatus =
  | 'Present'
  | 'Late'
  | 'On Leave'
  | 'Absent'
  | 'Approved'
  | 'Pending'
  | 'Rejected'
  | 'Active'
  | 'Paused'
  | 'Full Time'
  | 'Contract'
  | 'Part Time';

interface StatusBadgeProps {
  status: BadgeStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = (val: string) => {
    switch (val) {
      // Positive/Active states
      case 'Present':
      case 'Approved':
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      
      // Warning states
      case 'Late':
      case 'Pending':
      case 'Paused':
      case 'Part Time':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      
      // Info/Indigo states
      case 'On Leave':
      case 'Full Time':
        return 'bg-[#8083ff]/15 text-[#c0c1ff] border-[#8083ff]/30';

      // Violet states
      case 'Contract':
        return 'bg-[#a078ff]/15 text-[#d0bcff] border-[#a078ff]/30';
      
      // Danger states
      case 'Absent':
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      
      // Default fallback
      default:
        return 'bg-[#282a30]/60 text-[#908fa0] border-[#464554]/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getStyles(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};
