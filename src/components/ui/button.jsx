import React from "react";
import { cn } from "@/lib/utils.js";

export const Button = React.forwardRef(({ className, variant = "primary", size = "sm", ...props }, ref) => {
  const variants = {
    primary: "bg-erp-700 text-white hover:bg-erp-800 shadow-sm border border-transparent",
    secondary: "bg-white text-erp-900 border border-erp-300 hover:bg-erp-50 shadow-sm",
    outline: "bg-transparent border border-erp-400 text-erp-700 hover:bg-erp-50",
    ghost: "bg-transparent text-erp-700 hover:bg-erp-100 hover:text-erp-900",
    danger: "bg-red-700 text-white hover:bg-red-800 shadow-sm",
  };

  const sizes = {
    xs: "h-6 px-2 text-xs",
    sm: "h-7 px-3 text-xs", // Default SAP-like size
    md: "h-9 px-4 text-sm",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-erp-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
