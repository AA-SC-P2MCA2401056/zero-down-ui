/*
Greenhouse Dashboard — Single-file React component (default export)

Requirements:
- Tailwind CSS configured in your project
- Install dependencies:
  npm install recharts framer-motion

How to use:
- Drop this file into your React app (e.g. src/components/GreenhouseDashboard.jsx)
- Import and render <GreenhouseDashboard /> in your app

Features:
- Metric cards: Temperature, Humidity, Soil Moisture, Light
- Live / Mock toggle (simulated live updates using setInterval)
- Line chart for Temperature & Humidity (Recharts)
- Bar chart for Soil Moisture and Light
- Recent events table, irrigation control toggle, CSV export
- Small animations using Framer Motion

This component is self-contained and simulates sensor data. Replace the simulator with real WebSocket or REST calls to connect real sensors.
*/

import React, { useEffect, useMemo, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

function formatTime(d) {
  const t = new Date(d);
  return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function randomNoise(scale = 1) {
  return (Math.random() - 0.5) * scale;
}

export default function DashBoardD() {
  // mode: "mock" or "live" (live here is simulated)
  const [mode, setMode] = useState("mock");

  // sensors state: latest values
  const [temp, setTemp] = useState(26.4);
  const [humidity, setHumidity] = useState(58.2);
  const [soil, setSoil] = useState(42);
  const [light, setLight] = useState(720);

  // history for charts (keep last 60 points)
  const [history, setHistory] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 20 }).map((_, i) => ({
      time: now - (19 - i) * 30000,
      temp: 24 + Math.sin(i / 3) * 2 + randomNoise(0.5),
      humidity: 55 + Math.cos(i / 4) * 3 + randomNoise(1),
      soil: 40 + Math.sin(i / 5) * 6 + randomNoise(2),
      light: 600 + Math.max(0, Math.sin(i / 2) * 200) + randomNoise(20),
    }));
  });

  // events/logs
  const [events, setEvents] = useState([
    { id: 1, time: Date.now() - 1000 * 60 * 30, msg: "System started" },
    { id: 2, time: Date.now() - 1000 * 60 * 15, msg: "Irrigation cycle finished" },
  ]);

  // irrigation state
  const [irrigationOn, setIrrigationOn] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    // Simulate live updates every 5 seconds
    if (timerRef.current) clearInterval(timerRef.current);
    const interval = mode === "mock" ? 5000 : 3000; // faster in 'live' mode (simulated)
    timerRef.current = setInterval(() => {
      const t = Date.now();
      // Simulate natural variations and diurnal light pattern
      const minutes = new Date(t).getHours() + new Date(t).getMinutes() / 60;
      const diurnal = Math.max(0, Math.sin((minutes / 24) * Math.PI * 2));

      const nextTemp = Math.max(15, 24 + Math.sin(t / 60000) * 3 + randomNoise(0.8));
      const nextHumidity = Math.min(100, Math.max(20, 55 + Math.cos(t / 90000) * 4 + randomNoise(1.2)));
      const nextSoil = Math.max(0, Math.min(100, soil + (irrigationOn ? 6 + randomNoise(2) : -0.5 + randomNoise(0.6))));
      const nextLight = Math.max(0, 200 + diurnal * 900 + randomNoise(40));

      setTemp(Number(nextTemp.toFixed(2)));
      setHumidity(Number(nextHumidity.toFixed(1)));
      setSoil(Number(nextSoil.toFixed(1)));
      setLight(Math.round(nextLight));

      setHistory(h => {
        const nxt = [...h, { time: t, temp: nextTemp, humidity: nextHumidity, soil: nextSoil, light: nextLight }];
        if (nxt.length > 60) nxt.shift();
        return nxt;
      });

      // occasional events
      if (Math.random() < 0.05) {
        const id = Math.floor(Math.random() * 100000);
        setEvents(ev => [{ id, time: t, msg: Math.random() < 0.5 ? "Sensor calibration" : "Auto irrigation triggered" }, ...ev].slice(0, 10));
      }
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [mode, irrigationOn, soil]);

  const chartData = useMemo(() => history.map(p => ({
    time: formatTime(p.time),
    temp: Number(p.temp.toFixed(2)),
    humidity: Number(p.humidity.toFixed(1)),
  })), [history]);

  const barData = useMemo(() => {
    const last = history[history.length - 1] || {};
    return [
      { name: "Soil Moisture", value: Number((last.soil ?? soil).toFixed(1)) },
      { name: "Light", value: Math.round(last.light ?? light) },
    ];
  }, [history, soil, light]);

  function toggleIrrigation() {
    setIrrigationOn(v => {
      const next = !v;
      setEvents(ev => [{ id: Date.now(), time: Date.now(), msg: next ? "Irrigation turned ON" : "Irrigation turned OFF" }, ...ev].slice(0, 10));
      return next;
    });
  }

  function exportCSV() {
    const rows = ["time,temp,humidity,soil,light", ...history.map(h => `${new Date(h.time).toISOString()},${h.temp.toFixed(2)},${h.humidity.toFixed(1)},${h.soil.toFixed(1)},${Math.round(h.light)}`)];
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `greenhouse-data-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Greenhouse Dashboard</h1>
            <p className="text-sm text-slate-600">Real-time monitoring & controls</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
              <label className="text-xs text-slate-500">Mode</label>
              <select className="text-sm" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="mock">Mock</option>
                <option value="live">Simulated Live</option>
              </select>
            </div>
            <button onClick={exportCSV} className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm">Export CSV</button>
          </div>
        </header>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Temperature</p>
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-semibold">{temp}°C</h2>
              <div className="text-sm text-slate-500">Set: 25°C</div>
            </div>
            <p className="text-xs text-slate-400 mt-1">Last updated: {formatTime(history[history.length - 1]?.time ?? Date.now())}</p>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Humidity</p>
            <h2 className="text-3xl font-semibold">{humidity}%</h2>
            <p className="text-xs text-slate-400 mt-1">Comfort range: 50% - 70%</p>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Soil Moisture</p>
            <h2 className="text-3xl font-semibold">{soil}%</h2>
            <p className="text-xs text-slate-400 mt-1">Irrigation: {irrigationOn ? "ON" : "OFF"}</p>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="bg-white p-4 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Light</p>
            <h2 className="text-3xl font-semibold">{light} lx</h2>
            <p className="text-xs text-slate-400 mt-1">Auto shades: disabled</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">Temperature & Humidity</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" minTickGap={20} />
                  <YAxis yAxisId="left" domain={[0, 'dataMax + 10']} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 'dataMax + 10']} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff6b6b" dot={false} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#4c9aff" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <aside className="bg-white p-4 rounded-2xl shadow flex flex-col gap-4">
            <div>
              <h4 className="text-sm text-slate-500">Quick Controls</h4>
              <div className="mt-3 flex gap-3">
                <button onClick={toggleIrrigation} className={`px-4 py-2 rounded-lg text-sm ${irrigationOn ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {irrigationOn ? 'Stop Irrigation' : 'Start Irrigation'}
                </button>

                <button onClick={() => { setHistory(h => h.slice(-10)); setEvents(e => [{ id: Date.now(), time: Date.now(), msg: 'Cleared history' }, ...e].slice(0,10)); }} className="px-3 py-2 rounded-lg bg-slate-100 text-sm">Trim History</button>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-500">Soil & Light</h4>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-500">Recent Events</h4>
              <ul className="mt-2 space-y-2">
                {events.map(ev => (
                  <li key={ev.id} className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                    <div className="flex justify-between text-xs text-slate-400"><span>{formatTime(ev.time)}</span></div>
                    <div className="mt-1">{ev.msg}</div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Logs / Table */}
        <section className="bg-white p-4 rounded-2xl shadow mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Recent Sensor Log</h3>
            <div className="text-sm text-slate-500">Points: {history.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Temperature (°C)</th>
                  <th className="py-2 pr-4">Humidity (%)</th>
                  <th className="py-2 pr-4">Soil (%)</th>
                  <th className="py-2 pr-4">Light (lx)</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().slice(0, 12).map((h, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 pr-4">{formatTime(h.time)}</td>
                    <td className="py-2 pr-4">{h.temp.toFixed(2)}</td>
                    <td className="py-2 pr-4">{h.humidity.toFixed(1)}</td>
                    <td className="py-2 pr-4">{h.soil.toFixed(1)}</td>
                    <td className="py-2 pr-4">{Math.round(h.light)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-center text-xs text-slate-400 mt-6">Simulated data — replace simulator with real sensor feed (WebSocket / REST) for production.</footer>
      </div>
    </div>
  );
}