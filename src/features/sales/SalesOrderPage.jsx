import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { salesService } from "@/services/salesService.js";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils.js";
import { SalesOrderForm } from "./SalesOrderForm";
import { Plus, Search, FileText } from "lucide-react";

export const SalesOrderPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: salesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: salesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setIsCreating(false);
    },
  });

  if (isCreating) {
    return (
      <div className="h-full bg-white rounded-sm shadow-sm border border-erp-300 overflow-hidden">
        <SalesOrderForm
          onSubmit={(data) => createMutation.mutate(data)}
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
          <h2 className="text-sm font-bold text-erp-800 uppercase tracking-tight mr-4">Sales Orders</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1.5 w-3 h-3 text-erp-400" />
            <input
              placeholder="Search Order ID or Customer..."
              className="w-full h-7 pl-7 pr-2 rounded-sm border border-erp-300 bg-white text-xs focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-1">
            <Plus className="w-3 h-3" /> Create Order
          </Button>
        </div>
      </div>

      {/* List View */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-erp-100 text-erp-700 font-semibold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 border-r border-erp-300 w-32">Order ID</th>
              <th className="p-3 border-r border-erp-300">Customer</th>
              <th className="p-3 border-r border-erp-300 w-32">Date</th>
              <th className="p-3 border-r border-erp-300 w-24">Status</th>
              <th className="p-3 border-r border-erp-300 w-20 text-center">Items</th>
              <th className="p-3 text-right w-32">Total Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-erp-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-erp-400 flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 opacity-20" />
                  No Sales Orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/sales/${order.id}`)}
                  className={cn("hover:bg-blue-50 cursor-pointer", i % 2 === 1 && "bg-erp-50/30")}
                >
                  <td className="p-3 font-medium text-blue-700 border-r border-erp-100">{order.id}</td>
                  <td className="p-3 border-r border-erp-100 font-medium text-erp-800">{order.customer}</td>
                  <td className="p-3 border-r border-erp-100 text-erp-600">{order.date}</td>
                  <td className="p-3 border-r border-erp-100">
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                        order.status === "Draft"
                          ? "bg-gray-100 text-gray-600"
                          : order.status === "Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 border-r border-erp-100 text-center text-erp-600">{order.items.length}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
