import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService.js";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils.js";
import { ArrowLeft, Box, Package, MapPin, BarChart3, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InventoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      // In a real app, you'd use a specific getById endpoint.
      // Mocking it by fetching all and finding.
      const all = await inventoryService.getAll();
      return all.find((p) => p.id === id);
    },
  });

  if (isLoading) return <div className="p-8 text-center">Loading details...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found.</div>;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-erp-200 bg-erp-50 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-erp-900">{product.name}</h1>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-bold uppercase",
                product.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              )}
            >
              {product.status}
            </span>
          </div>
          <p className="text-xs text-erp-500 font-mono mt-1">
            {product.sku} • {product.category}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-700">{formatCurrency(product.price)}</div>
          <div className="text-xs text-erp-500">Unit Price</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-erp-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Stock History</TabsTrigger>
            <TabsTrigger value="movement">Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-erp-50 rounded-sm">
                    <span className="text-xs text-erp-500 block mb-1">Description</span>
                    <p className="text-erp-800">{product.description || "No description provided."}</p>
                  </div>
                  <div className="p-3 bg-erp-50 rounded-sm">
                    <span className="text-xs text-erp-500 block mb-1">Warehouse Location</span>
                    <div className="flex items-center gap-2 font-bold text-erp-800">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {product.location}
                    </div>
                  </div>
                  <div className="p-3 bg-erp-50 rounded-sm">
                    <span className="text-xs text-erp-500 block mb-1">Inventory Metrics</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-erp-400">Current Stock</div>
                        <div className="font-bold text-lg">{product.stock}</div>
                      </div>
                      <div>
                        <div className="text-xs text-erp-400">Stock Value</div>
                        <div className="font-bold text-lg">{formatCurrency(product.stock * product.price)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-erp-50 rounded-sm">
                    <span className="text-xs text-erp-500 block mb-1">Properties</span>
                    <div className="space-y-1">
                      {product.isBatchTracked && (
                        <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                          <Box className="w-3 h-3" /> Batch Managed
                        </div>
                      )}
                      {product.isFragile && (
                        <div className="text-xs font-bold text-orange-600 flex items-center gap-1">
                          <Package className="w-3 h-3" /> Fragile
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="secondary">
                  Adjust Stock
                </Button>
                <Button className="w-full" variant="secondary">
                  Transfer Stock
                </Button>
                <Button className="w-full" variant="secondary">
                  Print Label
                </Button>
                <Button className="w-full text-red-600 hover:bg-red-50" variant="ghost">
                  Deactivate Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <div className="border border-erp-200 rounded-sm p-8 text-center text-erp-400">
              <History className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Stock transaction history will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="movement">
            <div className="border border-erp-200 rounded-sm p-8 text-center text-erp-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Movement analytics will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
