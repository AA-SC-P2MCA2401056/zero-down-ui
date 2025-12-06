import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import React from 'react'

const Sidebar = () => {

  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/d", label: "Detailed View", icon: <BarChart3 size={18} /> },
    { path: "/logs", label: "Sensor Log", icon: <Settings size={18} /> },
    { path: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-56"
      } bg-green-100 h-screen p-4 border-r flex flex-col transition-all duration-300`}
    >
      {/* Header + Collapse Button */}
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-lg font-bold text-green-800 transition-opacity duration-300">
            Menu
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-green-800 hover:bg-green-200 p-1 rounded"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
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

      {/* Optional Footer or Logout */}
      <div className="mt-auto">
        <button
          className={`flex items-center gap-3 px-3 py-2 text-red-700 hover:bg-red-100 rounded w-full transition ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar
