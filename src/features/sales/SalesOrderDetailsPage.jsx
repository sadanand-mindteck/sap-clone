import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { salesService } from "@/services/salesService.js";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils.js";
import { ArrowLeft, Printer, ShoppingCart, User, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SalesOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["sales", id],
    queryFn: async () => {
      // Mock fetch by ID from all orders
      const all = await salesService.getAll();
      return all.find((o) => o.id === id);
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading order...</div>;
  if (!order) return <div className="p-8 text-center text-red-500">Order not found.</div>;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-erp-200 bg-erp-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-erp-900 flex items-center gap-2">
              Order {order.id}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold uppercase",
                  order.status === "Draft"
                    ? "bg-gray-100 text-gray-700"
                    : order.status === "Confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {order.status}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
          <Button variant="primary">Edit Order</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-erp-50/50">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-erp-500 uppercase font-bold">Customer</div>
                  <div className="text-sm font-semibold text-erp-900">{order.customer}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-erp-500 uppercase font-bold">Order Date</div>
                  <div className="text-sm font-semibold text-erp-900">{order.date}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-erp-500 uppercase font-bold">Total Amount</div>
                  <div className="text-sm font-semibold text-erp-900">{formatCurrency(order.total)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-erp-50 text-erp-700 border-b border-erp-100">
                  <tr>
                    <th className="p-3 pl-6">Product</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 pr-6 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-erp-100">
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 pl-6">
                        <div className="font-medium text-erp-900">{item.productName}</div>
                        <div className="text-xs text-erp-500">{item.productId}</div>
                        {item.serialNumbers?.length > 0 && (
                          <div className="text-[10px] text-blue-600 font-mono mt-1">SN: {item.serialNumbers.join(", ")}</div>
                        )}
                      </td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                      <td className="p-3 pr-6 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Footer Summary */}
          <div className="flex justify-end">
            <div className="w-64 bg-white p-4 rounded shadow-sm border border-erp-200">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-erp-500">Subtotal</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-erp-500">Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-erp-100 font-bold text-lg">
                <span>Grand Total</span>
                <span className="text-blue-700">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
