import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface NotificationToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const icons = {
    success: { icon: 'check_circle', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    error: { icon: 'error', color: 'text-rose-400', border: 'border-rose-500/30' },
    info: { icon: 'info', color: 'text-[#8083ff]', border: 'border-[#8083ff]/30' },
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-50 bg-[#1e1f26] border ${icons[type].border} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-sm`}
        >
          <span className={`material-symbols-outlined ${icons[type].color}`}>
            {icons[type].icon}
          </span>
          <span className="text-xs font-semibold tracking-wide leading-normal">{message}</span>
          <button
            onClick={onClose}
            className="text-[#908fa0] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
