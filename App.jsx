import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { InventoryPage } from "@/features/inventory/InventoryPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
// import FinancialAccountingPage from "@/features/financial/FinancialAccountingPage";
import { SalesOrderDetailsPage } from "@/features/sales/SalesOrderDetailsPage";
import { SalesOrderPage } from "@/features/sales/SalesOrderPage";
import { InventoryDetailsPage } from "@/features/inventory/InventoryDetailsPage";
import { ProfilePage } from "@/features/auth/ProfilePage";
import { QuotationPage } from "@/features/quotations/QuotationPage";
import { QualityControlPage } from "@/features/quality/QualityControlPage";
import { ShopFloorPage } from "@/features/manufacturing/ShopFloorPage";
import { ApprovalsPage } from "@/features/workflow/ApprovalsPage";
import { ScrutinyPage } from "@/features/scrunity/ScrutinyPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { UsersPage } from "@/features/users/UsersPage";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Note: keeping imports unchanged per your request — you said you'll handle imports.
// The routing structure below switches from HashRouter-style routes to hook-style
// `useRoutes` with `BrowserRouter` and top-level providers (ToastProvider, AuthProvider).

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
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "profile", element: <ProfilePage /> },

        // Inventory
        { path: "inventory", element: <InventoryPage /> },
        { path: "inventory/:id", element: <InventoryDetailsPage /> },

        // Sales
        { path: "sales", element: <SalesOrderPage /> },
        { path: "sales/:id", element: <SalesOrderDetailsPage /> },

        { path: "quotations", element: <QuotationPage /> },
        { path: "quality", element: <QualityControlPage /> },
        { path: "shop-floor", element: <ShopFloorPage /> },
        { path: "approvals", element: <ApprovalsPage /> },
        { path: "scrutiny", element: <ScrutinyPage /> },

        { path: "procurement", element: <PlaceholderPage title="Procurement Module" /> },
        // { path: "finance", element: <FinancialAccountingPage /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "users", element: <UsersPage /> },
      ],
    },
  ]);
}

export default function App() {
  return (
    // Top-level providers (ToastProvider/AuthProvider) go here. Imports intentionally omitted — you said you'll handle them.
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
