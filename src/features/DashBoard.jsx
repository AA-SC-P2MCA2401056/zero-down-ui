import React, { useEffect, useMemo, useState, useRef } from "react";
import MetricCards from "../components/MetricCards";
import { TempHumidityChart } from "../components/Charts";
import QuickControls from "../components/QuickControls";
import { formatTime, randomNoise } from "../common/utils";
import toast from "react-hot-toast";

/**
 * DashBoardD Component
 * -------------------
 * Displays the greenhouse dashboard with live/simulated sensor data.
 * Features:
 * - Metric cards (Temperature, Humidity, Soil, Light)
 * - Temperature & Humidity line chart
 * - Quick Controls (Irrigation toggle, Soil & Light chart, Recent events)
 * - CSV export
 * 
 * Uses simulated sensor data (mock/live mode). Replace simulator with
 * real WebSocket/REST API for production.
 */
const DashBoardD = () => {
  // Mode: "mock" or "live" (simulated live updates)
  const [mode, setMode] = useState("mock");

  // Latest sensor values
  const [temp, setTemp] = useState(26.4);
  const [humidity, setHumidity] = useState(58.2);
  const [soil, setSoil] = useState(42);
  const [light, setLight] = useState(720);

  // Irrigation state
  const [irrigationOn, setIrrigationOn] = useState(false);

  // Timer reference for updating sensor data
  const timerRef = useRef(null);

  // History of sensor data (used for charts, last 60 points)
  const [history, setHistory] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 20 }).map((_, i) => ({
      time: now - (19 - i) * 30000, // 30s interval
      temp: 24 + Math.sin(i / 3) * 2 + randomNoise(0.5),
      humidity: 55 + Math.cos(i / 4) * 3 + randomNoise(1),
      soil: 40 + Math.sin(i / 5) * 6 + randomNoise(2),
      light: 600 + Math.max(0, Math.sin(i / 2) * 200) + randomNoise(20),
    }));
  });

  // Recent events / logs (max 10 items)
  const [events, setEvents] = useState([
    { id: 1, time: Date.now() - 1000 * 60 * 30, msg: "System started" },
    { id: 2, time: Date.now() - 1000 * 60 * 15, msg: "Irrigation cycle finished" },
  ]);

  // ---------------------------------------------
  // Simulate live updates for sensors
  // ---------------------------------------------
  useEffect(() => {
    const shouldToast = localStorage.getItem("showLoginToast");
    if (shouldToast === "true") {
      toast.success("Welcome to your greenhouse 🌿", { duration: 2000 });
      localStorage.removeItem("showLoginToast");
    }
    if (timerRef.current) clearInterval(timerRef.current);

    // Interval faster in live mode
    const interval = mode === "mock" ? 5000 : 3000;

    timerRef.current = setInterval(() => {
      const t = Date.now();

      // Diurnal light simulation (morning -> evening)
      const minutes = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      const diurnal = Math.max(0, Math.sin((minutes / 24) * Math.PI * 2));

      // Simulated sensor readings
      const nextTemp = Math.max(15, 24 + Math.sin(t / 60000) * 3 + randomNoise(0.8));
      const nextHumidity = Math.min(100, Math.max(20, 55 + Math.cos(t / 90000) * 4 + randomNoise(1.2)));
      const nextSoil = Math.max(
        0,
        Math.min(100, soil + (irrigationOn ? 6 + randomNoise(2) : -0.5 + randomNoise(0.6)))
      );
      const nextLight = Math.max(0, 200 + diurnal * 900 + randomNoise(40));

      // Update state
      setTemp(Number(nextTemp.toFixed(2)));
      setHumidity(Number(nextHumidity.toFixed(1)));
      setSoil(Number(nextSoil.toFixed(1)));
      setLight(Math.round(nextLight));

      // Update history
      setHistory(h => {
        const nxt = [...h, { time: t, temp: nextTemp, humidity: nextHumidity, soil: nextSoil, light: nextLight }];
        if (nxt.length > 60) nxt.shift(); // Keep last 60 points
        return nxt;
      });

      // Random events
      if (Math.random() < 0.05) {
        const id = Math.floor(Math.random() * 100000);
        setEvents(ev => [
          { id, time: t, msg: Math.random() < 0.5 ? "Sensor calibration" : "Auto irrigation triggered" },
          ...ev
        ].slice(0, 10));
      }
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [mode, irrigationOn, soil]);

  // ---------------------------------------------
  // Chart data for Temperature & Humidity line chart
  // ---------------------------------------------
  const chartData = useMemo(
    () =>
      history.map(p => ({
        time: formatTime(p.time),
        temp: Number(p.temp.toFixed(2)),
        humidity: Number(p.humidity.toFixed(1)),
      })),
    [history]
  );

  // ---------------------------------------------
  // Bar chart data for Soil & Light
  // ---------------------------------------------
  const barData = useMemo(() => {
    const last = history[history.length - 1] || {};
    return [
      { name: "Soil Moisture", value: Number((last.soil ?? soil).toFixed(1)) },
      { name: "Light", value: Math.round(last.light ?? light) },
    ];
  }, [history, soil, light]);

  // ---------------------------------------------
  // Quick Controls: Irrigation toggle
  // ---------------------------------------------
  const toggleIrrigation = () => {
    setIrrigationOn(v => {
      const next = !v;
      setEvents(ev => [
        { id: Date.now(), time: Date.now(), msg: next ? "Irrigation turned ON" : "Irrigation turned OFF" },
        ...ev
      ].slice(0, 10));
      return next;
    });
  };

  // Trim sensor history
  const trimHistory = () => {
    setHistory(h => h.slice(-10));
    setEvents(e => [
      { id: Date.now(), time: Date.now(), msg: "Cleared history" },
      ...e
    ].slice(0, 10));
  };

  // ---------------------------------------------
  // CSV Export
  // ---------------------------------------------
  const exportCSV = () => {
    const rows = [
      "time,temp,humidity,soil,light",
      ...history.map(
        h =>
          `${new Date(h.time).toISOString()},${h.temp.toFixed(2)},${h.humidity.toFixed(1)},${h.soil.toFixed(1)},${Math.round(
            h.light
          )}`
      ),
    ];
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `greenhouse-data-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------
  // Render
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Greenhouse Dashboard</h1>
            <p className="text-sm text-slate-600">Real-time monitoring & controls</p>
          </div>

          {/* Mode selector & CSV export */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
              <label className="text-xs text-slate-500">Mode</label>
              <select className="text-sm" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="mock">Mock</option>
                <option value="live">Simulated Live</option>
              </select>
            </div>
            <button onClick={exportCSV} className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm">
              Export CSV
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <MetricCards {...{ temp, humidity, soil, light, irrigationOn, history }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Temperature & Humidity Chart */}
          <section className="lg:col-span-2 bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Temperature & Humidity</h3>
            <TempHumidityChart data={chartData} />
          </section>

          {/* Quick Controls */}
          <QuickControls
            irrigationOn={irrigationOn}
            toggleIrrigation={toggleIrrigation}
            trimHistory={trimHistory}
            barData={barData}
            events={events}
            formatTime={formatTime}
          />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 mt-6">
          Simulated data — replace simulator with real sensor feed (WebSocket / REST) for production.
        </footer>
      </div>
    </div>
  );
};

export default DashBoardD;
