import React from 'react';
import { useToasts } from '../context/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const typeClasses = {
  success: 'bg-green-500 border-green-600',
  error: 'bg-red-500 border-red-600',
  info: 'bg-blue-500 border-blue-600',
};

const typeIcons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useToasts();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-3 rounded-lg shadow-lg text-white border-l-4 ${typeClasses[toast.type]}`}
        >
          <div className="flex items-center gap-3">
            {typeIcons[toast.type]}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button onClick={() => removeToast(toast.id)} className="p-1 rounded-full hover:bg-black/20">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
