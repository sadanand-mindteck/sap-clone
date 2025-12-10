import React from 'react';
import { cn } from '../../lib/utils.js';

export const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-7 w-full rounded-sm border border-erp-300 bg-white px-2 py-0 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-erp-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";