import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white border border-slate-300 rounded-[2px] shadow-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {toast.title}
            </div>
            {toast.message && (
              <div className="text-[11px] text-slate-500 mt-0.5">
                {toast.message}
              </div>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
