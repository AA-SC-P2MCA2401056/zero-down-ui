import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import ApiConfig from "../api/apiConfig";
import { useLoading } from "../common/LoadingContext";
import DatePicker from "react-datepicker";

const AdminSensorAnalytics = () => {

  const { setLoading } = useLoading();
  const [sensorInfo, setSensorInfo] = useState(null);


  const [sensors, setSensors] = useState([]);
  const [selected, setSelected] = useState("");

  const [logs, setLogs] = useState([]);
  const [chart, setChart] = useState([]);
  const [summary, setSummary] = useState({});

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(10);
  const [jump, setJump] = useState(1);

  const [fromDT, setFromDT] = useState(null);
  const [toDT, setToDT] = useState(null);

  useEffect(() => {
    setLoading(true);
    ApiConfig.getRequest("/api/admin/sensors")
      .then(d => setSensors(d || []))
      .finally(() => setLoading(false));
  }, []);

  const formatDT = (d) => {
    if (!d) return "";
    const pad = (n) => n.toString().padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };


  const loadAnalytics = async (sensorId, p = 0, s = size) => {
    if (!sensorId) return;

    setSelected(sensorId);
    setPage(p);
    setLoading(true);

    const params = {
      page: p,
      size: s,
      from: formatDT(fromDT),
      to: formatDT(toDT)
    };

    const meta = await ApiConfig.getRequest(`/api/admin/sensors/${sensorId}`);
    setSensorInfo(meta);

    const logData = await ApiConfig.getRequest(`${ApiConfig.ENDPOINTS.ADMIN_SENSORS_LOGS}${sensorId}/logs`, params);
    const chartData = await ApiConfig.getRequest(`${ApiConfig.ENDPOINTS.ADMIN_SENSORS_LOGS}${sensorId}/chart`, params);
    const summaryData = await ApiConfig.getRequest(`${ApiConfig.ENDPOINTS.ADMIN_SENSORS_LOGS}${sensorId}/summary`, params);

    setLogs(logData?.list || []);
    setTotalPages(logData?.totalPage || 0);
    setChart(chartData || []);
    setSummary(summaryData || {});

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">📊 Sensor Analytics</h2>

        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Sensor</label>
            <select
            className="w-full rounded-lg border px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => loadAnalytics(e.target.value)}
            >
            <option value="">Select Sensor</option>
            {sensors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">From</label>
            <DatePicker
            selected={fromDT}
            onChange={date => setFromDT(date)}
            showTimeSelect
            timeIntervals={5}
            dateFormat="dd-MM-yyyy h:mm aa"
            className="w-full rounded-lg border px-3 py-2 bg-gray-50"
            placeholderText="Select start"
            />
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">To</label>
            <DatePicker
            selected={toDT}
            onChange={date => setToDT(date)}
            showTimeSelect
            timeIntervals={5}
            dateFormat="dd-MM-yyyy h:mm aa"
            className="w-full rounded-lg border px-3 py-2 bg-gray-50"
            placeholderText="Select end"
            />
        </div>

        <button
            onClick={() => loadAnalytics(selected, 0)}
            className="h-10 mt-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow"
        >
            Apply
        </button>
        </div>

        {sensorInfo && (
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow p-5 flex flex-wrap justify-between items-center">

            <div>
            <p className="text-xs text-gray-500 uppercase">Sensor</p>
            <p className="text-xl font-bold text-emerald-700">{sensorInfo.name}</p>
            <p className="text-sm text-gray-600">{sensorInfo.type}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
                <p className="text-gray-500">Created</p>
                <p className="font-semibold">{new Date(sensorInfo.createdAt).toLocaleString()}</p>
            </div>

            <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-semibold">{new Date(sensorInfo.updatedAt).toLocaleString()}</p>
            </div>

            <div>
                <p className="text-gray-500">Last Live</p>
                <p className="font-semibold">{new Date(sensorInfo.lastLiveAt).toLocaleString()}</p>
            </div>

            <div>
                <p className="text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${sensorInfo.online ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {sensorInfo.online ? "ONLINE" : "OFFLINE"}
                </span>
            </div>
            </div>
        </div>
        )}


      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">

        <InsightStat title="Minimum" value={summary.min} time={summary.minTime}/>
        <InsightStat title="Maximum" value={summary.max} time={summary.maxTime}/>
        <InsightStat title="Average" value={summary.avg?.toFixed(2)} time={summary.to} suffix="till"/>
        <InsightStat title="Readings" value={summary.count} time={summary.to} suffix="readings till"/>

      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-2 text-gray-700">Sensor Trend</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <XAxis dataKey="recordedTime" tick={{ fontSize: 10 }}/>
            <YAxis tick={{ fontSize: 11 }}/>
            <Tooltip/>
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-3 text-gray-700">Log History</h3>

        <div className="flex justify-between items-center mb-2">
          <select value={size}
            onChange={e => { setSize(e.target.value); loadAnalytics(selected, 0, e.target.value); }}
            className="border rounded px-2 py-1">
            {[10,25,50,100].map(n => <option key={n}>{n}</option>)}
          </select>

          <div className="flex gap-2">
            <input type="number" min="1" max={totalPages} value={jump}
              onChange={e => setJump(e.target.value)}
              className="border w-16 rounded px-2"/>
            <button onClick={() => loadAnalytics(selected, jump-1)} className="px-3 py-1 bg-gray-200 rounded">Go</button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Value</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="2" className="text-center py-6 text-gray-400">No logs found</td></tr>
            ) : logs.map((l,i)=>(
              <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-emerald-50">
                {(() => {
                    const d = new Date(l.recordedAt);
                    return (
                        <>
                        <td className="p-2">{d.toLocaleDateString()}</td>
                        <td className="p-2">{d.toLocaleTimeString()}</td>
                        <td className="p-2 font-semibold">{l.value}</td>
                        </>
                    );
                })()}

              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-4 mt-4">
          <button disabled={page===0} onClick={()=>loadAnalytics(selected,page-1)} className="btn">← Prev</button>
          <span className="px-3 py-1 bg-gray-100 rounded">{page+1} / {totalPages}</span>
          <button disabled={page+1>=totalPages} onClick={()=>loadAnalytics(selected,page+1)} className="btn">Next →</button>
        </div>
      </div>

    </div>
  );
};

const parseDT = (dt) => dt ? new Date(dt + "Z") : null;

const InsightStat = ({ title, value, time, suffix }) => (
  <div className="rounded-2xl p-4 shadow bg-gradient-to-br from-emerald-50 to-white">
    <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-emerald-600 mt-1">{value ?? "--"}</p>
    {time && (
      <p className="text-xs text-gray-500 mt-1">
        {suffix ? `${suffix} ` : "@ "}
        {parseDT(time).toLocaleString()}
      </p>
    )}
  </div>
);

export default AdminSensorAnalytics;
