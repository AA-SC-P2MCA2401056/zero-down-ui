import React from "react";
import { Edit, Trash2} from "lucide-react";
import SensorTypeBadge from "../../common/SensorBadge";

const ActiveBadge = ({ active }) => {
  return active ? (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
      Active
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500">
      Inactive
    </span>
  );
};

const SensorTable = ({ sensors, onEdit, onDelete, onToggleActive }) => {
  if (!sensors || sensors.length === 0) {
    return (
      <div className="text-sm text-slate-400 py-6 text-center">
        No sensors configured yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-slate-500 border-b">
          <tr>
            <th className="py-2 pr-4 text-left">Name</th>
            <th className="py-2 pr-4 text-left">Type</th>
            <th className="py-2 pr-4 text-left">Location</th>
            <th className="py-2 pr-4 text-left">Pin</th>
            <th className="py-2 pr-4 text-left">Status</th>
            <th className="py-2 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((s) => (
            <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
              <td className="py-2 pr-4">
                <div className="font-medium text-slate-800">{s.name}</div>
                <div className="text-xs text-slate-400">
                  ID: {s.id}
                  {s.greenhouseId && ` · GH: ${s.greenhouseId}`}
                </div>
              </td>
              <td className="py-2 pr-4">
                <SensorTypeBadge type={s.type} />
              </td>
              <td className="py-2 pr-4">
                <span className="text-xs text-slate-700">
                  {s.location || "-"}
                </span>
              </td>
              <td className="py-2 pr-4">
                <span className="text-xs text-slate-700">
                  {s.pinNumber || s.pin_number || "-"}
                </span>
              </td>
              <td className="py-2 pr-4">
                <ActiveBadge active={!!s.isActive} />
              </td>
                <td className="py-2 pr-0 text-right">
                    <div className="flex items-center justify-end gap-2">

                        

                        {/* Edit */}
                        <button
                        onClick={() => onEdit(s)}
                        className="p-1.5 rounded-md border border-blue-200 hover:bg-blue-50"
                        title="Edit"
                        >
                        <Edit size={16} className="text-blue-600" />
                        </button>

                        {/* Delete */}
                        <button
                        onClick={() => onDelete(s)}
                        className="p-1.5 rounded-md border border-rose-200 hover:bg-rose-50"
                        title="Delete"
                        >
                        <Trash2 size={16} className="text-rose-600" />
                        </button>

                    </div>
                </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorTable;
