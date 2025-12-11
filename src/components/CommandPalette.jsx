import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  ClipboardCheck,
  Factory,
  FileSignature,
  ShieldAlert,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils.js";
import { useAuth } from "@/context/AuthContext";

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const actions = [
    { type: "link", label: "Go to Dashboard", icon: LayoutDashboard, path: "/" },
    { type: "link", label: "Go to Inventory", icon: Package, path: "/inventory" },
    { type: "link", label: "Go to Sales Orders", icon: ShoppingCart, path: "/sales" },
    { type: "link", label: "Go to Quotations", icon: FileText, path: "/quotations" },
    { type: "link", label: "Go to Quality Control", icon: ClipboardCheck, path: "/quality" },
    { type: "link", label: "Go to Shop Floor", icon: Factory, path: "/shop-floor" },
    { type: "link", label: "Go to Approvals", icon: FileSignature, path: "/approvals" },
    { type: "link", label: "Go to Scrutiny", icon: ShieldAlert, path: "/scrutiny" },
    { type: "link", label: "Go to Settings", icon: Settings, path: "/settings" },
    {
      type: "action",
      label: "Create New Sales Order",
      icon: Plus,
      action: () => {
        navigate("/sales");
        setTimeout(() => document.querySelector('[data-action="create-order"]')?.click(), 100);
      },
    },
    {
      type: "action",
      label: "Logout",
      icon: LogOut,
      action: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  const filteredActions = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (action) => {
    if (action.type === "link") {
      navigate(action.path);
    } else if (action.type === "action" && action.action) {
      action.action();
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        handleSelect(filteredActions[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-erp-200 overflow-hidden animate-in zoom-in-95 duration-100">
        <div className="flex items-center px-4 py-3 border-b border-erp-100">
          <Search className="w-5 h-5 text-erp-400 mr-3" />
          <input
            ref={inputRef}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-erp-400 text-erp-800"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="text-[10px] bg-erp-100 text-erp-500 px-1.5 py-0.5 rounded font-medium border border-erp-200">ESC</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-erp-400">No results found.</div>
          ) : (
            <>
              {filteredActions.length > 0 && (
                <div className="px-2">
                  <div className="text-[10px] font-bold text-erp-400 px-2 py-1 uppercase">Suggested</div>
                  {filteredActions.map((action, i) => (
                    <div
                      key={action.label}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer transition-colors",
                        i === selectedIndex ? "bg-blue-50 text-blue-800" : "text-erp-700 hover:bg-erp-50"
                      )}
                      onClick={() => handleSelect(action)}
                      onMouseEnter={() => setSelectedIndex(i)}
                    >
                      <action.icon className={cn("w-4 h-4 mr-3", i === selectedIndex ? "text-blue-600" : "text-erp-400")} />
                      <span>{action.label}</span>
                      {i === selectedIndex && <CornerDownLeftIcon className="w-3 h-3 ml-auto text-blue-400" />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="px-4 py-2 bg-erp-50 border-t border-erp-100 text-[10px] text-erp-400 flex justify-between">
          <span>Use arrows to navigate</span>
          <span>ERP Command Line</span>
        </div>
      </div>
    </div>
  );
};

const CornerDownLeftIcon = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 10 4 15 9 20" />
    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </svg>
);
