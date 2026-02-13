import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  SmartphoneNfc,
  LogOutIcon,
  Shield,
  PlusIcon,
  ChevronDown,
  Logs,
  Bell
} from "lucide-react";

import React from "react";
import { SiEventstore } from "react-icons/si";
import { GrUserAdmin } from "react-icons/gr";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [adminOpen, setAdminOpen] = useState(
    location.pathname.startsWith("/admin")
  );

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // hard redirect to kill state
  };


  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/logs", label: "Sensor Log", icon: <Logs size={18} /> },
    { path: "/settings", label: "Settings", icon: <Settings size={18} /> },
    { path: "/alert", label: "Notification", icon: <Bell size={18}/> }

  ];

  const adminItems = [
    {
      path: "/admin/sensors",
      label: "Sensors",
      icon: <SmartphoneNfc size={18} />,
    },
    {
      path: "/admin/sensorLog",
      label: "Sensor Log",
      icon: <Logs size={18} />,
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-56"
      } bg-green-100 h-screen p-4 border-r flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-lg font-bold text-green-800">Menu</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-green-800 hover:bg-green-200 p-1 rounded"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-green-200 transition ${
              location.pathname === item.path
                ? "bg-green-300 font-semibold text-green-900"
                : "text-green-800"
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Admin Section */}
      <div className="mt-6">
        {/* Admin Parent */}
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-green-200 transition ${
            location.pathname.startsWith("/admin")
              ? "bg-green-300 font-semibold text-green-900"
              : "text-green-800"
          } ${collapsed ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3">
            <GrUserAdmin size={18} />
            {!collapsed && <span>Admin</span>}
          </div>

          {!collapsed && (
            adminOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>

        {/* Admin Sub Menu */}
        {adminOpen && (
          <div className={`mt-1 flex flex-col gap-1 ${collapsed ? "items-center" : "pl-6"}`}>
            {adminItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-green-200 transition text-sm ${
                  location.pathname === item.path
                    ? "bg-green-200 font-semibold text-green-900"
                    : "text-green-800"
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 text-amber-800 hover:bg-red-100 rounded w-full transition ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOutIcon size={18} />
          {!collapsed && <span><b>Logout</b></span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
