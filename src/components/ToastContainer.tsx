import React from 'react';
import { useToasts } from '../context/ToastContext';

const typeClasses = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToasts();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg text-white ${typeClasses[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-4 font-bold">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
