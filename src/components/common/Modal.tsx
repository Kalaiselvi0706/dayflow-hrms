import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  // Prevent body scroll when modal is open
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0c0d12]/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#1a1d26]/90 border border-[#464554]/50 rounded-3xl overflow-hidden shadow-2xl shadow-black/75 z-10 flex flex-col max-h-[90vh]"
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
              <div className="px-6 py-4 border-t border-[#464554]/25 bg-[#111319]/50 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
