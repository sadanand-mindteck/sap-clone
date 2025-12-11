import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { workflowService } from "@/services/workflowService.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils.js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClipboardCheck, Truck, ShieldCheck, AlertTriangle } from "lucide-react";

export const ScrutinyPage = () => {
  const { data: fclList = [] } = useQuery({ queryKey: ["fcl"], queryFn: workflowService.getFCL });
  const { data: fcmList = [] } = useQuery({ queryKey: ["fcm"], queryFn: workflowService.getFCM });

  return (
    <div className="p-4 h-full flex flex-col gap-4 bg-erp-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-erp-900">Scrutiny Workbench</h2>
          <p className="text-xs text-erp-500">Compliance & Change Management Control</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-erp-200 rounded-sm shadow-sm p-4 overflow-hidden flex flex-col">
        <Tabs defaultValue="fcl" className="h-full flex flex-col">
          <TabsList className="mb-4 self-start bg-erp-100 p-1">
            <TabsTrigger value="fcl" className="flex items-center gap-2">
              <Truck className="w-3 h-3" /> FCL (Final Compliance List)
            </TabsTrigger>
            <TabsTrigger value="fcm" className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> FCM (Field Change Mgmt)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fcl" className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fclList.map((item) => (
                <div key={item.id} className="border border-erp-200 rounded-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{item.id}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-1.5 rounded",
                        item.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-erp-800 mb-1">{item.description}</h4>
                  <p className="text-xs text-erp-500 mb-4">
                    Ref: {item.refId} • Type: {item.type}
                  </p>

                  <div className="space-y-2 bg-erp-50 p-2 rounded-sm border border-erp-100">
                    {item.parameters.map((param, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-erp-700">{param.name}</span>
                        {param.checked ? (
                          <ClipboardCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button size="xs" variant="outline">
                      View Manifest
                    </Button>
                    <Button size="xs">Verify</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fcm" className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-erp-100 font-semibold text-erp-700">
                <tr>
                  <th className="p-3 border-b border-erp-200">ID</th>
                  <th className="p-3 border-b border-erp-200">Ref ID</th>
                  <th className="p-3 border-b border-erp-200">Description</th>
                  <th className="p-3 border-b border-erp-200">Department</th>
                  <th className="p-3 border-b border-erp-200">Impact</th>
                  <th className="p-3 border-b border-erp-200">Status</th>
                  <th className="p-3 border-b border-erp-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {fcmList.map((item) => (
                  <tr key={item.id} className="hover:bg-erp-50">
                    <td className="p-3 border-b border-erp-100 font-medium">{item.id}</td>
                    <td className="p-3 border-b border-erp-100 text-erp-500">{item.refId}</td>
                    <td className="p-3 border-b border-erp-100">{item.description}</td>
                    <td className="p-3 border-b border-erp-100">{item.department}</td>
                    <td className="p-3 border-b border-erp-100">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold",
                          item.impact === "High" ? "bg-red-100 text-red-700" : "bg-erp-200 text-erp-600"
                        )}
                      >
                        {item.impact}
                      </span>
                    </td>
                    <td className="p-3 border-b border-erp-100">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                          item.status === "Approved" ? "text-green-600" : "text-yellow-600"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 border-b border-erp-100">
                      <Button size="xs" variant="ghost" className="text-blue-600 hover:text-blue-800">
                        Scrutinize
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
