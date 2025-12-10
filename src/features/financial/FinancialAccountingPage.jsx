import React, { useState } from "react";
import DateRangeAutocomplete from "@/components/shadcn/DateRangeAutocomplete";
import CurrencyInput from "@/components/shadcn/CurrencyInput";
import { formatCurrency } from "@/lib/numberUtils";
import { formatDateISO } from "@/lib/dateUtils";

export default function FinancialAccountingPage() {
  const [desc, setDesc] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [amount, setAmount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  function addTransaction() {
    if (!dateRange || amount == null) return;
    const tx = {
      id: Date.now(),
      desc: desc || "Transaction",
      start: dateRange.start,
      end: dateRange.end,
      amount: amount,
      label: dateRange.label || "Custom",
    };
    setTransactions((t) => [tx, ...t]);
    setDesc("");
    setAmount(null);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Financial Accounting</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Date Range</label>
          <DateRangeAutocomplete onChange={setDateRange} />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">Amount</label>
          <CurrencyInput value={amount} onChange={setAmount} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-slate-600 mb-1">Description</label>
        <input className="border rounded px-2 py-1 w-full" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>

      <div className="mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="button" onClick={addTransaction}>
          Add Transaction
        </button>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-3">Transactions</h3>
        {transactions.length === 0 && <div className="text-slate-600">No transactions yet.</div>}
        <ul className="space-y-3">
          {transactions.map((tx) => (
            <li key={tx.id} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{tx.desc}</div>
                  <div className="text-sm text-slate-600">
                    {tx.label} {tx.start ? `— ${formatDateISO(tx.start)} to ${formatDateISO(tx.end)}` : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(tx.amount)}</div>
                  <div className="text-sm text-slate-500">ID: {tx.id}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
