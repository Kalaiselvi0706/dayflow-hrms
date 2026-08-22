import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}) => {
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <p className="text-sm text-[#908fa0] leading-relaxed">{message}</p>
    </Modal>
  );
};
