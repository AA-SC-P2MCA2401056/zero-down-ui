import React, { useState, useEffect } from "react";
import SensorTable from "../components/SensorTable";
import ApiConfig from "../api/apiConfig";

const SensorLog = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      console.log("Fetching sensor history...");
      console.log(ApiConfig.ENDPOINTS.SENSOR_HISTORY);
      const data = await ApiConfig.getRequest(ApiConfig.ENDPOINTS.SENSOR_HISTORY, {
        minutes: 20,
      });
      console.log("History API response:", data);
      // Ensure history is always an array
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load sensor history:", error);
      setHistory([]); // fallback to empty, avoid crashes
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sensor Logs</h2>
      <SensorTable history={history} />
    </div>
  );
};

export default SensorLog;
