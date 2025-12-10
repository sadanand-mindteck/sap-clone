import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { InventoryPage } from "@/features/inventory/InventoryPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import FinancialAccountingPage from "@/features/financial/FinancialAccountingPage";

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-full text-erp-400 bg-white border border-erp-200 rounded-sm">
    <div className="text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-xs mt-1">Module under development</p>
    </div>
  </div>
);

function AppRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "inventory", element: <InventoryPage /> },
        { path: "procurement", element: <PlaceholderPage title="Procurement Module" /> },
        { path: "sales", element: <PlaceholderPage title="Sales & Distribution" /> },
        { path: "finance", element: <FinancialAccountingPage /> },
        { path: "settings", element: <PlaceholderPage title="Settings" /> },
        { path: "users", element: <PlaceholderPage title="User Management" /> },
      ],
    },
  ]);
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
