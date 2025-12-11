import React, { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventoryService } from "@/services/inventoryService.js";
import { RHFInput } from "@/components/form/RHFInput";
import { RHFSelect } from "@/components/form/RHFSelect";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils.js";
import { Trash2, Plus, ShoppingCart, Barcode, Check, Box } from "lucide-react";

const salesOrderSchema = z.object({
  customer: z.string().min(2, "Customer Name is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["Draft", "Confirmed", "Shipped"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        productName: z.string(),
        quantity: z.coerce.number().min(1, "Qty must be >= 1"),
        price: z.coerce.number().min(0),
        total: z.coerce.number(),
        batchNumber: z.string().optional(),
        serialNumbers: z.array(z.string()).optional(),
      })
    )
    .min(1, "At least one item is required"),
});

export const SalesOrderForm = ({ onSubmit, onCancel, isLoading }) => {
  const { data: products = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getAll,
  });

  const [serialModalOpen, setSerialModalOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(null);

  const methods = useForm({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      customer: "",
      date: new Date().toISOString().split("T")[0],
      status: "Draft",
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const watchItems = methods.watch("items");
  const grandTotal = watchItems?.reduce((acc, item) => acc + (Number(item.total) || 0), 0) || 0;

  const handleProductChange = (index, productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      methods.setValue(`items.${index}.productName`, product.name);
      methods.setValue(`items.${index}.price`, product.price);
      // Reset special tracking fields
      methods.setValue(`items.${index}.batchNumber`, "");
      methods.setValue(`items.${index}.serialNumbers`, []);

      const qty = methods.getValues(`items.${index}.quantity`) || 1;
      methods.setValue(`items.${index}.total`, Number((product.price * qty).toFixed(2)));
    }
  };

  const handleQuantityChange = (index, qty) => {
    const price = methods.getValues(`items.${index}.price`) || 0;
    methods.setValue(`items.${index}.total`, Number((price * qty).toFixed(2)));
  };

  const openSerialModal = (index) => {
    setActiveItemIndex(index);
    setSerialModalOpen(true);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col h-full bg-erp-50/50">
        {/* Serial Number Modal */}
        {serialModalOpen && activeItemIndex !== null && (
          <SerialEntryModal
            isOpen={serialModalOpen}
            onClose={() => {
              setSerialModalOpen(false);
              setActiveItemIndex(null);
            }}
            item={watchItems[activeItemIndex]}
            onSave={(serials) => {
              methods.setValue(`items.${activeItemIndex}.serialNumbers`, serials);
              setSerialModalOpen(false);
            }}
          />
        )}

        {/* Header Section */}
        <div className="bg-white p-4 border-b border-erp-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-erp-800">
            <div className="bg-blue-100 p-1.5 rounded-sm">
              <ShoppingCart className="w-4 h-4 text-blue-700" />
            </div>
            <h3 className="font-bold uppercase tracking-tight">New Sales Order</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <RHFInput name="customer" label="Customer Name" placeholder="Enter Client..." />
            <RHFInput name="date" label="Order Date" type="date" />
            <RHFSelect
              name="status"
              label="Status"
              options={[
                { label: "Draft", value: "Draft" },
                { label: "Confirmed", value: "Confirmed" },
                { label: "Shipped", value: "Shipped" },
              ]}
            />
          </div>
        </div>

        {/* Line Items Section */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white border border-erp-200 rounded-sm shadow-sm min-h-[300px] flex flex-col">
            <div className="p-2 bg-erp-100 border-b border-erp-200 flex justify-between items-center">
              <span className="text-xs font-bold text-erp-700 uppercase">Line Items</span>
              <Button
                type="button"
                size="xs"
                onClick={() => append({ productId: "", quantity: 1, price: 0, total: 0, batchNumber: "", serialNumbers: [] })}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </Button>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-erp-50 text-erp-600 font-semibold border-b border-erp-200">
                <tr>
                  <th className="p-2 w-8">#</th>
                  <th className="p-2">Product</th>
                  <th className="p-2 w-20 text-right">Qty</th>
                  <th className="p-2 w-28 text-center">Batch/Lot</th>
                  <th className="p-2 w-24 text-center">Serials</th>
                  <th className="p-2 w-24 text-right">Price</th>
                  <th className="p-2 w-24 text-right">Total</th>
                  <th className="p-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-erp-100">
                {fields.map((field, index) => {
                  const currentProductId = watchItems[index]?.productId;
                  const selectedProduct = products.find((p) => p.id === currentProductId);
                  const isBatch = selectedProduct?.isBatchTracked;

                  const hasSerials = watchItems[index]?.serialNumbers?.length > 0;
                  const qty = watchItems[index]?.quantity || 0;
                  const serialCount = watchItems[index]?.serialNumbers?.length || 0;
                  const isSerialValid = serialCount === qty;

                  return (
                    <tr key={field.id} className="hover:bg-blue-50/30">
                      <td className="p-2 text-center text-erp-400">{index + 1}</td>
                      <td className="p-2">
                        <select
                          className="w-full border border-erp-300 rounded-sm px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                          {...methods.register(`items.${index}.productId`)}
                          onChange={(e) => {
                            methods.register(`items.${index}.productId`).onChange(e);
                            handleProductChange(index, e.target.value);
                          }}
                        >
                          <option value="">Select Product...</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.sku} - {p.name}
                            </option>
                          ))}
                        </select>
                        {isBatch && (
                          <div className="mt-1 text-[9px] text-blue-600 font-bold uppercase tracking-wider">Batch Managed Material</div>
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="w-full text-right border border-erp-300 rounded-sm px-2 py-1"
                          min="1"
                          {...methods.register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                            onChange: (e) => handleQuantityChange(index, e.target.value),
                          })}
                        />
                      </td>
                      <td className="p-2">
                        {isBatch ? (
                          <div className="relative">
                            <Box className="absolute left-1.5 top-1.5 w-3 h-3 text-erp-400" />
                            <input
                              className="w-full border border-blue-300 rounded-sm pl-6 pr-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 outline-none text-blue-800 font-mono"
                              placeholder="Batch #"
                              {...methods.register(`items.${index}.batchNumber`)}
                            />
                          </div>
                        ) : (
                          <div className="text-center text-erp-300">-</div>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          type="button"
                          variant={hasSerials ? (isSerialValid ? "outline" : "danger") : "secondary"}
                          size="xs"
                          onClick={() => openSerialModal(index)}
                          className={isSerialValid && hasSerials ? "border-green-500 text-green-700 bg-green-50" : ""}
                          title="Manage Serial Numbers"
                        >
                          <Barcode className="w-3 h-3 mr-1" />
                          {hasSerials ? `${serialCount}/${qty}` : "Add SN"}
                        </Button>
                      </td>
                      <td className="p-2 text-right">{formatCurrency(watchItems[index]?.price || 0)}</td>
                      <td className="p-2 text-right font-semibold">{formatCurrency(watchItems[index]?.total || 0)}</td>
                      <td className="p-2 text-center">
                        <button type="button" onClick={() => remove(index)} className="text-erp-400 hover:text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border-t border-erp-200 p-4 shadow-sm z-10 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-700">Total: {formatCurrency(grandTotal)}</div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || fields.length === 0} className="w-32">
              {isLoading ? "Processing..." : "Save Order"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

// Internal Sub-component for Serial Entry
const SerialEntryModal = ({ isOpen, onClose, item, onSave }) => {
  const qty = item.quantity || 1;
  const [serials, setSerials] = useState(item.serialNumbers || Array(qty).fill(""));

  // Ensure array length matches qty
  React.useEffect(() => {
    setSerials((prev) => {
      const newArr = [...prev];
      if (newArr.length < qty) {
        return [...newArr, ...Array(qty - newArr.length).fill("")];
      }
      return newArr.slice(0, qty);
    });
  }, [qty]);

  const handleChange = (i, val) => {
    const newSerials = [...serials];
    newSerials[i] = val;
    setSerials(newSerials);
  };

  const handleAutoGenerate = () => {
    const prefix = "SN-" + Math.floor(Math.random() * 1000) + "-";
    setSerials(serials.map((_, i) => `${prefix}${100 + i}`));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Serial Numbers for ${item.productName || "Item"}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-blue-50 p-2 rounded-sm border border-blue-100">
          <span className="text-xs text-blue-800">
            Enter <b>{qty}</b> serial numbers for traceability.
          </span>
          <Button size="xs" variant="outline" onClick={handleAutoGenerate}>
            Auto-Generate
          </Button>
        </div>

        <div className="max-h-[300px] overflow-y-auto grid grid-cols-2 gap-2">
          {serials.map((sn, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-[10px] text-erp-500 uppercase font-bold">Unit #{i + 1}</label>
              <input
                className="border border-erp-300 rounded-sm px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                value={sn}
                placeholder="Scan or type SN..."
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-erp-200">
          <Button onClick={() => onSave(serials)} disabled={serials.some((s) => !s)}>
            <Check className="w-3 h-3 mr-1" /> Confirm Serials
          </Button>
        </div>
      </div>
    </Modal>
  );
};
