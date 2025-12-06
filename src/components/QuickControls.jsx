import React from "react";
import { SoilLightChart } from "./Charts";

const QuickControls = (props) => {
  const { irrigationOn, toggleIrrigation, trimHistory, barData, events, formatTime } = props;

  return (
    <aside className="bg-white p-4 rounded-2xl shadow flex flex-col gap-4">
      <div>
        <h4 className="text-sm text-slate-500">Quick Controls</h4>
        <div className="mt-3 flex gap-3">
          <button
            onClick={toggleIrrigation}
            className={`px-4 py-2 rounded-lg text-sm ${irrigationOn ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            {irrigationOn ? 'Stop Irrigation' : 'Start Irrigation'}
          </button>
          <button
            onClick={trimHistory}
            className="px-3 py-2 rounded-lg bg-slate-100 text-sm"
          >
            Trim History
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm text-slate-500">Soil & Light</h4>
        <SoilLightChart data={barData} />
      </div>

      <div>
        <h4 className="text-sm text-slate-500">Recent Events</h4>
        <ul className="mt-2 space-y-2">
          {events.map(ev => (
            <li key={ev.id} className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{formatTime(ev.time)}</span>
              </div>
              <div className="mt-1">{ev.msg}</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default QuickControls;
