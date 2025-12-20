import React from "react";
import { motion } from "framer-motion";
import { formatTime } from "../common/utils";

const MetricCards = (props) => {
  const { temp, humidity, soil, light, irrigationOn, history, isLive } = props;

  // 🔥 NEW: common opacity when sensor is stale
  const fadeClass = isLive ? "opacity-100" : "opacity-60";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <motion.div initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-white p-4 rounded-2xl shadow ${fadeClass}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Temperature</p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              isLive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isLive ? "LIVE" : "STALE"}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-semibold">{temp}°C</h2>
          <div className="text-sm text-slate-500">Set: 25°C</div>
        </div>

        <p className="text-xs text-slate-400 mt-1">
          Last updated:{" "}
          {formatTime(history[history.length - 1]?.time ?? Date.now())}
        </p>
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
  );
};

export default MetricCards;

