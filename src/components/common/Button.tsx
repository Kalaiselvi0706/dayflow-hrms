import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ai';
  loading?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all select-none active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#8083ff] to-[#03b5d3] text-white shadow-lg shadow-[#8083ff]/20 hover:shadow-[#8083ff]/35 border border-transparent',
    secondary:
      'bg-[#282a30] hover:bg-[#33343b] text-[#e2e2eb] border border-[#464554]/50 hover:border-[#464554]/80',
    danger:
      'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 shadow-lg shadow-rose-500/5',
    ai:
      'bg-gradient-to-r from-[#8083ff] to-[#a078ff] text-white shadow-md shadow-[#8083ff]/10 hover:shadow-[#8083ff]/25 border border-transparent',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : icon ? (
        <span className="material-symbols-outlined text-base">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
