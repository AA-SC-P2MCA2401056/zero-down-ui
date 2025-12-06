import React, { useEffect, useMemo, useState, useRef } from "react";
import MetricCards from "../components/MetricCards";
import { TempHumidityChart } from "../components/Charts";
import QuickControls from "../components/QuickControls";
import { formatTime, randomNoise } from "../common/utils";
import toast from "react-hot-toast";
import ApiConfig from "../api/apiConfig";

const DashBoardD = () => {
  // Mode: "mock" or "live"
  const [mode, setMode] = useState("live");

  // Latest sensor values (for MetricCards)
  const [temp, setTemp] = useState(26.4);
  const [humidity, setHumidity] = useState(58.2);
  const [soil, setSoil] = useState(42);
  const [light, setLight] = useState(720);

  const [irrigationOn, setIrrigationOn] = useState(false);
  const timerRef = useRef(null);

  // History driving charts & tables
  const [history, setHistory] = useState([]);

  const [events, setEvents] = useState([
    { id: 1, time: Date.now() - 1000 * 60 * 30, msg: "System started" },
    { id: 2, time: Date.now() - 1000 * 60 * 15, msg: "Irrigation cycle finished" },
  ]);

  // ---------------------------------------------
  // Fetch history every 30s (DRIVES THE CHART)
  // ---------------------------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log("Fetching sensor history...");
        const data = await ApiConfig.getRequest(
          ApiConfig.ENDPOINTS.SENSOR_DASHBOARD_HISTORY,
          { minutes: 30 } // last 30 mins
        );

        console.log("History API response:", data);

        if (Array.isArray(data)) {
          const normalized = data.map((item) => ({
            time: item.time ?? Date.now(),
            temp: Number(item.temp ?? 0),
            humidity: Number(item.humidity ?? 0),
            soil: Number(item.soil ?? 0),
            light: Number(item.light ?? 0),
          }));
          setHistory(normalized);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error("Failed to load sensor history:", error);
        setHistory([]);
      }
    };

    // Initial fetch
    fetchHistory();

    // Refresh every 30 seconds (30000 ms)
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------
  // One-time login toast
  // ---------------------------------------------
  useEffect(() => {
    const shouldToast = localStorage.getItem("showLoginToast");
    if (shouldToast === "true") {
      toast.success("Welcome to your greenhouse 🌿", { duration: 2000 });
      localStorage.removeItem("showLoginToast");
    }
  }, []);

  // ---------------------------------------------
  // Latest snapshot: ONLY updates MetricCards
  // ---------------------------------------------
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const fetchLatest = async () => {
      try {
        console.log("Fetching latest sensor data...");
        const data = await ApiConfig.getRequest(ApiConfig.ENDPOINTS.SNAPSHOT);
        console.log("Latest API response:", data);

        const nextTemp = Number((data?.temp ?? temp).toFixed(2));
        const nextHumidity = Number((data?.humidity ?? humidity).toFixed(1));
        const nextSoil = Number((data?.soil ?? soil).toFixed(1));
        const nextLight = Math.round(data?.light ?? light);

        setTemp(nextTemp);
        setHumidity(nextHumidity);
        setSoil(nextSoil);
        setLight(nextLight);

      } catch (err) {
        console.error("Failed to fetch latest dashboard data:", err);
        toast.error("Failed to fetch latest sensor values");
      }
    };

    if (mode === "live") {
      fetchLatest(); // immediate
      timerRef.current = setInterval(fetchLatest, 5000); // every 5s
      return () => clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, irrigationOn, soil, temp, humidity, light]);

  // ---------------------------------------------
  // Chart data (MAX 25 POINTS)
  // ---------------------------------------------
  const chartData = useMemo(() => {
    const arr = Array.isArray(history) ? history : [];
    // show only the last 25 points on X axis
    const visible =
      arr.length > 30 ? arr.slice(arr.length - 30) : arr;

    return visible.map((p) => ({
      time: formatTime(p.time),
      temp: Number(p.temp.toFixed(2)),
      humidity: Number(p.humidity.toFixed(1)),
    }));
  }, [history]);

  // ---------------------------------------------
  // Bar chart data for Soil & Light
  // ---------------------------------------------
  const barData = useMemo(() => {
    const arr = Array.isArray(history) ? history : [];
    const last = arr[arr.length - 2] || {};
    return [
      { name: "Soil", value: Number((last.soil ?? soil).toFixed(1)) },
      { name: "Light", value: Math.round(last.light ?? light) },
    ];
  }, [history, soil, light]);

  // ---------------------------------------------
  // Quick Controls: Irrigation toggle
  // ---------------------------------------------
  const toggleIrrigation = () => {
    setIrrigationOn((v) => {
      const next = !v;
      setEvents((ev) =>
        [
          {
            id: Date.now(),
            time: Date.now(),
            msg: next ? "Irrigation turned ON" : "Irrigation turned OFF",
          },
          ...ev,
        ].slice(0, 10)
      );
      return next;
    });
  };

  // Trim sensor history
  const trimHistory = () => {
    setHistory((h) => {
      const arr = Array.isArray(h) ? h : [];
      return arr.slice(-10);
    });
    setEvents((e) => [
      { id: Date.now(), time: Date.now(), msg: "Cleared history" },
      ...e,
    ].slice(0, 10));
  };

  // ---------------------------------------------
  // CSV Export
  // ---------------------------------------------
  const exportCSV = () => {
    const arr = Array.isArray(history) ? history : [];
    const rows = [
      "time,temp,humidity,soil,light",
      ...arr.map(
        (h) =>
          `${new Date(h.time).toISOString()},${h.temp.toFixed(2)},${h.humidity.toFixed(
            1
          )},${h.soil.toFixed(1)},${Math.round(h.light)}`
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
              <select
                className="text-sm"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="mock">Mock</option>
                <option value="live">Live (API)</option>
              </select>
            </div>
            <button
              onClick={exportCSV}
              className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm"
            >
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
          {mode === "mock"
            ? "Simulated data — switch to Live mode to use real sensor feed."
            : "Live data from backend (history every 30s, snapshot every 5s)"}
        </footer>
      </div>
    </div>
  );
};

export default DashBoardD;
