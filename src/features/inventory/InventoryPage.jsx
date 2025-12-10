import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { inventoryService } from "@/services/inventoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import { ProductForm } from "@/features/inventory/ProductForm";

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
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Queries
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => inventoryService.update(data.id, data.form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsFormOpen(false);
      setEditingProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  // Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "sku",
        header: "SKU",
        cell: (info) => <span className="font-semibold text-erp-800">{info.getValue()}</span>,
      },
      {
        accessorKey: "name",
        header: "Product Name",
        size: 250,
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: (info) => {
          const val = info.getValue();
          return <span className={cn("px-1.5 py-0.5 rounded-sm", val < 10 ? "bg-red-100 text-red-800" : "text-erp-800")}>{val}</span>;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "status",
        header: "Status",
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
        cell: ({ row }) => (
          <div className="flex gap-1 justify-end">
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
        size: 60,
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
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
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-erp-50 border-b border-erp-200">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-erp-800 uppercase tracking-tight mr-4">Inventory Master</h2>
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
        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-erp-100 sticky top-0 z-10 text-erp-700 font-semibold shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-3 py-2 border-b border-r border-erp-300 last:border-r-0 select-none cursor-pointer hover:bg-erp-200 transition-colors"
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
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center">
                    Loading data...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-erp-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-erp-200 hover:bg-blue-50 transition-colors group",
                      i % 2 === 0 ? "bg-white" : "bg-erp-50/30"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 py-1.5 border-r border-erp-200 last:border-r-0 text-erp-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Side Panel / Form Overlay */}
        {isFormOpen && (
          <div className="w-[350px] border-l border-erp-300 bg-white shadow-xl flex flex-col h-full absolute right-0 top-0 z-20 animate-in slide-in-from-right duration-200">
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

      {/* Footer / Pagination */}
      <div className="p-1 bg-erp-50 border-t border-erp-300 flex items-center justify-between text-xs text-erp-600">
        <div className="px-2">{table.getFilteredRowModel().rows.length} items loaded</div>
        <div className="flex gap-1 pr-1">
          <Button variant="secondary" size="xs" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span className="flex items-center px-2 font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button variant="secondary" size="xs" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
