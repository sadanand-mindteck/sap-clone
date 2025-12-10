import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../ui/input.jsx';
import { cn } from '../../lib/utils.js';

export const RHFInput = ({ name, label, className, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1 w-full">
          {label && <label className="text-[11px] font-semibold text-erp-700 uppercase tracking-tight">{label}</label>}
          <Input
            {...field}
            {...props}
            value={field.value ?? ''} // Handle null/undefined
            className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
          />
          {error && <span className="text-[10px] text-red-600">{error.message}</span>}
        </div>
      )}
    />
  );
};