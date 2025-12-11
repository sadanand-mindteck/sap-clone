import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qualityService } from "@/services/qualityService.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils.js";
import {
  CheckCircle2,
  XCircle,
  Search,
  Activity,
  Cpu,
  Thermometer,
  Zap,
  History,
  FileText,
  AlertTriangle,
  Printer,
  ArrowRight,
} from "lucide-react";

export const QualityControlPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'workbench'

  const { data: tests = [] } = useQuery({
    queryKey: ["quality-tests"],
    queryFn: qualityService.getAllTests,
  });

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Top Cards for Metrics */}
      <div className="grid grid-cols-4 gap-4 h-24 shrink-0">
        <MetricCard title="Pass Rate (24h)" value="98.5%" icon={CheckCircle2} color="text-green-600" />
        <MetricCard title="Tests Performed" value="142" icon={Activity} color="text-blue-600" />
        <MetricCard title="Failed Units" value="3" icon={XCircle} color="text-red-600" />
        <MetricCard title="Active Bench" value="Bench A" icon={Cpu} color="text-erp-600" />
      </div>

      <div className="flex-1 bg-white border border-erp-300 rounded-sm shadow-sm flex overflow-hidden">
        {/* Sidebar for Navigation */}
        <div className="w-48 bg-erp-50 border-r border-erp-200 p-2 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("list")}
            className={cn(
              "text-left px-3 py-2 text-xs font-medium rounded-sm flex items-center gap-2",
              activeTab === "list" ? "bg-white shadow-sm text-blue-700" : "text-erp-600 hover:bg-erp-100"
            )}
          >
            <History className="w-3 h-3" /> Test History
          </button>
          <button
            onClick={() => setActiveTab("workbench")}
            className={cn(
              "text-left px-3 py-2 text-xs font-medium rounded-sm flex items-center gap-2",
              activeTab === "workbench" ? "bg-white shadow-sm text-blue-700" : "text-erp-600 hover:bg-erp-100"
            )}
          >
            <Cpu className="w-3 h-3" /> Test Workbench
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "list" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-erp-800">Recent Quality Inspections</h3>
                <Button size="xs" onClick={() => setActiveTab("workbench")}>
                  + New Inspection
                </Button>
              </div>
              <table className="w-full text-xs text-left border border-erp-200">
                <thead className="bg-erp-100 font-semibold text-erp-700">
                  <tr>
                    <th className="p-2">Test ID</th>
                    <th className="p-2">Serial Number</th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Date</th>
                    <th className="p-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id} className="border-t border-erp-100 hover:bg-erp-50">
                      <td className="p-2 font-medium">{test.id}</td>
                      <td className="p-2 font-mono text-blue-600">{test.serialNumber}</td>
                      <td className="p-2">{test.productName}</td>
                      <td className="p-2 text-erp-500">{new Date(test.testDate).toLocaleString()}</td>
                      <td className="p-2 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            test.result === "Pass" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}
                        >
                          {test.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "workbench" && <TestWorkbench />}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white border border-erp-200 rounded-sm p-3 flex items-center shadow-sm">
    <div className={cn("p-2 rounded-full bg-opacity-10 mr-3", color.replace("text-", "bg-"))}>
      <Icon className={cn("w-5 h-5", color)} />
    </div>
    <div>
      <p className="text-[10px] text-erp-500 uppercase tracking-wide font-semibold">{title}</p>
      <p className="text-xl font-bold text-erp-900">{value}</p>
    </div>
  </div>
);

// --- Serial Number Wise Workbench ---
const TestWorkbench = () => {
  const [serial, setSerial] = useState("");
  const [activeSerial, setActiveSerial] = useState(null);
  const [testStage, setTestStage] = useState("Visual"); // Visual, Electrical, Stress
  const queryClient = useQueryClient();

  const { data: history = [], refetch } = useQuery({
    queryKey: ["serial-history", activeSerial],
    queryFn: () => qualityService.getTestHistoryBySerial(activeSerial),
    enabled: !!activeSerial,
  });

  const executeTestMutation = useMutation({
    mutationFn: qualityService.executeTest,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["quality-tests"] });
    },
  });

  const generateNoteMutation = useMutation({
    mutationFn: qualityService.generateNote,
    onSuccess: (data) => {
      alert(data.message); // In real app, show toast
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (serial) setActiveSerial(serial);
  };

  const runTest = (result, notes) => {
    executeTestMutation.mutate({
      serialNumber: activeSerial,
      productName: "Component X", // In real app, fetch from product DB
      type: `${testStage} Inspection`,
      result,
      notes,
      technician: "CurrentUser",
      stage: testStage,
    });
  };

  const handleGenerateNote = (result) => {
    generateNoteMutation.mutate({
      serialNumber: activeSerial,
      type: testStage,
      content: `Manual generation triggered from workbench for ${testStage}.`,
      result,
      stage: testStage,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="flex gap-4 mb-6 border-b border-erp-200 pb-4">
        <div className="flex-1">
          <label className="text-[10px] font-bold text-erp-500 uppercase mb-1 block">Scan / Enter Serial Number</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder="SN-XXXX-XXXX"
              className="font-mono text-lg h-10 border-blue-200 focus:border-blue-500"
              autoFocus
            />
            <Button type="submit" className="h-10 px-6">
              Search Unit
            </Button>
          </form>
        </div>
        {activeSerial && (
          <div className="flex-1 bg-blue-50 border border-blue-100 p-2 rounded-sm flex items-center justify-between">
            <div>
              <h4 className="font-bold text-blue-900 text-sm">{activeSerial}</h4>
              <p className="text-xs text-blue-600">Industrial Component B-1</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-blue-500 uppercase font-bold">Status</div>
              <div className="text-sm font-bold text-blue-800">In Testing</div>
            </div>
          </div>
        )}
      </div>

      {activeSerial ? (
        <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
          {/* Left: Test Execution */}
          <div className="col-span-2 flex flex-col gap-4 overflow-y-auto pr-2">
            {/* Stage Selector */}
            <div className="flex bg-erp-100 p-1 rounded-sm gap-1">
              {["Visual", "Electrical", "Stress"].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setTestStage(stage)}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-sm transition-all",
                    testStage === stage ? "bg-white shadow-sm text-blue-700" : "text-erp-500 hover:text-erp-700"
                  )}
                >
                  {stage} Inspection
                </button>
              ))}
            </div>

            {/* Test Form */}
            <div className="border border-erp-200 rounded-sm p-4 bg-erp-50/50">
              <h4 className="font-bold text-erp-800 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Run {testStage} Test
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {testStage === "Electrical" && (
                  <>
                    <div className="bg-white p-2 border border-erp-200 rounded-sm">
                      <label className="text-[10px] font-bold text-erp-500 block mb-1">Voltage (V)</label>
                      <Input placeholder="24.0" />
                    </div>
                    <div className="bg-white p-2 border border-erp-200 rounded-sm">
                      <label className="text-[10px] font-bold text-erp-500 block mb-1">Amperage (A)</label>
                      <Input placeholder="2.5" />
                    </div>
                  </>
                )}
                <div className="col-span-2 bg-white p-2 border border-erp-200 rounded-sm">
                  <label className="text-[10px] font-bold text-erp-500 block mb-1">Technician Notes</label>
                  <textarea className="w-full text-xs border-none outline-none resize-none h-16" placeholder="Enter observations..." />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => runTest("Pass", "Routine check passed")}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-10 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as PASS
                </Button>
                <Button onClick={() => runTest("Fail", "Deviation detected")} className="flex-1 bg-red-600 hover:bg-red-700 h-10 text-sm">
                  <XCircle className="w-4 h-4 mr-2" /> Mark as FAIL
                </Button>
              </div>
            </div>

            {/* Note Generation Actions */}
            <div className="border border-erp-200 rounded-sm p-4 bg-white">
              <h4 className="font-bold text-erp-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-erp-600" /> Document Generation
              </h4>
              <p className="text-xs text-erp-500 mb-4">Generate formal documentation based on test results.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="xs" onClick={() => handleGenerateNote("Pass")}>
                  <Printer className="w-3 h-3 mr-1" /> Print Release Note
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleGenerateNote("Fail")}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" /> Raise NCR (Workflow)
                </Button>
              </div>
            </div>
          </div>

          {/* Right: History Timeline */}
          <div className="border-l border-erp-200 pl-4 flex flex-col h-full">
            <h4 className="font-bold text-erp-700 text-xs uppercase mb-4">Unit History</h4>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {history.length === 0 ? (
                <p className="text-xs text-erp-400 italic">No previous tests found.</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-erp-200 pb-4 last:border-0 last:pb-0">
                    <div
                      className={cn(
                        "absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full",
                        item.result === "Pass" ? "bg-green-500" : "bg-red-500"
                      )}
                    ></div>
                    <div className="text-xs">
                      <span className="font-bold text-erp-800">{item.type}</span>
                      <span className="text-erp-400 mx-1">•</span>
                      <span className="text-erp-500">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div
                      className={cn(
                        "inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1 mb-1",
                        item.result === "Pass" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      )}
                    >
                      {item.result}
                    </div>
                    <p className="text-[10px] text-erp-600 leading-tight bg-erp-50 p-2 rounded-sm border border-erp-100">
                      {item.notes || "No notes logged."}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-erp-300">
          <Search className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-sm">Scan a barcode or enter a Serial Number to begin.</p>
        </div>
      )}
    </div>
  );
};
