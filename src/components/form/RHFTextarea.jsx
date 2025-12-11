import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const RHFTextarea = ({ name, label, className, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1.5 w-full">
          {label && <Label htmlFor={name}>{label}</Label>}
          <Textarea
            {...field}
            {...props}
            id={name}
            value={field.value ?? ""}
            className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
          />
          {error && <span className="text-[10px] text-red-600">{error.message}</span>}
        </div>
      )}
    />
  );
};
