import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = "default", duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ title, description, variant, onClose }) => {
  const bgColors = {
    default: "bg-white border-erp-200 text-erp-900",
    success: "bg-green-50 border-green-200 text-green-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
  };

  const icons = {
    default: <Info className="w-4 h-4 text-blue-500" />,
    success: <CheckCircle className="w-4 h-4 text-green-600" />,
    destructive: <AlertCircle className="w-4 h-4 text-red-600" />,
    warning: <AlertCircle className="w-4 h-4 text-yellow-600" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-sm shadow-lg border min-w-[300px] animate-in slide-in-from-right-full duration-300 ${bgColors[variant]}`}
    >
      <div className="mt-0.5">{icons[variant] || icons.default}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-bold">{title}</h4>}
        {description && <p className="text-xs opacity-90">{description}</p>}
      </div>
      <button onClick={onClose} className="text-erp-400 hover:text-erp-900">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
