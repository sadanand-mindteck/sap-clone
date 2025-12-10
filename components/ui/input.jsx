import React from 'react';
import { cn } from '../../lib/utils.js';

export const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-7 w-full rounded-sm border border-erp-300 bg-white px-2 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-erp-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-erp-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";