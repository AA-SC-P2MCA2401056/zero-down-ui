import React, { useEffect, useMemo, useState, useRef } from "react";
import MetricCards from "../components/MetricCards";
import { TempHumidityChart } from "../components/Charts";
import QuickControls from "../components/QuickControls";
import { formatTime } from "../common/utils"; 
import toast from "react-hot-toast";
import ApiConfig from "../api/apiConfig";

// 🔥 Firebase
import { ref, onValue, off } from "firebase/database";
import { db } from "../api/firebaseConfig";

const DashBoardD = () => {
  // ---------------------------------------------
  // Mode
  // ---------------------------------------------
  const [mode, setMode] = useState("live");

  // ---------------------------------------------
  // Metric card values
  // ---------------------------------------------
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soil, setSoil] = useState(0);
  const [light, setLight] = useState(0);

  const [irrigationOn, setIrrigationOn] = useState(false);

  // 🔥 NEW: latest Firebase timestamp (for LIVE / STALE)
  const [latestTimestamp, setLatestTimestamp] = useState(null);

  // ---------------------------------------------
  // History (chart)
  // ---------------------------------------------
  const [history, setHistory] = useState([]);

  const [events, setEvents] = useState([
    { id: 1, time: Date.now(), msg: "Dashboard loaded" },
  ]);

  // 🔥 NEW: LIVE / STALE computation (Phase 5)
  const isLive =
    latestTimestamp && Date.now() - latestTimestamp < 15000; // 15 seconds

  // =========================================================
  // 1️⃣ LOAD HISTORY FROM DB (ON PAGE LOAD)
  // =========================================================
  const fetchLatest = async () => {
    try {
      const data = await ApiConfig.getRequest(
        ApiConfig.ENDPOINTS.SNAPSHOT
      );

      if (!data) return;

      setTemp(Number(data.temp));
      setHumidity(Number(data.humidity));
      setSoil(Number(data.soil));
      setLight(Number(data.light));

      // 🔥 ALSO update timestamp for LIVE/STALE logic
      setLatestTimestamp(data.timestamp);

    } catch (err) {
      toast.error("Failed to fetch latest sensor values");
    }
  };


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await ApiConfig.getRequest(
          ApiConfig.ENDPOINTS.SENSOR_DASHBOARD_HISTORY,
          { minutes: 30 }
        );

        if (Array.isArray(data)) {
          setHistory(
            data.map(item => ({
              time: item.time,
              temp: item.temp,
              humidity: item.humidity,
              soil: item.soil,
              light: item.light,
            }))
          );

          // ✅ NOW fetch latest snapshot
          fetchLatest();
        }
      } catch {
        setHistory([]);
      }
    };

    fetchHistory();
  }, []);


  // =========================================================
  // 2️⃣ FIREBASE LIVE DATA (REAL-TIME)
  // =========================================================
  useEffect(() => {
    if (mode !== "live") return;

    const sensorRef = ref(db, "live/esp32_1");

    // 🔥 NEW: store unsubscribe function properly
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const liveTemp = Number(data.temperature);
      const liveHumidity = Number(data.humidity);
      const liveTime = Number(data.timestamp);

      if (!liveTime) return;

      // 🔥 UPDATE METRIC CARDS (LIVE)
      setTemp(liveTemp);
      setHumidity(liveHumidity);

      // 🔥 NEW: update timestamp for LIVE / STALE badge
      setLatestTimestamp(liveTime);

      // 🔥 Append to chart history (DEDUP LOGIC)
      setHistory((prev) => {
        const exists = prev.some((p) => p.time === liveTime);
        if (exists) return prev;

        const arr = Array.isArray(prev) ? prev : [];

        const nextPoint = {
          time: liveTime,
          temp: liveTemp,
          humidity: liveHumidity,
          soil: arr[arr.length - 1]?.soil ?? soil,
          light: arr[arr.length - 1]?.light ?? light,
        };

        return [...arr, nextPoint].slice(-30);
      });
    });

    // 🔥 NEW: proper Firebase cleanup
    return () => off(sensorRef);
  }, [mode, soil, light]);

  // ---------------------------------------------
  // Login toast
  // ---------------------------------------------
  useEffect(() => {
    const shouldToast = localStorage.getItem("showLoginToast");
    if (shouldToast === "true") {
      toast.success("Welcome to your greenhouse 🌿", { duration: 2000 });
      localStorage.removeItem("showLoginToast");
    }
  }, []);

  // ---------------------------------------------
  // CHART DATA
  // ---------------------------------------------
  const chartData = useMemo(() => {
    const arr = Array.isArray(history) ? history : [];
    const visible = arr.length > 30 ? arr.slice(-30) : arr;

    return visible.map((p) => ({
      time: formatTime(p.time),
      temp: Number(p.temp.toFixed(2)),
      humidity: Number(p.humidity.toFixed(1)),
    }));
  }, [history]);

  // ---------------------------------------------
  // Bar chart data
  // ---------------------------------------------
  const barData = useMemo(() => {
    const last = history[history.length - 1] || {};
    return [
      { name: "Soil", value: last.soil ?? soil },
      { name: "Light", value: last.light ?? light },
    ];
  }, [history, soil, light]);

  // ---------------------------------------------
  // Controls
  // ---------------------------------------------
  const toggleIrrigation = () => {
    setIrrigationOn((v) => !v);
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
            <p className="text-sm text-slate-600">
              Real-time monitoring & controls
            </p>
          </div>
        </header>

        {/* 🔥 Metric Cards (NEW: pass isLive) */}
        <MetricCards
          temp={temp}
          humidity={humidity}
          soil={soil}
          light={light}
          irrigationOn={irrigationOn}
          history={history}
          isLive={isLive}   
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <section className="lg:col-span-2 bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">
              Temperature & Humidity
            </h3>
            <TempHumidityChart data={chartData} />
          </section>

          <QuickControls
            irrigationOn={irrigationOn}
            toggleIrrigation={toggleIrrigation}
            barData={barData}
            events={events}
            formatTime={formatTime}
          />
        </div>

        <footer className="text-center text-xs text-slate-400 mt-6">
          {isLive ? "Live data from ESP32" : "Sensor offline / stale"}
        </footer>
      </div>
    </div>
  );
};

export default DashBoardD;
