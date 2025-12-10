import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout.jsx";
import { InventoryPage } from "./features/inventory/InventoryPage.jsx";
import { DashboardPage } from "./features/dashboard/DashboardPage.jsx";
import FinancialAccountingPage from "./features/financial/FinancialAccountingPage.jsx";

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-full text-erp-400 bg-white border border-erp-200 rounded-sm">
    <div className="text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-xs mt-1">Module under development</p>
    </div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="procurement" element={<PlaceholderPage title="Procurement Module" />} />
          <Route path="sales" element={<PlaceholderPage title="Sales & Distribution" />} />
          <Route path="finance" element={<FinancialAccountingPage title="Financial Accounting" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="users" element={<PlaceholderPage title="User Management" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
