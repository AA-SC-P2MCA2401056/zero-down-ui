import React, { useEffect, useState } from "react";
import ApiConfig from "../../api/apiConfig";

const Header = () => {

  const [alertCount, setAlertCount] = useState(0);

  const loadAlertCount = async () => {
    const data = await ApiConfig.getRequest(ApiConfig.ENDPOINTS.ALERT_ACTIVE);
    setAlertCount(data?.length || 0);
  };

  useEffect(() => {
    loadAlertCount();
    const i = setInterval(loadAlertCount, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="bg-emerald-950 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Greenhouse Dashboard</h1>

      <div className="flex gap-4 items-center">
        {/* 🚨 Blinking Alert Badge */}
        {alertCount > 0 && (
          <span className="animate-pulse bg-amber-600 text-white text-xs px-3 py-1 rounded-full">
            {alertCount} ALERT{alertCount > 1 ? "S" : ""}
          </span>
        )}

        <button className="hover:bg-emerald-500 px-3 py-1 rounded">Settings</button>
        <button className="hover:bg-emerald-500 px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Header;

