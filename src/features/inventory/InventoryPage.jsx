import React, { useMemo, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { inventoryService } from "@/services/inventoryService.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils.js";
import { ProductForm } from "./ProductForm";
import { ImportInventoryModal } from "./ImportInventoryModal";
import { Upload, Download } from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Icons
const SortIcon = ({ className }) => (
  <svg className={cn("w-3 h-3 ml-1", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export const InventoryPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Queries
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: inventoryService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsFormOpen(false);
      addToast({ title: "Success", description: `${data.sku} created successfully`, variant: "success" });
    },
    onError: () => {
      addToast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => inventoryService.update(data.id, data.form),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsFormOpen(false);
      setEditingProduct(null);
      addToast({ title: "Updated", description: `${data.sku} updated successfully`, variant: "success" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      addToast({ title: "Deleted", description: "Product removed from inventory", variant: "default" });
    },
  });

  // Export Function
  const handleExport = () => {
    if (products.length === 0) {
      addToast({ title: "Export Failed", description: "No data to export", variant: "warning" });
      return;
    }

    const headers = ["ID", "SKU", "Name", "Category", "Stock", "Price", "Location", "Status"];
    const rows = products.map((p) => [p.id, p.sku, `"${p.name}"`, p.category, p.stock, p.price, p.location, p.status]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ title: "Export Complete", description: "Inventory downloaded as CSV", variant: "success" });
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "sku",
        header: "SKU",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-erp-800">{info.getValue()}</span>
            {info.row.original.isBatchTracked && (
              <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wide">Batch Managed</span>
            )}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Product Name",
        size: 250,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        size: 100,
        cell: (info) => {
          const val = info.getValue();
          return <span className={cn("px-1.5 py-0.5 rounded-sm", val < 10 ? "bg-red-100 text-red-800" : "text-erp-800")}>{val}</span>;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 100,
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: "location",
        header: "Location",
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            Active: "bg-green-100 text-green-800",
            Discontinued: "bg-erp-100 text-erp-600",
            Draft: "bg-yellow-100 text-yellow-800",
          };
          return (
            <span
              className={cn("text-[10px] px-1.5 py-0.5 rounded border border-transparent font-medium", colors[status] || "bg-gray-100")}
            >
              {status.toUpperCase()}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="xs"
              className="h-5 w-5 p-0"
              onClick={() => {
                setEditingProduct(row.original);
                setIsFormOpen(true);
              }}
            >
              <EditIcon />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              className="h-5 w-5 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Delete ${row.original.sku}?`)) {
                  deleteMutation.mutate(row.original.id);
                }
              }}
            >
              <TrashIcon />
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  // Virtualizer setup
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // Height of a row
    overscan: 10,
  });

  const handleFormSubmit = (data) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, form: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border border-erp-300 shadow-sm rounded-sm overflow-hidden">
      <ImportInventoryModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-erp-50 border-b border-erp-200 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-erp-800 uppercase tracking-tight mr-4">Inventory Master ({rows.length})</h2>
          <div className="w-64">
            <Input
              placeholder="Search products..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white" onClick={handleExport}>
            <Download className="w-3 h-3 mr-1" /> Export
          </Button>
          <Button variant="outline" className="bg-white" onClick={() => setIsImportOpen(true)}>
            <Upload className="w-3 h-3 mr-1" /> Import
          </Button>
          <Button variant="secondary" onClick={() => queryClient.invalidateQueries({ queryKey: ["inventory"] })}>
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
          >
            + Create New
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table Container with Virtualization */}
        <div ref={parentRef} className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center">Loading data...</div>
          ) : (
            <div className="w-full relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              <table className="w-full border-collapse text-xs absolute top-0 left-0">
                <thead
                  className="bg-erp-100 text-erp-700 font-semibold shadow-sm sticky top-0 z-20"
                  style={{ transform: `translateY(${rowVirtualizer.range ? parentRef.current?.scrollTop : 0}px)` }}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="flex w-full">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left px-3 py-2 border-b border-r border-erp-300 last:border-r-0 select-none cursor-pointer hover:bg-erp-200 transition-colors flex items-center"
                          style={{ width: header.getSize() }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() && (
                              <SortIcon className={header.column.getIsSorted() === "desc" ? "transform rotate-180" : ""} />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                      <tr
                        key={row.id}
                        onClick={() => navigate(`/inventory/${row.original.id}`)}
                        className={cn(
                          "border-b border-erp-200 hover:bg-blue-50 transition-colors group flex absolute w-full cursor-pointer",
                          virtualRow.index % 2 === 0 ? "bg-white" : "bg-erp-50/30"
                        )}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-3 py-1.5 border-r border-erp-200 last:border-r-0 text-erp-900 flex items-center"
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr className="flex w-full">
                      <td colSpan={columns.length} className="p-4 text-center text-erp-500 w-full">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Panel / Form Overlay */}
        {isFormOpen && (
          <div
            className="w-[350px] border-l border-erp-300 bg-white shadow-xl flex flex-col h-full absolute right-0 top-0 z-20 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-erp-200 bg-erp-50 flex justify-between items-center">
              <h3 className="font-bold text-erp-800">{editingProduct ? "Edit Product" : "New Material"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-erp-500 hover:text-red-500">
                &#10005;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ProductForm
                defaultValues={editingProduct || undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Info */}
      <div className="p-1 bg-erp-50 border-t border-erp-300 flex items-center justify-between text-xs text-erp-600 shrink-0">
        <div className="px-2">Showing {rows.length} items (Virtual Scrolling Enabled)</div>
      </div>
    </div>
  );
};
