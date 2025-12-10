import React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-erp-900 text-white hover:bg-erp-900/80",
    secondary: "border-transparent bg-erp-100 text-erp-900 hover:bg-erp-100/80",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
    success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
    outline: "text-erp-950 border-erp-200",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-erp-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
