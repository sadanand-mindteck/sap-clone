import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RHFInput } from '../../components/form/RHFInput.jsx';
import { RHFSelect } from '../../components/form/RHFSelect.jsx';
import { RHFTextarea } from '../../components/form/RHFTextarea.jsx';
import { RHFCheckbox } from '../../components/form/RHFCheckbox.jsx';
import { Button } from '../../components/ui/button.jsx';

// Zod Schema
const productSchema = z.object({
  sku: z.string().min(3, "SKU is required (min 3 chars)"),
  name: z.string().min(2, "Product Name is required"),
  description: z.string().optional(),
  category: z.enum(['Electronics', 'Office', 'Industrial', 'Furniture']),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(['Active', 'Discontinued', 'Draft']),
  isFragile: z.boolean().default(false),
});

export const ProductForm = ({ defaultValues, onSubmit, onCancel, isLoading }) => {
  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      category: 'Industrial',
      status: 'Active',
      stock: 0,
      price: 0,
      isFragile: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-full">
        
        <div className="space-y-4 p-1 flex-1 overflow-y-auto pr-2">
          
          <div className="p-2 bg-blue-50/50 border border-blue-100 rounded-sm mb-4">
             <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-2">Basic Information</h4>
             <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <RHFInput name="sku" label="SKU / ID" placeholder="e.g. SKU-1234" />
                <RHFSelect 
                  name="category" 
                  label="Category" 
                  options={[
                    { label: 'Electronics', value: 'Electronics' },
                    { label: 'Office Supplies', value: 'Office' },
                    { label: 'Industrial', value: 'Industrial' },
                    { label: 'Furniture', value: 'Furniture' },
                  ]} 
                />
                <div className="col-span-2">
                  <RHFInput name="name" label="Product Name" placeholder="e.g. Heavy Duty Widget" />
                </div>
                
                <div className="col-span-2">
                  <RHFTextarea 
                    name="description" 
                    label="Description" 
                    placeholder="Enter detailed product specifications..." 
                    className="h-20"
                  />
                </div>
             </div>
          </div>

          <div className="p-2 bg-erp-50/50 border border-erp-200 rounded-sm">
            <h4 className="text-[10px] font-bold text-erp-600 uppercase tracking-wide mb-2">Inventory Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <RHFInput name="stock" label="Current Stock" type="number" />
              <RHFInput name="price" label="Unit Price ($)" type="number" step="0.01" />

              <RHFInput name="location" label="Warehouse Location" placeholder="e.g. A-12" />
              <RHFSelect 
                name="status" 
                label="Status" 
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Discontinued', value: 'Discontinued' },
                  { label: 'Draft', value: 'Draft' },
                ]} 
              />
              
              <div className="col-span-2 pt-2">
                <RHFCheckbox name="isFragile" label="This item is fragile and requires special handling" />
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-erp-200 mt-2 bg-white sticky bottom-0">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[100px]">
            {isLoading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};