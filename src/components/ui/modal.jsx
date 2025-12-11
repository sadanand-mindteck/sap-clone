import React from "react";
import { cn } from "@/lib/utils.js";

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          "bg-white border border-erp-200 shadow-xl rounded-sm w-[500px] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-3 border-b border-erp-200 bg-erp-50">
          <h3 className="font-bold text-erp-800 text-sm uppercase tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-erp-500 hover:text-red-600 transition-colors">
            &#10005;
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
