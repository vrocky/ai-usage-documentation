import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-md border border-border">
        <h2 className="text-xl font-bold mb-4 text-foreground">{title}</h2>
        <div className="text-muted-foreground mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-muted text-muted-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
