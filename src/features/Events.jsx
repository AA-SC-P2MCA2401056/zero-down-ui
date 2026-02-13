import React, { useEffect, useState } from "react";
import { formatTime } from "../common/utils";
import ApiConfig from "../api/apiConfig";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        // 🔹 Change endpoint if needed
        const res = await ApiConfig.get("/api/v1/events/latest");
        setEvents(res.data || []);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">

        <h1 className="text-2xl font-semibold mb-4">Events</h1>

        {loading && (
          <p className="text-sm text-slate-400">Loading events...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-sm text-slate-400">No events recorded</p>
        )}

        <ul className="divide-y">
          {events.map((event) => (
            <li
              key={event.id}
              className="py-3 flex justify-between items-center"
            >
              <span className="text-slate-800">{event.msg}</span>
              <span className="text-xs text-slate-400">
                {formatTime(event.time)}
              </span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default Events;

