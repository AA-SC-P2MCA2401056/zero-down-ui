import { formatTime } from "../common/utils";
import React from "react";

const SensorTable = ({ history }) => {
  // Ensure "history" is always a valid array
  const safeHistory = Array.isArray(history) ? history : [];

  // Safely pick latest items
  const latest = [...safeHistory].reverse().slice(0, 12);

  // Safe format helper (avoids null.toFixed() crash)
  const safeNumber = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "-";
    }
    return Number(value).toFixed(decimals);
  };

  return (
    <section className="bg-white p-4 rounded-2xl shadow mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Recent Sensor Log</h3>
        <div className="text-sm text-slate-500">
          Points: {safeHistory.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Temperature (°C)</th>
              <th className="py-2 pr-4">Humidity (%)</th>
              <th className="py-2 pr-4">Soil (%)</th>
              <th className="py-2 pr-4">Light (lx)</th>
            </tr>
          </thead>

          <tbody>
            {latest.length === 0 ? (
              <tr>
                <td className="py-3 text-center text-slate-400" colSpan={5}>
                  No sensor data available
                </td>
              </tr>
            ) : (
              latest.map((h, idx) => (
                <tr key={idx} className="border-t hover:bg-slate-50 transition">

                  <td className="py-2 pr-4">
                    {h?.date ? h.date : "-"}
                  </td>

                  <td className="py-2 pr-4">
                    {h?.time ? formatTime(h.time) : "-"}
                  </td>

                  <td className="py-2 pr-4">
                    {safeNumber(h?.temp, 2)}
                  </td>

                  <td className="py-2 pr-4">
                    {safeNumber(h?.humidity, 1)}
                  </td>

                  <td className="py-2 pr-4">
                    {safeNumber(h?.soil, 1)}
                  </td>

                  <td className="py-2 pr-4">
                    {h?.light === null || h?.light === undefined
                      ? "-"
                      : Math.round(h.light)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SensorTable;
