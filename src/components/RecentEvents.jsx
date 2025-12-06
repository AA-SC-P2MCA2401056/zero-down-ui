import React from "react";

const RecentEvents = ({ events }) => {
  const formatTime = (t) =>
    new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <h4 className="text-sm text-slate-500">Recent Events</h4>
      <ul className="mt-2 space-y-2">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="text-sm text-slate-700 bg-slate-50 p-2 rounded"
          >
            <div className="flex justify-between text-xs text-slate-400">
              <span>{formatTime(ev.time)}</span>
            </div>
            <div className="mt-1">{ev.msg}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentEvents;
