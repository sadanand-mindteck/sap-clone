import React from "react";
import { cn } from "@/lib/utils.js";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-sm border border-erp-300 bg-white px-3 py-2 text-xs shadow-sm placeholder:text-erp-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-erp-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
