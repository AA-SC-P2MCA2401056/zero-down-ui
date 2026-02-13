import { useEffect, useState } from "react";
import ApiConfig from "../api/apiConfig";
import { Thermometer, Leaf, Droplets, Sun, AlertTriangle } from "lucide-react";
import { MdAddRoad } from "react-icons/md";
import { PiPlant } from "react-icons/pi";

export default function Alerts() {

  const [alerts, setAlerts] = useState([]);
  const [seen, setSeen] = useState(() => 
    JSON.parse(localStorage.getItem("seenAlerts") || "[]")
  );


  const loadAlerts = async () => {
    const data = await ApiConfig.getRequest(ApiConfig.ENDPOINTS.ALERT_ACTIVE);
    setAlerts(data || []);
  };

  const markSeen = (id) => {
  const updated = [...new Set([...seen, id])];
    setSeen(updated);
    localStorage.setItem("seenAlerts", JSON.stringify(updated));
  };


  useEffect(() => {
    loadAlerts();
    const i = setInterval(loadAlerts, 5000);
    return () => clearInterval(i);
  }, []);

  const resolve = async (id) => {
    await ApiConfig.putRequest(`${ApiConfig.ENDPOINTS.ALERT_RESOLVE}/${id}/resolve`);
    loadAlerts();
  };

  // Keep your existing side colors
  const typeColor = (type) => {
    if (!type) return "border-gray-400";
    if (type.includes("TEMPERATURE")) return "border-red-500";
    if (type.includes("SOIL")) return "border-blue-500";
    if (type.includes("HUMIDITY")) return "border-purple-500";
    if (type.includes("LIGHT")) return "border-yellow-400";
    return "border-gray-400";
  };

  // Icon only by SENSOR TYPE
  const sensorIcon = (type) => {
    if (!type) return <AlertTriangle size={18} />;
    if (type.includes("TEMPERATURE")) return <Thermometer size={18} />;
    if (type.includes("SOIL")) return <PiPlant size={18} />;
    if (type.includes("HUMIDITY")) return <Droplets size={18} />;
    if (type.includes("LIGHT")) return <Sun size={18} />;
    return <AlertTriangle size={18} />;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🚨 Active Alerts</h2>

      {alerts.length === 0 && (
        <p className="text-green-600">All systems normal 🌿</p>
      )}

      <div className="grid gap-4">
        {alerts.map(a => (
          <div
            key={a.id}
            onClick={() => markSeen(a.id)}
            className={`p-4 rounded-xl shadow border-l-8 cursor-pointer
                ${typeColor(a.type)}
                ${a.level === 'CRITICAL' && !seen.includes(a.id)
                ? 'bg-red-50 animate-pulse'
                : 'bg-orange-50'}`}>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                {sensorIcon(a.type)}
                <div>
                  <p className="font-semibold">{a.message}</p>
                  <p className="text-xs text-gray-500">
                    Sensor: {a.sensorId} • {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <span className={`px-3 py-1 rounded-full text-white text-xs
                  ${a.level === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-400'}`}>
                  {a.level}
                </span>

                <button
                  onClick={() => resolve(a.id)}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Resolve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
