import React, { useState, useEffect } from "react";
import SensorTable from "../components/SensorTable";

const SensorLog = () => {
  // Example mock history data
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Simulate fetching sensor history
    const mockData = Array.from({ length: 20 }).map((_, i) => ({
      time: Date.now() - i * 60000,
      temp: 24 + Math.random() * 3,
      humidity: 55 + Math.random() * 5,
      soil: 40 + Math.random() * 10,
      light: 600 + Math.random() * 100,
    }));
    setHistory(mockData);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sensor Logs</h2>
      <SensorTable history={history} />
    </div>
  );
};

export default SensorLog;

