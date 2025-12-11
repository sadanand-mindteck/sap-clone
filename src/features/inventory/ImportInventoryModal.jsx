import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService.js";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export const ImportInventoryModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);

  const importMutation = useMutation({
    mutationFn: inventoryService.bulkCreate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
      setFile(null);
      setPreview([]);
      alert(`Successfully imported ${data.imported} items.`);
    },
    onError: () => {
      setError("Failed to import items. Please check the data format.");
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = text
          .split("\n")
          .map((row) => row.trim())
          .filter((row) => row);

        if (rows.length < 2) {
          setError("File appears empty or missing headers.");
          return;
        }

        const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());
        const data = rows.slice(1).map((row) => {
          const values = row.split(",").map((v) => v.trim());
          const item = {};

          // Simple mapping logic
          headers.forEach((header, index) => {
            const value = values[index];
            if (header === "sku") item.sku = value;
            if (header === "name") item.name = value;
            if (header === "stock") item.stock = Number(value);
            if (header === "price") item.price = Number(value);
            if (header === "category") item.category = value;
            if (header === "location") item.location = value;
          });

          return item;
        });

        setPreview(data.slice(0, 5)); // Preview first 5
      } catch (err) {
        setError("Error parsing CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,sku,name,category,stock,price,location\nSKU-DEMO,Demo Item,Industrial,100,50.00,A-01";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Inventory (Excel/CSV)">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-sm text-xs text-blue-800 flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div>
            <p className="font-bold mb-1">Instructions:</p>
            <p>
              Upload a CSV file with the following headers:{" "}
              <span className="font-mono bg-blue-100 px-1">sku, name, category, stock, price, location</span>.
            </p>
            <button onClick={downloadTemplate} className="text-blue-600 underline mt-1 hover:text-blue-800">
              Download Template
            </button>
          </div>
        </div>

        <div className="border-2 border-dashed border-erp-300 rounded-md p-6 flex flex-col items-center justify-center bg-erp-50 transition-colors hover:bg-erp-100">
          <Upload className="w-8 h-8 text-erp-400 mb-2" />
          <p className="text-sm font-medium text-erp-600 mb-2">Drag and drop or click to upload</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mx-auto max-w-[200px]"
          />
        </div>

        {error && (
          <div className="text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {error}
          </div>
        )}

        {preview.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-erp-600">Preview ({preview.length} rows detected)</h4>
            <div className="border border-erp-200 rounded-sm overflow-hidden">
              <table className="w-full text-[10px]">
                <thead className="bg-erp-100">
                  <tr>
                    <th className="px-2 py-1 text-left">SKU</th>
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-erp-200">
                      <td className="px-2 py-1">{row.sku}</td>
                      <td className="px-2 py-1">{row.name}</td>
                      <td className="px-2 py-1 text-right">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-erp-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => importMutation.mutate(preview)}
            disabled={!file || preview.length === 0 || importMutation.isPending}
            className="flex items-center gap-2"
          >
            {importMutation.isPending ? (
              "Importing..."
            ) : (
              <>
                <FileText className="w-3 h-3" /> Import Data
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
