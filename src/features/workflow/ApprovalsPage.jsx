import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowService } from "@/services/workflowService.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils.js";
import { FileText, User, Clock, Send, CheckCircle, XCircle, ChevronRight, CornerDownLeft } from "lucide-react";

export const ApprovalsPage = () => {
  const [selectedFileId, setSelectedFileId] = useState(null);
  const queryClient = useQueryClient();

  const { data: approvals = [] } = useQuery({
    queryKey: ["approvals"],
    queryFn: workflowService.getApprovals,
  });

  const selectedFile = approvals.find((a) => a.id === selectedFileId);

  return (
    <div className="flex h-full bg-erp-50 overflow-hidden border border-erp-200 rounded-sm">
      {/* Sidebar List */}
      <div className="w-80 bg-white border-r border-erp-200 flex flex-col">
        <div className="p-3 border-b border-erp-200 bg-erp-50">
          <h3 className="text-xs font-bold text-erp-700 uppercase tracking-wide">Pending Files ({approvals.length})</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {approvals.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              className={cn(
                "p-3 border-b border-erp-100 cursor-pointer hover:bg-erp-50 transition-colors",
                selectedFileId === file.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-erp-500 bg-erp-100 px-1 rounded">{file.id}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 rounded-full",
                    file.priority === "High" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  )}
                >
                  {file.priority}
                </span>
              </div>
              <h4 className="text-xs font-bold text-erp-900 leading-tight mb-1">{file.subject}</h4>
              <div className="flex justify-between text-[10px] text-erp-500">
                <span>{file.initiator}</span>
                <span>{file.currentStage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main View: File Noting */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedFile ? (
          <FileNotingView file={selectedFile} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-erp-400">
            <FileText className="w-12 h-12 mb-2 opacity-20" />
            <p>Select a file to view notings</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FileNotingView = ({ file }) => {
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");

  const { data: notings = [] } = useQuery({
    queryKey: ["notings", file.id],
    queryFn: () => workflowService.getNotings(file.id),
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ text, action }) => workflowService.addNoting(file.id, text, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notings", file.id] });
      setNoteText("");
    },
  });

  return (
    <>
      {/* File Header */}
      <div className="h-14 border-b border-erp-200 flex items-center px-4 justify-between bg-erp-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-erp-900">{file.subject}</h2>
            <span className="text-[10px] bg-erp-200 px-1 rounded text-erp-700">{file.id}</span>
          </div>
          <p className="text-[10px] text-erp-500 mt-0.5">
            Created on {file.createdDate} by {file.initiator}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="xs">
            View Attachments
          </Button>
          <Button variant="outline" size="xs">
            History
          </Button>
        </div>
      </div>

      {/* Notings Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
        {notings.map((note, index) => (
          <div key={note.id} className="relative pl-6 border-l-2 border-erp-200">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-erp-300 border-2 border-slate-50"></div>
            <div className="bg-white p-3 rounded-sm shadow-sm border border-erp-200">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-erp-100">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-erp-400" />
                  <span className="text-xs font-bold text-erp-800">{note.user}</span>
                  <span className="text-[10px] text-erp-500 uppercase">({note.role})</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-erp-400">
                  <Clock className="w-3 h-3" />
                  {note.date}
                </div>
              </div>
              <p className="text-xs text-erp-700 leading-relaxed whitespace-pre-line font-serif">{note.text}</p>
              {note.action && (
                <div className="mt-2 text-[10px] font-bold uppercase text-blue-600 bg-blue-50 inline-block px-1.5 rounded">
                  Action: {note.action}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="border-t border-erp-200 p-4 bg-white shadow-lg z-10">
        <div className="mb-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full h-20 border border-erp-300 rounded-sm p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none font-serif bg-yellow-50/20"
            placeholder="Enter formal noting here..."
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[10px] text-erp-400">* Digital Signature will be appended automatically.</div>
          <div className="flex gap-2">
            <Button
              onClick={() => addNoteMutation.mutate({ text: noteText, action: "Return" })}
              variant="secondary"
              className="text-orange-600"
              disabled={!noteText}
            >
              <CornerDownLeft className="w-3 h-3 mr-1" /> Return
            </Button>
            <Button
              onClick={() => addNoteMutation.mutate({ text: noteText, action: "Reject" })}
              variant="danger"
              className="bg-red-600"
              disabled={!noteText}
            >
              <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>
            <Button
              onClick={() => addNoteMutation.mutate({ text: noteText, action: "Approve" })}
              className="bg-green-600 hover:bg-green-700"
              disabled={!noteText}
            >
              <CheckCircle className="w-3 h-3 mr-1" /> Approve & Forward
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
