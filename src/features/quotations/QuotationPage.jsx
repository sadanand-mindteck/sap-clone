import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotationService } from "@/services/quotationService.js";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils.js";
import { Plus, Search, FileText, Send, Printer } from "lucide-react";
// Reusing SalesOrderForm logic for Quotations but pointing to different submission handler could be an option,
// but for clarity we will use a simplified view or reuse the form if logic is identical.
// For this demo, I will render the list and assume the Form is reused or a simple one.
import { SalesOrderForm } from "@/features/sales/SalesOrderForm";

export const QuotationPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: quotationService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: quotationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setIsCreating(false);
    },
  });

  if (isCreating) {
    return (
      <div className="h-full bg-white rounded-sm shadow-sm border border-erp-300 overflow-hidden flex flex-col">
        <div className="p-2 bg-yellow-50 border-b border-yellow-100 text-yellow-800 text-xs font-bold text-center">
          Creating New Offer Letter
        </div>
        <SalesOrderForm
          onSubmit={(data) => createMutation.mutate({ ...data, type: "Quotation", status: "Sent" })}
          onCancel={() => setIsCreating(false)}
          isLoading={createMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border border-erp-300 shadow-sm rounded-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-erp-50 border-b border-erp-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-erp-800 uppercase tracking-tight mr-4">Offer Letters</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1.5 w-3 h-3 text-erp-400" />
            <input
              placeholder="Search Quote ID or Client..."
              className="w-full h-7 pl-7 pr-2 rounded-sm border border-erp-300 bg-white text-xs focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-1">
            <Plus className="w-3 h-3" /> Create Offer
          </Button>
        </div>
      </div>

      {/* List View */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-erp-100 text-erp-700 font-semibold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 border-r border-erp-300 w-32">Quote ID</th>
              <th className="p-3 border-r border-erp-300">Customer</th>
              <th className="p-3 border-r border-erp-300 w-32">Date</th>
              <th className="p-3 border-r border-erp-300 w-24">Status</th>
              <th className="p-3 border-r border-erp-300 w-32">Valid Until</th>
              <th className="p-3 text-right w-32">Total Value</th>
              <th className="p-3 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-erp-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading quotations...
                </td>
              </tr>
            ) : quotes.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-erp-400 flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 opacity-20" />
                  No Quotations found.
                </td>
              </tr>
            ) : (
              quotes.map((quote, i) => (
                <tr key={quote.id} className={cn("hover:bg-yellow-50/30 cursor-pointer", i % 2 === 1 && "bg-erp-50/30")}>
                  <td className="p-3 font-medium text-blue-700 border-r border-erp-100">{quote.id}</td>
                  <td className="p-3 border-r border-erp-100 font-medium text-erp-800">{quote.customer}</td>
                  <td className="p-3 border-r border-erp-100 text-erp-600">{quote.date}</td>
                  <td className="p-3 border-r border-erp-100">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700">
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-3 border-r border-erp-100 text-erp-600">{quote.validUntil || "N/A"}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(quote.total)}</td>
                  <td className="p-3 text-center flex justify-center gap-1">
                    <Button size="xs" variant="ghost" title="Print Offer">
                      <Printer className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
