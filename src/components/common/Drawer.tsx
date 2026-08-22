import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0c0d12]/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg h-full bg-[#1a1d26]/95 border-l border-[#464554]/40 shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#464554]/25 flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-[#282a30] hover:bg-[#33343b] text-[#908fa0] hover:text-white flex items-center justify-center transition-colors border border-[#464554]/30"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 text-sm text-[#e2e2eb] space-y-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-[#464554]/25 bg-[#111319]/50 flex items-center justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
