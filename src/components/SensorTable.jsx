import { formatTime } from "../common/utils";
import React from 'react'

const SensorTable = (props) => {
  const history = props.history;
  return (
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
  );
}

export default SensorTable

