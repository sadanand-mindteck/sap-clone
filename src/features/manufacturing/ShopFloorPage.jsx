import React from "react";
import { useQuery } from "@tanstack/react-query";
import { qualityService } from "@/services/qualityService.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils.js";
import { Settings, Cpu, AlertTriangle, PlayCircle, PauseCircle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

// Mock data generator for sparklines
const generateSparkline = () => Array.from({ length: 20 }, (_, i) => ({ val: 50 + Math.random() * 40 }));

export const ShopFloorPage = () => {
  const { data: machines = [], isLoading } = useQuery({
    queryKey: ["machines"],
    queryFn: qualityService.getMachines,
    refetchInterval: 3000, // Poll every 3s to simulate live data
  });

  return (
    <div className="p-4 overflow-y-auto h-full bg-erp-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-erp-900 tracking-tight">Shop Floor Live View</h2>
        <p className="text-xs text-erp-500">Real-time machine monitoring and OEE metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
        {/* Placeholder for layout balance */}
        <div className="border-2 border-dashed border-erp-300 rounded-md flex flex-col items-center justify-center text-erp-400 p-8 min-h-[200px]">
          <Settings className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-medium">Add New Asset</span>
        </div>
      </div>
    </div>
  );
};

const MachineCard = ({ machine }) => {
  const statusColor =
    {
      Running: "text-green-500",
      Idle: "text-gray-400",
      Warning: "text-yellow-500",
      Error: "text-red-500",
    }[machine.status] || "text-gray-500";

  const StatusIcon = machine.status === "Running" ? PlayCircle : machine.status === "Warning" ? AlertTriangle : PauseCircle;

  return (
    <Card
      className={cn(
        "border-l-4",
        machine.status === "Running" ? "border-l-green-500" : machine.status === "Warning" ? "border-l-yellow-500" : "border-l-gray-300"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-erp-600" />
            <div>
              <CardTitle className="text-sm">{machine.name}</CardTitle>
              <p className="text-[10px] text-erp-500 font-mono">{machine.id}</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-bold uppercase", statusColor)}>
            <StatusIcon className="w-4 h-4" />
            {machine.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-erp-50 p-2 rounded-sm">
            <span className="text-[10px] text-erp-500 uppercase font-semibold">Efficiency</span>
            <div className="text-lg font-bold text-erp-800">{machine.efficiency}%</div>
          </div>
          <div className="bg-erp-50 p-2 rounded-sm">
            <span className="text-[10px] text-erp-500 uppercase font-semibold">Temperature</span>
            <div className="text-lg font-bold text-erp-800">{machine.temperature}°C</div>
          </div>
        </div>

        <div className="h-16 w-full bg-white border border-erp-100 rounded-sm mb-2 relative overflow-hidden">
          <div className="absolute top-1 left-1 text-[9px] text-erp-400 z-10">Power Consumption (Live)</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generateSparkline()}>
              <Line type="monotone" dataKey="val" stroke="#0f62fe" strokeWidth={2} dot={false} />
              <YAxis hide domain={["dataMin", "dataMax"]} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center text-xs border-t border-erp-100 pt-2 mt-2">
          <span className="text-erp-500">Active Job:</span>
          <span className="font-mono font-medium text-blue-700 bg-blue-50 px-2 rounded-sm">{machine.activeJob || "NO JOB"}</span>
        </div>
      </CardContent>
    </Card>
  );
};
