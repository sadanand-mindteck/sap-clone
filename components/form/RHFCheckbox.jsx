import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox.jsx';
import { Label } from '../ui/label.jsx';
import { cn } from '../../lib/utils.js';

export const RHFCheckbox = ({ name, label, className, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Checkbox
            {...props}
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            className={className}
          />
          <label
            htmlFor={name}
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-erp-800 cursor-pointer"
          >
            {label}
          </label>
        </div>
      )}
    />
  );
};