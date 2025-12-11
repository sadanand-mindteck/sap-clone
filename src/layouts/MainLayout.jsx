import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils.js";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  ClipboardCheck,
  Factory,
  Settings,
  Users,
  FileSignature,
  ShieldAlert,
  LogOut,
  UserCircle,
} from "lucide-react";

const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center px-3 py-2 text-xs font-medium rounded-sm transition-colors mb-0.5",
        isActive ? "bg-blue-100 text-blue-900" : "text-erp-300 hover:bg-erp-800 hover:text-white"
      )
    }
  >
    {Icon && <Icon className="w-4 h-4 mr-2 opacity-70" />}
    {label}
  </NavLink>
);

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-erp-100">
      {/* Sidebar */}
      <aside className="w-56 bg-erp-900 flex flex-col shadow-lg z-10 shrink-0 transition-all">
        <div className="h-10 flex items-center px-4 bg-erp-950 border-b border-erp-800">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>
          <span className="text-sm font-bold text-white tracking-wide">
            ERP<span className="text-blue-400">Next 4.0</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="text-[10px] font-bold text-erp-500 uppercase px-3 mb-2 tracking-wider">Modules</div>
          <NavItem to="/" label="Dashboard" icon={LayoutDashboard} />
          <NavItem to="/inventory" label="Inventory & Stock" icon={Package} />
          <NavItem to="/sales" label="Sales Orders" icon={ShoppingCart} />
          <NavItem to="/quotations" label="Offer Letters" icon={FileText} />

          <div className="text-[10px] font-bold text-erp-500 uppercase px-3 mb-2 mt-6 tracking-wider">Governance</div>
          <NavItem to="/approvals" label="File Noting (Approvals)" icon={FileSignature} />
          <NavItem to="/scrutiny" label="Scrutiny (FCL/FCM)" icon={ShieldAlert} />

          <div className="text-[10px] font-bold text-erp-500 uppercase px-3 mb-2 mt-6 tracking-wider">Manufacturing & Quality</div>
          <NavItem to="/quality" label="Quality Control" icon={ClipboardCheck} />
          <NavItem to="/shop-floor" label="Shop Floor (IoT)" icon={Factory} />

          <div className="text-[10px] font-bold text-erp-500 uppercase px-3 mb-2 mt-6 tracking-wider">System</div>
          <NavItem to="/settings" label="Global Settings" icon={Settings} />
          <NavItem to="/users" label="User Management" icon={Users} />
        </nav>

        <div className="p-3 bg-erp-950 border-t border-erp-800">
          <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={handleProfile}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-xs text-white font-bold shadow-inner border border-blue-500">
              {user?.avatar || user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs text-erp-200 font-medium leading-none truncate">{user?.name || "Guest"}</span>
              <span className="text-[10px] text-erp-500 leading-none mt-0.5 truncate">{user?.role || "Viewer"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-[10px] text-erp-400 hover:text-white bg-erp-900 hover:bg-erp-800 py-1 rounded transition-colors"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Top Header */}
        <header className="h-10 bg-white border-b border-erp-300 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center text-xs text-erp-500">
            <span className="font-semibold text-erp-800">Enterprise Resource Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 cursor-pointer hover:bg-erp-50 px-2 py-1 rounded" onClick={handleProfile}>
              <UserCircle className="w-4 h-4 text-erp-600" />
              <span className="text-xs font-medium text-erp-700">My Profile</span>
            </div>
            <div className="h-4 w-[1px] bg-erp-300 mx-1"></div>
            <span className="text-xs text-erp-500 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Status: <span className="text-green-600 font-bold">Connected</span>
            </span>
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
