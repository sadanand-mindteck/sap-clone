import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const RHFSelect = ({ name, label, options, placeholder, className, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && <label className="text-[11px] font-semibold text-erp-700 uppercase tracking-tight">{label}</label>}
          <Select {...field} {...props} className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          {error && <span className="text-[10px] text-red-600">{error.message}</span>}
        </div>
      )}
    />
  );
};
