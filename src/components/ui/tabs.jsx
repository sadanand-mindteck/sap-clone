import React, { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils.js"

const TabsContext = createContext(undefined);

const Tabs = React.forwardRef(
  ({ className, defaultValue, children, ...props }, ref) => {
    const [value, setValue] = useState(defaultValue);
    return (
      <TabsContext.Provider value={{ value, onValueChange: setValue }}>
        <div ref={ref} className={cn("", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-sm bg-erp-100 p-1 text-erp-500",
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    const isSelected = context?.value === value;
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context?.onValueChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-xs font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-erp-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isSelected ? "bg-white text-erp-950 shadow-sm" : "hover:bg-white/50 hover:text-erp-700",
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (context?.value !== value) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-erp-950 focus-visible:ring-offset-2 animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };