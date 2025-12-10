import React from "react";
import { cn } from "../../lib/utils.js";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const handleChange = (e) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="peer h-4 w-4 shrink-0 opacity-0 absolute cursor-pointer disabled:cursor-not-allowed z-10"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-erp-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-erp-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-erp-900 data-[state=checked]:text-white data-[state=checked]:border-erp-900 bg-white transition-all flex items-center justify-center pointer-events-none",
            checked ? "bg-erp-900 border-erp-900" : "",
            className
          )}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };