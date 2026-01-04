import React, { useEffect, useState } from "react";
import SensorTable from "../components/SensorTable";
import ApiConfig from "../api/apiConfig";
import DatePicker from "react-datepicker";
import { useLoading } from "../common/LoadingContext";

const SensorLog = () => {

  const { setLoading } = useLoading();

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size, setSize] = useState(10);
  const [fromDT, setFromDT] = useState(null);
  const [toDT, setToDT] = useState(null);

  const formatDT = (d) => {
    if (!d) return "";
    const pad = n => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };

  const fetchHistory = async (p = 0, s = size) => {
    setLoading(true);
    try {
      const res = await ApiConfig.getRequest(ApiConfig.ENDPOINTS.SENSOR_HISTORY, {
        page: p,
        size: s,
        from: formatDT(fromDT),
        to: formatDT(toDT)
      });

      setHistory(res?.list || []);
      setTotalPages(res?.totalPage || 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(0); }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sensor Logs</h2>

      {/* FILTER BAR (DATES ONLY) */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end text-sm">

        <div className=" flex gap-4">
          <label className="text-xs text-gray-500">From</label>
          <DatePicker selected={fromDT} onChange={setFromDT} showTimeSelect
            className="w-full border rounded px-2 py-1 text-sm"
            dateFormat="dd-MM-yyyy h:mm aa" />
        </div>

        <div className=" flex gap-4">
          <label className="text-xs text-gray-500">To</label>
          <DatePicker selected={toDT} onChange={setToDT} showTimeSelect
            className="w-full border rounded px-2 py-1 text-sm"
            dateFormat="dd-MM-yyyy h:mm aa" />
        </div>

        <button onClick={() => fetchHistory(0, size)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-3 py-1 h-9">
          Apply Dates
        </button>
      </div>

      {/* Page size selector (top right) */}
      <div className="flex justify-end mb-2 text-sm">
        <select value={size}
          onChange={e => { const s = Number(e.target.value); setSize(s); fetchHistory(0, s); }}
          className="border rounded px-2 py-1">
          {[10,25,50,100].map(n => <option key={n}>{n}</option>)}
        </select>
      </div>

      <SensorTable history={history} />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-1 mt-4 text-sm">

        <button disabled={page===0} onClick={()=>fetchHistory(0)} className="px-2 py-1 border rounded">« First</button>
        <button disabled={page===0} onClick={()=>fetchHistory(page-1)} className="px-2 py-1 border rounded">‹ Prev</button>

        {[...Array(totalPages)].slice(Math.max(0,page-2), page+3).map((_,i)=>{
          const p = Math.max(0,page-2)+i;
          return (
            <button key={p}
              onClick={()=>fetchHistory(p)}
              className={`px-2 py-1 rounded ${p===page?"bg-emerald-500 text-white":"border"}`}>
              {p+1}
            </button>
          );
        })}

        {page+3 < totalPages && <span className="px-1">…</span>}
        {totalPages>0 && (
          <button onClick={()=>fetchHistory(totalPages-1)} className="px-2 py-1 border rounded">{totalPages}</button>
        )}

        <button disabled={page+1>=totalPages} onClick={()=>fetchHistory(page+1)} className="px-2 py-1 border rounded">Next ›</button>
        <button disabled={page+1>=totalPages} onClick={()=>fetchHistory(totalPages-1)} className="px-2 py-1 border rounded">Last »</button>
      </div>
    </div>
  );
};

export default SensorLog;
