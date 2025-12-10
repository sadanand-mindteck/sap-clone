import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { cn } from '../lib/utils.js';

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center px-3 py-2 text-xs font-medium rounded-sm transition-colors mb-0.5",
      isActive 
        ? "bg-blue-100 text-blue-900" 
        : "text-erp-300 hover:bg-erp-800 hover:text-white"
    )}
  >
    {icon && <span className="mr-2 opacity-70">{icon}</span>}
    {label}
  </NavLink>
);

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-erp-100">
      {/* Sidebar */}
      <aside className="w-52 bg-erp-900 flex flex-col shadow-lg z-10">
        <div className="h-10 flex items-center px-4 bg-erp-950 border-b border-erp-800">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
          <span className="text-sm font-bold text-white tracking-wide">ERP<span className="text-blue-400">Next</span></span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="text-[10px] font-bold text-erp-500 uppercase px-3 mb-2 tracking-wider">Modules</div>
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/inventory" label="Inventory Management" />
          <NavItem to="/procurement" label="Procurement" />
          <NavItem to="/sales" label="Sales & Distribution" />
          <NavItem to="/finance" label="Financial Accounting" />
          
          <div className="text-[10px] font-bold text-erp-500 uppercase px-3 mb-2 mt-6 tracking-wider">System</div>
          <NavItem to="/settings" label="Global Settings" />
          <NavItem to="/users" label="User Management" />
        </nav>

        <div className="p-3 bg-erp-950 border-t border-erp-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
            <div className="flex flex-col">
              <span className="text-xs text-erp-200 font-medium leading-none">John Doe</span>
              <span className="text-[10px] text-erp-500 leading-none mt-0.5">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Header */}
        <header className="h-10 bg-white border-b border-erp-300 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center text-xs text-erp-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-erp-800">Inventory</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-erp-500">System Status: <span className="text-green-600 font-bold">Online</span></span>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 p-2 overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};